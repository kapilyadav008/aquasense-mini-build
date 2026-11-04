"""
Pytest configuration, fixtures, and mock factory for AquaSense API tests.
"""
import pytest
import responses
from datetime import datetime
from backend_tests.api_client import AquaSenseClient


@pytest.fixture
def base_url() -> str:
    return "https://api.aquasense.io/v1"


@pytest.fixture
def client(base_url: str) -> AquaSenseClient:
    """Provides a fresh AquaSenseClient instance."""
    return AquaSenseClient(base_url=base_url, timeout=3.0, max_stale_seconds=900)


@pytest.fixture
def reference_time() -> datetime:
    """Fixed reference time matching the latest reading timestamp in the test dataset."""
    return datetime.fromisoformat("2026-11-02T20:05:00")


@pytest.fixture
def valid_status_payload() -> dict:
    """Exact device status schema defined in assignment specification."""
    return {
        "level_percent": 55,
        "pump_state": "on",
        "last_seen": "2026-11-02T20:00:00"
    }


@pytest.fixture
def valid_login_payload() -> dict:
    return {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aquasense-valid-token-xyz987",
        "token_type": "Bearer",
        "expires_in": 3600
    }


@pytest.fixture
def mocked_responses():
    """Activates the responses mock adapter for isolated HTTP tests."""
    with responses.RequestsMock(assert_all_requests_are_fired=False) as rsps:
        yield rsps
