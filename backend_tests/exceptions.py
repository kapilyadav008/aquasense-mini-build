"""
Custom exception hierarchy for the AquaSense API Client.
"""

class AquaSenseAPIError(Exception):
    """Base exception for all AquaSense API errors."""
    def __init__(self, message: str, status_code: int = None, response_body: str = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.response_body = response_body


class AuthenticationError(AquaSenseAPIError):
    """Raised when authentication fails due to invalid credentials."""
    pass


class TokenError(AquaSenseAPIError):
    """Raised when an authentication token is missing, null, or malformed."""
    pass


class TokenExpiredError(AquaSenseAPIError):
    """Raised when an authentication token is expired or unauthorized."""
    pass


class DeviceOfflineError(AquaSenseAPIError):
    """Raised when the target device or upstream server is unreachable / 503."""
    pass


class ValidationError(AquaSenseAPIError):
    """Raised when payload validation fails (types, ranges, enum constraints, JSON syntax)."""
    pass


class StaleDataError(ValidationError):
    """Raised when device status contains a timestamp older than allowed staleness threshold."""
    pass
