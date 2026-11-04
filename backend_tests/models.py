"""
Data models and validation logic for AquaSense API payloads.
"""
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from backend_tests.exceptions import ValidationError, StaleDataError


VALID_PUMP_STATES = {"on", "off"}


@dataclass
class DeviceStatus:
    """Represents a validated device status payload."""
    level_percent: float
    pump_state: str
    last_seen: datetime

    @classmethod
    def from_dict(
        cls,
        data: dict,
        reference_time: Optional[datetime] = None,
        max_stale_seconds: int = 900
    ) -> "DeviceStatus":
        """
        Validates raw dictionary data from API and returns a DeviceStatus instance.
        Raises ValidationError or StaleDataError on schema or domain rule violation.
        """
        if not isinstance(data, dict):
            raise ValidationError(f"Expected JSON object, got {type(data).__name__}")

        # Check required fields
        required_fields = ["level_percent", "pump_state", "last_seen"]
        for field in required_fields:
            if field not in data:
                raise ValidationError(f"Missing required field: '{field}'")

        # 1. Validate level_percent
        raw_level = data["level_percent"]
        if not isinstance(raw_level, (int, float)) or isinstance(raw_level, bool):
            raise ValidationError(
                f"'level_percent' must be a numeric value, got {type(raw_level).__name__}"
            )
        if raw_level < 0 or raw_level > 100:
            raise ValidationError(
                f"'level_percent' must be between 0 and 100, got {raw_level}"
            )
        level_percent = float(raw_level)

        # 2. Validate pump_state
        pump_state = data["pump_state"]
        if not isinstance(pump_state, str):
            raise ValidationError(
                f"'pump_state' must be a string, got {type(pump_state).__name__}"
            )
        pump_state_normalized = pump_state.strip().lower()
        if pump_state_normalized not in VALID_PUMP_STATES:
            raise ValidationError(
                f"Invalid 'pump_state': '{pump_state}'. Allowed values are: {sorted(list(VALID_PUMP_STATES))}"
            )

        # 3. Validate last_seen timestamp
        raw_timestamp = data["last_seen"]
        if not isinstance(raw_timestamp, str):
            raise ValidationError(
                f"'last_seen' must be an ISO 8601 string, got {type(raw_timestamp).__name__}"
            )
        try:
            parsed_dt = datetime.fromisoformat(raw_timestamp)
        except ValueError as exc:
            raise ValidationError(f"Invalid ISO timestamp format for 'last_seen': {raw_timestamp}") from exc

        # 4. Check for stale data if reference_time or current time is provided
        if reference_time is not None:
            # Normalize timezones for comparison
            ref_dt = reference_time
            if ref_dt.tzinfo is None and parsed_dt.tzinfo is not None:
                parsed_dt_cmp = parsed_dt.replace(tzinfo=None)
            elif ref_dt.tzinfo is not None and parsed_dt.tzinfo is None:
                parsed_dt_cmp = parsed_dt.replace(tzinfo=ref_dt.tzinfo)
            else:
                parsed_dt_cmp = parsed_dt

            delta_seconds = (ref_dt - parsed_dt_cmp).total_seconds()
            if delta_seconds > max_stale_seconds:
                raise StaleDataError(
                    f"Device status is stale: last_seen is {delta_seconds:.0f}s old "
                    f"(maximum allowed staleness is {max_stale_seconds}s)"
                )

        return cls(
            level_percent=level_percent,
            pump_state=pump_state_normalized,
            last_seen=parsed_dt
        )
