"""
Automated Pytest Suite for AquaSense IoT Monitoring APIs.
Validates authentication, token enforcement, telemetry schemas, HTTP codes,
edge bounds, device connectivity states, and timestamp freshness.
"""
import pytest
import responses
from datetime import datetime
from requests.exceptions import ConnectionError, Timeout

from backend_tests.api_client import AquaSenseClient
from backend_tests.models import DeviceStatus
from backend_tests.exceptions import (
    AuthenticationError,
    TokenError,
    TokenExpiredError,
    DeviceOfflineError,
    ValidationError,
    StaleDataError,
)


class TestAquaSenseAPISuite:
    """Comprehensive test suite covering all 10 API testing scenarios."""

    # --------------------------------------------------------------------------
    # 1. Successful Login
    # --------------------------------------------------------------------------
    def test_01_successful_login(self, client, mocked_responses, valid_login_payload, base_url):
        """
        Verify that POST /login with valid credentials returns 200 OK,
        yields an auth token, and stores it in the client instance.
        """
        mocked_responses.add(
            responses.POST,
            f"{base_url}/login",
            json=valid_login_payload,
            status=200,
            content_type="application/json",
        )

        token = client.login(username="operator_lead", password="SecurePassword123!")

        assert token == valid_login_payload["token"]
        assert client.token == valid_login_payload["token"]
        assert len(mocked_responses.calls) == 1
        assert mocked_responses.calls[0].request.headers["Content-Type"] == "application/json"

    # --------------------------------------------------------------------------
    # 2. Invalid Login Credentials
    # --------------------------------------------------------------------------
    def test_02_invalid_login_credentials(self, client, mocked_responses, base_url):
        """
        Verify that POST /login with incorrect credentials returns 401 Unauthorized
        and raises an AuthenticationError with status_code 401.
        """
        mocked_responses.add(
            responses.POST,
            f"{base_url}/login",
            json={"error": "Unauthorized", "message": "Invalid username or password"},
            status=401,
            content_type="application/json",
        )

        with pytest.raises(AuthenticationError) as exc_info:
            client.login(username="wrong_user", password="bad_password")

        assert exc_info.value.status_code == 401
        assert "Invalid credentials" in str(exc_info.value)
        assert client.token is None

    # --------------------------------------------------------------------------
    # 3. Missing or Malformed Authentication Token
    # --------------------------------------------------------------------------
    @pytest.mark.parametrize("bad_token", [None, "", "   ", "malformed token with whitespace"])
    def test_03_missing_or_malformed_token(self, client, bad_token):
        """
        Verify that attempting to fetch device status without a token or with a
        malformed token rejects the request client-side by raising TokenError
        before dispatching bad network traffic.
        """
        client.set_token(bad_token)

        with pytest.raises(TokenError) as exc_info:
            client.get_device_status(device_id="tank-alpha-01")

        assert "token" in str(exc_info.value).lower()

    # --------------------------------------------------------------------------
    # 4. Valid Device Status Response
    # --------------------------------------------------------------------------
    def test_04_valid_device_status_response(
        self, client, mocked_responses, valid_status_payload, base_url, reference_time
    ):
        """
        Verify that GET /device/{id}/status returns 200 OK, carries the Bearer token,
        and accurately maps data types (float level, enum string pump_state, datetime last_seen).
        """
        device_id = "tank-alpha-01"
        client.set_token("valid-bearer-token-12345")

        mocked_responses.add(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            json=valid_status_payload,
            status=200,
            content_type="application/json",
        )

        status = client.get_device_status(device_id=device_id, reference_time=reference_time)

        assert isinstance(status, DeviceStatus)
        assert status.level_percent == 55.0
        assert status.pump_state == "on"
        assert status.last_seen == datetime.fromisoformat("2026-11-02T20:00:00")

        # Verify Authorization header was sent properly
        sent_auth_header = mocked_responses.calls[0].request.headers.get("Authorization")
        assert sent_auth_header == "Bearer valid-bearer-token-12345"

    # --------------------------------------------------------------------------
    # 5. Invalid or Expired Token
    # --------------------------------------------------------------------------
    @pytest.mark.parametrize("http_code", [401, 403])
    def test_05_invalid_or_expired_token(self, client, mocked_responses, base_url, http_code):
        """
        Verify that when the API rejects an expired or revoked token with 401/403,
        TokenExpiredError is raised and the status code is recorded.
        """
        device_id = "tank-alpha-01"
        client.set_token("expired-jwt-token-99999")

        mocked_responses.add(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            json={"error": "TokenExpired", "message": "Signature has expired"},
            status=http_code,
            content_type="application/json",
        )

        with pytest.raises(TokenExpiredError) as exc_info:
            client.get_device_status(device_id=device_id)

        assert exc_info.value.status_code == http_code
        assert "expired or unauthorized" in str(exc_info.value)

    # --------------------------------------------------------------------------
    # 6. Device Offline / Server Unavailable
    # --------------------------------------------------------------------------
    def test_06_device_offline_503_status(self, client, mocked_responses, base_url):
        """
        Verify that HTTP 503 Service Unavailable (e.g., IoT gateway disconnected)
        raises DeviceOfflineError.
        """
        device_id = "tank-alpha-01"
        client.set_token("valid-token")

        mocked_responses.add(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            json={"error": "DeviceOffline", "message": "Device ping timed out after 3000ms"},
            status=503,
            content_type="application/json",
        )

        with pytest.raises(DeviceOfflineError) as exc_info:
            client.get_device_status(device_id=device_id)

        assert exc_info.value.status_code == 503
        assert "offline or server unavailable" in str(exc_info.value)

    def test_06b_device_offline_network_timeout(self, client, mocked_responses, base_url):
        """
        Verify that socket-level ConnectionError / Timeout also raises DeviceOfflineError.
        """
        device_id = "tank-alpha-01"
        client.set_token("valid-token")

        mocked_responses.add_callback(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            callback=lambda req: (_ for _ in ()).throw(ConnectionError("No route to IoT host")),
        )

        with pytest.raises(DeviceOfflineError) as exc_info:
            client.get_device_status(device_id=device_id)

        assert "unreachable" in str(exc_info.value).lower()

    # --------------------------------------------------------------------------
    # 7. Malformed JSON Response
    # --------------------------------------------------------------------------
    def test_07_malformed_json_response(self, client, mocked_responses, base_url):
        """
        Verify that an unparseable response body (e.g. truncated JSON or raw HTML 500 error)
        raises a ValidationError instead of crashing with unhandled JSONDecodeError.
        """
        device_id = "tank-alpha-01"
        client.set_token("valid-token")

        mocked_responses.add(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            body="<html><body>502 Bad Gateway</body></html>",
            status=200,  # 200 with non-JSON body
            content_type="text/html",
        )

        with pytest.raises(ValidationError) as exc_info:
            client.get_device_status(device_id=device_id)

        assert "Malformed JSON" in str(exc_info.value)

    # --------------------------------------------------------------------------
    # 8. Tank Level Outside 0–100 Range
    # --------------------------------------------------------------------------
    @pytest.mark.parametrize("invalid_level", [-1, -25.5, 100.1, 150, "fifty-five", None])
    def test_08_tank_level_outside_valid_range(
        self, client, mocked_responses, base_url, invalid_level
    ):
        """
        Verify that tank level readings < 0, > 100, or non-numeric types are rejected
        by schema validation as ValidationError.
        """
        device_id = "tank-alpha-01"
        client.set_token("valid-token")

        payload = {
            "level_percent": invalid_level,
            "pump_state": "on",
            "last_seen": "2026-11-02T20:00:00",
        }

        mocked_responses.add(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            json=payload,
            status=200,
        )

        with pytest.raises(ValidationError) as exc_info:
            client.get_device_status(device_id=device_id)

        assert "level_percent" in str(exc_info.value)

    # --------------------------------------------------------------------------
    # 9. Invalid Pump State
    # --------------------------------------------------------------------------
    @pytest.mark.parametrize("invalid_pump", ["running", "stopped", "paused", "EXPLODING", 123])
    def test_09_invalid_pump_state(self, client, mocked_responses, base_url, invalid_pump):
        """
        Verify that pump_state values other than 'on' or 'off' are rejected
        by domain validation as ValidationError.
        """
        device_id = "tank-alpha-01"
        client.set_token("valid-token")

        payload = {
            "level_percent": 55,
            "pump_state": invalid_pump,
            "last_seen": "2026-11-02T20:00:00",
        }

        mocked_responses.add(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            json=payload,
            status=200,
        )

        with pytest.raises(ValidationError) as exc_info:
            client.get_device_status(device_id=device_id)

        assert "pump_state" in str(exc_info.value)

    # --------------------------------------------------------------------------
    # 10. Stale last_seen Timestamp
    # --------------------------------------------------------------------------
    def test_10_stale_last_seen_timestamp(self, client, mocked_responses, base_url):
        """
        Verify that if the telemetry last_seen timestamp is older than the configured
        staleness threshold (900 seconds / 15 minutes), a StaleDataError is raised.
        """
        device_id = "tank-alpha-01"
        client.set_token("valid-token")

        # Telemetry from 2 hours ago
        payload = {
            "level_percent": 55,
            "pump_state": "on",
            "last_seen": "2026-11-02T18:00:00",
        }

        mocked_responses.add(
            responses.GET,
            f"{base_url}/device/{device_id}/status",
            json=payload,
            status=200,
        )

        # Reference time is 20:00:00 (2 hours newer than telemetry)
        ref_time = datetime.fromisoformat("2026-11-02T20:00:00")

        with pytest.raises(StaleDataError) as exc_info:
            client.get_device_status(device_id=device_id, reference_time=ref_time)

        assert "stale" in str(exc_info.value).lower()
        assert "7200s old" in str(exc_info.value)
