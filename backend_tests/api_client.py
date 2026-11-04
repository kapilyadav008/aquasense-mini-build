"""
AquaSense REST API Client Implementation.
Handles authentication, request signing, status polling, and payload validation.
"""
import json
from typing import Optional
from datetime import datetime
import requests
from requests.exceptions import ConnectionError, Timeout, RequestException

from backend_tests.exceptions import (
    AquaSenseAPIError,
    AuthenticationError,
    TokenError,
    TokenExpiredError,
    DeviceOfflineError,
    ValidationError,
    StaleDataError,
)
from backend_tests.models import DeviceStatus


class AquaSenseClient:
    """Production-grade client for AquaSense IoT Tank Monitoring APIs."""

    def __init__(
        self,
        base_url: str = "https://api.aquasense.io/v1",
        timeout: float = 5.0,
        max_stale_seconds: int = 900,
        session: Optional[requests.Session] = None,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.max_stale_seconds = max_stale_seconds
        self.session = session or requests.Session()
        self.token: Optional[str] = None

    def set_token(self, token: Optional[str]) -> None:
        """Manually sets or clears the Bearer authentication token."""
        self.token = token

    def login(self, username: str, password: str) -> str:
        """
        Authenticates against POST /login and stores bearer token.

        Raises:
            AuthenticationError: On 401 or bad credentials.
            DeviceOfflineError: If server/gateway is unreachable or times out.
            ValidationError: If response JSON is malformed or missing token.
        """
        if not username or not password:
            raise AuthenticationError("Username and password are required")

        url = f"{self.base_url}/login"
        payload = {"username": username, "password": password}

        try:
            response = self.session.post(url, json=payload, timeout=self.timeout)
        except (ConnectionError, Timeout) as exc:
            raise DeviceOfflineError(f"Login failed: Server unreachable ({exc})") from exc
        except RequestException as exc:
            raise AquaSenseAPIError(f"Network error during login: {exc}") from exc

        if response.status_code == 401:
            raise AuthenticationError(
                "Invalid credentials provided",
                status_code=401,
                response_body=response.text,
            )

        if not response.ok:
            raise AquaSenseAPIError(
                f"Login failed with status {response.status_code}",
                status_code=response.status_code,
                response_body=response.text,
            )

        try:
            data = response.json()
        except (ValueError, json.JSONDecodeError) as exc:
            raise ValidationError(
                "Malformed JSON received from /login",
                status_code=response.status_code,
                response_body=response.text,
            ) from exc

        if not isinstance(data, dict) or "token" not in data or not data["token"]:
            raise ValidationError(
                "Response missing valid 'token' field",
                status_code=response.status_code,
                response_body=response.text,
            )

        self.token = str(data["token"])
        return self.token

    def get_device_status(
        self,
        device_id: str,
        override_token: Optional[str] = None,
        reference_time: Optional[datetime] = None,
    ) -> DeviceStatus:
        """
        Fetches the real-time operational status for a tank device from GET /device/{id}/status.

        Raises:
            TokenError: If token is missing, blank, or malformed.
            TokenExpiredError: On 401/403 expired or rejected token.
            DeviceOfflineError: On 503 Service Unavailable or network timeout/unreachable.
            ValidationError: On malformed JSON or domain schema violation.
            StaleDataError: If telemetry timestamp is stale.
        """
        token_to_use = override_token if override_token is not None else self.token

        if token_to_use is None or not str(token_to_use).strip():
            raise TokenError("Missing authentication token. Please login first.")

        # Check for malformed token format (e.g. invalid chars or whitespace corruption)
        if any(c.isspace() for c in token_to_use.strip()):
            raise TokenError("Malformed authentication token: contains illegal whitespace.")

        url = f"{self.base_url}/device/{device_id}/status"
        headers = {
            "Authorization": f"Bearer {token_to_use}",
            "Accept": "application/json",
        }

        try:
            response = self.session.get(url, headers=headers, timeout=self.timeout)
        except (ConnectionError, Timeout) as exc:
            raise DeviceOfflineError(
                f"Device '{device_id}' status check failed: Server or device is unreachable"
            ) from exc
        except RequestException as exc:
            raise AquaSenseAPIError(f"HTTP request failed: {exc}") from exc

        # Handle HTTP Status Codes
        if response.status_code in (401, 403):
            raise TokenExpiredError(
                f"Authentication failed: Token is expired or unauthorized (HTTP {response.status_code})",
                status_code=response.status_code,
                response_body=response.text,
            )

        if response.status_code == 503:
            raise DeviceOfflineError(
                f"Device '{device_id}' is offline or server unavailable (HTTP 503)",
                status_code=503,
                response_body=response.text,
            )

        if not response.ok:
            raise AquaSenseAPIError(
                f"Unexpected HTTP status {response.status_code} for device status",
                status_code=response.status_code,
                response_body=response.text,
            )

        # Parse JSON
        try:
            data = response.json()
        except (ValueError, json.JSONDecodeError) as exc:
            raise ValidationError(
                "Malformed JSON response received from device status endpoint",
                status_code=response.status_code,
                response_body=response.text,
            ) from exc

        # Validate domain structure & bounds
        return DeviceStatus.from_dict(
            data=data,
            reference_time=reference_time,
            max_stale_seconds=self.max_stale_seconds,
        )
