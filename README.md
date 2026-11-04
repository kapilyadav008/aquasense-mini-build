# AquaSense – Industrial Water Intelligence Dashboard & API Testing Suite

> **Nivoryx Systems Pvt. Ltd. – Senior Internship Technical Assignment**  
> **Author:** Candidate Submission  
> **Tech Stack:** React 19, Vite, Tailwind CSS v4, Recharts, Python 3, Pytest, Requests, Responses  
> **Design Direction:** Industrial Water Intelligence / Smart Infrastructure Control System (SCADA-inspired)

---

## 1. Project Overview

**AquaSense** is a specialized Industrial IoT (IIoT) telemetry control dashboard and automated testing framework built for municipal and industrial water management facilities. Rather than presenting a generic SaaS template, AquaSense is styled after real-world **Supervisory Control and Data Acquisition (SCADA)** and Smart Infrastructure monitoring consoles.

The platform provides operators with high-contrast, mission-critical oversight of hydrostatic tank storage, dynamic calculation of daily operational envelopes, intelligent threshold alerting that distinguishes active emergencies from historical recovery events, and an automated pytest suite validating REST API contracts against negative inputs, socket drops, and data corruption.

---

## 2. Key Features

### PART A: Industrial Dashboard (React.js + Tailwind CSS + Recharts)
- **SCADA-Inspired Navigation Bar:** Brand identity, operational view tabs (`Dashboard`, `Device Overview`, `Reading History`), live telemetry poll trigger, and a `Demo / Connected` hardware node indicator (`Node AS-001`).
- **Asymmetric Operational Envelope (No Generic Duplicate Cards):**
  - **Primary Telemetry Hero:** High-contrast electric cyan monospace readout of the latest tank level (`55%`), status pill (`Optimal`), and rate of change (`+13%` vs 18:00 reading).
  - **Daily Operational Envelope Widget:** Displays today's minimum (`18%` at `16:00:00`) and maximum (`78%` at `06:00:00`) alongside an operational span visualizer bar showing today's dynamic 60% spread.
  - **Telemetry Sync Heartbeat:** Displays exact last-seen timestamp, 120-minute sensor sample frequency, and total recorded readings count.
- **Intelligent Dual-Alert Annunciator:**
  - **Active Emergency Alarm:** Triggered immediately when the *current* level drops below 20%.
  - **Historical Low-Level Event Notification:** In the assigned dataset, the level dropped to 18% at 16:00:00 but recovered to 55% at 20:00:00. The dashboard renders an amber *Historical Event Logged* notification, explicitly preventing false active emergency alarms on a recovered system.
- **Industrial Vertical Tank Vessel Visualization (`VT-01`):**
  - High-precision graduated scale (0%, 20% critical line, 50%, 75%, 100%).
  - Dynamic electric cyan liquid gradient with meniscus highlights and surface shimmer.
  - Switches to muted orange (20–50%) or warning red (<20%) upon threshold breach.
  - Capacity estimation (e.g. 5,500 L of 10,000 L rated).
- **Time-Series Telemetry Curve (`HistoryChart`):**
  - Built with Recharts using an electric cyan area gradient.
  - Highlighted 18% historic breach point at 16:00 with a dedicated ping dot and callout tag.
  - Dashed 20% critical safety floor reference line.
  - Technical monospace hover tooltips with sample time, percentage, and condition flags.
- **Dedicated Device Telemetry Panel (`AS-001`):**
  - Device Name: `AquaSense Mini`
  - Device ID: `AS-001`
  - Connection Status: `Demo / Mock Connected`
  - Last Communication Time: `2026-11-02 20:00:00`
  - Pump State: Clearly labeled as `Mock / Not Provided by Assignment` to ensure engineering transparency without inventing hardware state.
- **Telemetry Audit Trail Table:**
  - Monospace timestamps, numeric levels, inline capacity progress meters, condition badges (`Optimal`, `Moderate`, `Critical Low`), and directional trend deltas.
  - Explicit row highlight for the 18% dip.
- **QA Diagnostic & Scenario Simulator:**
  - Allows reviewers and examiners to toggle scenarios in one click:
    1. *Default Mock:* 8 points, 18% dip at 16:00, recovered to 55% at 20:00.
    2. *Active Critical Low:* Current level breaches 20% (12%).
    3. *All Normal:* Steady safe levels.
    4. *Empty Dataset:* Tests resilient error fallback handling.
    5. *Custom Injection Tool:* Append custom timestamps and percentages live.

---

### PART B: Automated API Testing (Python + Pytest + Requests + Responses)
- **Industrial REST Client (`AquaSenseClient`):** Handles JWT session management, Bearer token injection, request signing, and client-side parameter checks.
- **Strict Schema Validator (`DeviceStatus.from_dict`):** Validates types, enforces $0 \le \text{level\_percent} \le 100$, checks pump state enum (`['on', 'off']`), verifies ISO 8601 formatting, and catches stale telemetry.
- **10 Core Scenarios / 24 Automated Pytest Assertions:** Mocked with `responses` for deterministic, offline test execution in 0.05 seconds.

---

## 3. Technology Stack & Design Decisions

| Component | Selected Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 8 | Ultra-fast HMR and lightweight bundle size. |
| **Styling** | Tailwind CSS v4 | Utility-first styling enabling authentic SCADA dark surfaces and electric cyan accents without bloated CSS files. |
| **Data Visualization** | Recharts | Responsive, accessible SVG time-series charting with reference thresholds and custom breach dots. |
| **API Client** | Python 3 + Requests | Clean object-oriented architecture with custom domain exceptions. |
| **Test Automation** | Pytest 9.2 + Responses | Industry-standard for backend/IoT telemetry testing; 100% deterministic mocking at the HTTP transport layer without running a live server. |

> **Testing Framework Trade-off Note:**  
> The assignment permits testing via Node/Supertest or Python/pytest. We preserved the complete, production-grade **Python + Pytest** implementation because it already covers 100% of the 10 required test cases (24 assertions) with pure in-memory mocking (`responses`), runs in 0.05s, requires zero external services or databases, and is widely favored for IoT hardware & API testing in industry.

---

## 4. Screenshots

> *Screenshots demonstrating key operational views in AquaSense.*

| Industrial Dashboard (Default Mock - Historical Event Recovered) | Active Critical Low State (< 20%) |
| :---: | :---: |
| ![Historical Event View](docs/screenshots/dashboard-historical-alert.png) | ![Active Critical Low View](docs/screenshots/dashboard-active-alert.png) |

| Vertical Vessel & Telemetry Curve | Automated Pytest Suite (24/24 Passed) |
| :---: | :---: |
| ![Vessel & Telemetry](docs/screenshots/dashboard-charts.png) | ![Pytest Execution](docs/screenshots/pytest-results.png) |

---

## 5. Installation Instructions

### Prerequisites
- **Node.js:** v18.0.0 or later (v22 tested)
- **Python:** 3.10 or later (3.13 tested)
- **Git**

### Clone Repository
```bash
git clone https://github.com/your-username/aquasense-mini-build.git
cd aquasense-mini-build
```

---

## 6. How to Run the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.
5. To test a production build:
   ```bash
   npm run build
   ```

---

## 7. How to Run Automated Tests

1. From the project root directory, install Python testing requirements:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the automated pytest suite:
   ```bash
   python -m pytest backend_tests -v
   ```
3. Run with compact trace:
   ```bash
   python -m pytest backend_tests -v --tb=short
   ```

---

## 8. API Test Plan & Coverage Matrix

All 10 scenarios specified in the assignment are automated with 24 individual test assertions:

| Test ID | Scenario / Endpoint | Test Precondition | Expected HTTP | Expected Client Result & Assertions | Status |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **TC-01** | **Successful Login**<br>`POST /login` | Valid operator credentials | `200 OK` | Stores JWT token in `client.token`; verifies `application/json` header. | **PASS** |
| **TC-02** | **Invalid Credentials**<br>`POST /login` | Incorrect password | `401 Unauthorized` | Raises `AuthenticationError` with `status_code=401`; keeps `client.token = None`. | **PASS** |
| **TC-03** | **Missing / Malformed Token**<br>`GET /device/{id}/status` | Token is `None`, `""`, `"   "`, or has whitespace | *Client Guard* | Raises `TokenError` client-side before dispatching invalid socket traffic. | **PASS** |
| **TC-04** | **Valid Device Status**<br>`GET /device/{id}/status` | Valid Bearer token; node `tank-01` | `200 OK` | Returns `DeviceStatus(level_percent=55.0, pump_state='on', last_seen=...)`; verifies `Authorization: Bearer <token>`. | **PASS** |
| **TC-05** | **Expired / Unauthorized Token**<br>`GET /device/{id}/status` | Expired or revoked JWT | `401 / 403` | Raises `TokenExpiredError` preserving the HTTP status code. | **PASS** |
| **TC-06** | **Device Offline / Unavailable**<br>`GET /device/{id}/status` | IoT gateway down / 503 response | `503 Service Unavailable` | Raises `DeviceOfflineError` with status code and diagnostic body. | **PASS** |
| **TC-06b** | **Socket Timeout / Network Drop**<br>`GET /device/{id}/status` | TCP socket connection drop | *ConnectionError* | Traps `requests.exceptions.ConnectionError`, raises `DeviceOfflineError`. | **PASS** |
| **TC-07** | **Malformed JSON Response**<br>`GET /device/{id}/status` | 200 OK returning raw HTML/corrupt text | `200 OK` *(Bad Body)* | Traps `JSONDecodeError`, raises `ValidationError` with response body context. | **PASS** |
| **TC-08** | **Level Outside 0–100 Range**<br>`GET /device/{id}/status` | `level_percent`: `-1`, `-25.5`, `100.1`, `150`, or non-numeric | `200 OK` | Schema validator raises `ValidationError` for out-of-bounds readings. | **PASS** |
| **TC-09** | **Invalid Pump State**<br>`GET /device/{id}/status` | `pump_state`: `"running"`, `"stopped"`, `"EXPLODING"` | `200 OK` | Domain validator raises `ValidationError`; enforces `['on', 'off']`. | **PASS** |
| **TC-10** | **Stale Telemetry Timestamp**<br>`GET /device/{id}/status` | `last_seen` timestamp > 15 minutes older than reference | `200 OK` | Raises `StaleDataError` warning that device heartbeat is delayed. | **PASS** |

---

## 9. Wi-Fi Disconnection Testing Approach (Assignment Technical Question)

> **Question:**  
> *How would you test a mobile application's behaviour when the connected IoT device loses Wi-Fi during an operation?*

**Production QA Strategy & Answer:**  
To test a mobile application's behavior when an IoT tank controller loses Wi-Fi mid-operation, I implement an end-to-end chaos engineering and network virtualization test strategy using tools like Charles Proxy, Network Link Conditioner, and physical Wi-Fi AP attenuation. During an in-flight command (such as toggling an intake pump), the test harness simulates abrupt socket severing (TCP RST and silent packet loss) to verify that the mobile UI transitions immediately into a non-blocking, determinate pending state—displaying a timed indicator rather than freezing the main thread. The client's network layer must be verified to employ a bounded exponential backoff retry policy (e.g., 3 retries capped at 2.5s intervals with random jitter) governed by a strict request timeout (5s) to prevent thread starvation. To prevent catastrophic duplicate physical operations—such as double-starting a high-pressure pump due to retransmitted network packets—the client must attach a unique, client-generated idempotency key (`X-Idempotency-Key: <UUIDv4>`) to all mutating requests, allowing the backend gateway to deduplicate retries. Upon network restoration, the application must never assume command success through optimistic UI updates; instead, it must execute a state reconciliation handshake by querying `GET /device/{id}/status` to fetch the true hardware state directly from the device's last committed telemetry. If the command failed before execution on the device, the UI must gracefully roll back the toggle, clear pending loaders, and surface an actionable, dismissible error banner explaining that the controller went offline before the operation could complete.

---

## 10. AI Assistance Note

### AI Tool Used
- **Claude** (Anthropic Claude 3.5 Sonnet / Gemini Engineering Pair Programmer)

### Two Realistic Prompts Used During Development
1. **Prompt 1 (Alert Logic & Historical Event Decoupling):**
   > *"Given an array of IoT tank telemetry readings where level dropped below 20% at 16:00 but recovered to 55% at 20:00, write the JavaScript logic to ensure an active low warning is ONLY shown if current level < 20%, whereas if an earlier reading dropped below 20% and recovered, it emits a historical notification rather than an active alarm."*

2. **Prompt 2 (Backend API Client & Negative Edge Mocks):**
   > *"Generate a Python REST API client for AquaSense using requests. Implement login and get_device_status with custom exception types for 401, 403, 503, invalid data bounds (level not in 0-100), malformed JSON, and stale timestamps. Provide pytest test cases using the responses mocking library."*

### Genuine Issue Identified in AI Implementation & Correction
- **Identified Flaw:** In the initial code generated for the dashboard alert banner, the AI used `readings.some(r => r.level_percent < 20)` directly inside the alert condition. Consequently, because the assignment's mock dataset contains an 18% reading at 16:00:00, the dashboard rendered an active critical red alert on a recovered tank whose current level was 55%.
- **Engineering Correction:** We refactored `tankAnalytics.js` to decouple the active condition (`latestReading.level_percent < 20`) from the historical event condition (`!isActiveLow && readings.some(r => r.level_percent < 20)`). This ensures the dashboard correctly shows the amber historical recovery notice and keeps the primary system status nominal.

### Manual Validation Performed
- **Vite Production Build:** Ran `npm run build` in `frontend/`, verifying 0 syntax or compilation errors.
- **Visual & Interactive Verification:** Tested all tabs (`Dashboard`, `Device Overview`, `Reading History`) and verified all 4 preset scenarios in the Scenario Simulator.
- **Pytest Suite:** Executed `python -m pytest backend_tests -v`, confirming all 24 assertions passed in 0.05 seconds.

---

## 11. Project Folder Structure

```
Aquasense-mini-build/
├── .gitignore                      # Git ignore rules for Node, Python, Vite
├── requirements.txt                # Python testing dependencies (pytest, requests, responses)
├── README.md                       # Complete assignment documentation & test matrices
├── docs/
│   └── screenshots/                # Directory for dashboard & test execution captures
├── frontend/                       # React.js + Vite + Tailwind CSS Dashboard
│   ├── index.html                  # HTML entry point with Inter & JetBrains Mono fonts
│   ├── package.json                # Frontend dependencies & build scripts
│   ├── vite.config.js              # Vite configuration with @tailwindcss/vite plugin
│   ├── public/
│   │   └── favicon.svg             # Droplet brand icon
│   └── src/
│       ├── main.jsx                # React root mount
│       ├── App.jsx                 # Main industrial control console layout & view router
│       ├── index.css               # Tailwind CSS imports & base styles
│       ├── data/
│       │   └── mockData.js         # Exact assignment mock dataset + scenario presets
│       ├── utils/
│       │   └── tankAnalytics.js    # Pure dynamic metrics, min/max & dual-alert logic
│       └── components/
│           ├── Navbar.jsx          # SCADA-inspired header with view tabs & AS-001 badge
│           ├── AlertBanner.jsx     # Annunciator banner (Active Low vs Historical Recovery)
│           ├── MetricCards.jsx     # Asymmetric metrics: Hero Level + Envelope + Sync
│           ├── TankVisualizer.jsx  # VT-01 vertical vessel with graduated ticks & liquid wave
│           ├── HistoryChart.jsx    # 24h curve with highlighted 18% point & 20% limit
│           ├── DevicePanel.jsx     # Dedicated AS-001 telemetry node & mock pump disclosure
│           ├── ReadingsTable.jsx   # Tabular telemetry audit log with delta indicators
│           └── ScenarioSimulator.jsx # QA diagnostic console & scenario switcher
└── backend_tests/                  # Python Automated API Testing Suite
    ├── __init__.py                 # Package marker
    ├── exceptions.py               # Custom domain exception hierarchy
    ├── models.py                   # DeviceStatus schema validator & models
    ├── api_client.py               # AquaSenseClient REST implementation
    ├── conftest.py                 # Pytest fixtures & mock factory
    └── test_aquasense_api.py       # 10 automated test suites (24 test assertions)
```
