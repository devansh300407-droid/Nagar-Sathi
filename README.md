# NagarSathi — AI-Powered Road Maintenance & Infrastructure Management Platform

> **"Together for Better Roads."**  
> A modern civic-tech SaaS web application designed for Smart City & Urban Infrastructure hackathons.

---

## 1. Project Overview

**NagarSathi** bridges the communication gap between citizens reporting dangerous road hazards and municipal corporations tasked with prioritizing and verifying road repairs.

By combining:
1. **Citizen Geotagged Grievance Reporting**
2. **Computer Vision Damage Assessment & Severity Grading**
3. **Explainable Priority Scoring (XAI)**
4. **Algorithmic Repair Budget Optimization**
5. **Field Verification Audits & Public Transparency**

NagarSathi transforms reactive municipal road maintenance into a proactive, auditable, and data-driven infrastructure pipeline.

---

## 2. Technology Stack

- **Frontend Core:** Semantic HTML5, Modular CSS3, Vanilla ES6 JavaScript (No React, Angular, Vue, or TypeScript required).
- **Cartography & GIS:** [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles.
- **Data Visualizations:** [Chart.js](https://www.chartjs.org/) for responsive trend lines, doughnut breakdowns, and status distribution charts.
- **Iconography:** [Lucide Icons](https://lucide.dev/) via official CDN.
- **Storage & State:** `localStorage` persistence layer with pre-loaded demo telemetry from **Ghaziabad Municipal Corporation (GMC) - Zone 3**.
- **Backend Readiness:** Fully decoupled service layer in `js/api.js` structured for rapid integration with a **Python Flask + SQLite** backend.

---

## 3. Project Directory Structure

```
NagarSathi/
├── index.html            # Municipal Executive Overview Dashboard
├── report.html           # Citizen Grievance Reporting Form & Map Picker
├── map.html              # Interactive GIS Live Defect Map (Leaflet.js)
├── repairs.html          # Admin Repair Management & Inspector Sign-off Console
├── insights.html         # AI Decision Support, CV Inferences & XAI Simulator
├── budget.html           # Interactive Repair Budget Allocation & Knapsack Optimizer
├── transparency.html     # Public Accountability Portal, Ticket Tracker & Ward Leaderboard
├── about.html            # Platform Architecture, Problem/Solution & 5 Team Profiles
├── css/
│   └── style.css         # Master Responsive Stylesheet (Navy & Teal Civic SaaS Theme)
├── js/
│   ├── app.js            # Core UI: Responsive Mobile Drawer, Toasts & Global Handlers
│   ├── dashboard.js      # Dashboard Charts, KPI Counters & Filter Streams
│   ├── reports.js        # File Upload, Mini Picker Map, Validations & Submission
│   ├── map.js            # Leaflet Map Engine, Priority Pins & Sync List
│   ├── repairs.js        # Work Order Management, Before/After Photo Audit & Modals
│   ├── insights.js       # CV Classifier Demo, Duplicate Clustering & XAI Scoring Sliders
│   ├── budget.js         # Fiscal Optimization Engine, Knapsack Algorithm & Checklist
│   └── api.js            # Unified Data Layer, LocalStorage Cache & Flask API Blueprint
├── data/
│   └── demo-data.js      # Realistic Ghaziabad Municipal Corporation Demo Telemetry
├── assets/               # Placeholder folder for logos and offline icons
└── README.md             # Comprehensive Documentation & Integration Blueprint
```

---

## 4. Key Pages & Features

### 1. Overview Dashboard (`index.html`)
- **4 Real-time KPI Metric Cards:** Total Reports, High-Priority Issues, Pending Repairs, Resolved Complaints.
- **Interactive Visualizations:**
  - 6-Month Complaint & Resolution Trend Chart (Monsoon peak analysis).
  - Damage Categories Doughnut Chart (Potholes, Road Cracks, Waterlogging, Surface Damage, Other).
  - Repair Workflow Status Bar Chart.
- **Urgent Action Stream:** High-priority hazards requiring 24-hour turnaround with direct links to map and repair dispatch.
- **Filterable Recent Complaints Table:** Tabs for *All*, *High Priority*, and *Pending* complaints.

### 2. Report Road Damage (`report.html`)
- **Visual File Upload:** Drag-and-drop or file browser with instant image preview.
- **One-Click Demo Sample Gallery:** Pre-loaded samples (Pothole, Crack, Waterlogging, Edge Ravelling) for instant hackathon demonstrations without needing local files.
- **Interactive Mini Leaflet Picker:** Click or drag on map to capture exact latitude and longitude, with GPS button support.
- **Category Tiles:** Visually distinct tiles for defect selection.
- **Transparent Submission Modal:** Shows generated tracking ID (e.g. `NS-2026-1045`) and clearly labelled simulated AI classification preview.

### 3. Live GIS Issue Map (`map.html`)
- **Interactive Geospatial Map:** Centered on Ghaziabad, UP with OpenStreetMap cartography.
- **Custom Priority Pins:** Red (High), Amber (Medium), Blue (Low), Green (Resolved).
- **Synchronized Defect List:** Clicking an issue card smoothly pans and zooms the map to open its marker popup.
- **Direct Link Support:** Opens from any page with `?focus=NS-2026-XXXX` to spotlight a specific defect.
- **Map Legend & Controls:** Quick buttons to focus on High-Priority hazards or re-center to Ghaziabad.

### 4. Municipal Repair Management (`repairs.html`)
- **Engineer Work Order Pipeline:** Filter by Status, Priority, Search Query, or Municipal Ward.
- **Comprehensive Inspection Modal:**
  - Before-repair vs After-repair photographic comparison.
  - Manual verification check: Junior Engineer (JE) sign-off.
  - Contractor assignment dropdown (e.g. Shree Ganesh Infra Con, Apex Roadways Ltd).
  - Estimated or billed repair cost updates.
- **Live State Sync:** Status changes immediately update dashboard KPI counters and map pins across localStorage.

### 5. AI Insights & Predictive Analytics (`insights.html`)
- **Automated Defect Classifier (Module A):** Interactive test cases displaying simulated confidence bars, surface area estimation, and recommended treatment protocols.
- **Corridor Risk Hotspots (Module B):** Identifies recurring damage zones (e.g. Meerut Road Industrial Link) with root cause analysis.
- **Duplicate Grievance Clustering (Module C):** Groups reports within a 25m radius with visual similarity matching and human merge confirmation.
- **Monsoon Vulnerability Modeling (Module D):** Pavement Condition Index (PCI) degradation curves and rainfall early warnings.
- **Explainable Priority Score Simulator (XAI - Module E):** Interactive sliders for *Visible Severity (40%)*, *Traffic Volume (25%)*, *Citizen Reports (20%)*, and *Aging Factor (15%)* with real-time risk score computation.

### 6. Budget Planner & Optimization Engine (`budget.html`)
- **Fiscal Grant Allocation:** Customizable budget input in ₹ INR with quick presets (₹ 2.5L, ₹ 5.0L, ₹ 7.5L, ₹ 10.0L).
- **Algorithmic Strategies:**
  - *Priority-First (Safety Critical):* Greedily resolves dangerous arterial craters first.
  - *Lower-Cost Alternative (Max Coverage):* Resolves the maximum volume of localized complaints.
  - *Balanced Value/Cost Model.*
- **Side-by-Side Trade-off Cards:** Direct comparison of allocated cost, remaining buffer, and critical hazards eliminated.
- **Interactive Work Order Checklist:** Toggle individual projects ON or OFF with real-time recalculation of allocated cost and progress gauge.

### 7. Public Transparency Portal (`transparency.html`)
- **Citizen Accountability:** Displays total reports, resolved fixes, active repairs, and 3.8-day average resolution turnaround.
- **Live Grievance Tracker:** Citizens can input their Reference ID (e.g., `NS-2026-1042`) to check inspection status without exposing private citizen data.
- **Ward Efficiency Leaderboard:** Ranks Ghaziabad municipal wards by resolution speed.
- **Anonymized Public Registry:** Filterable by ward and status with official verification badges.

### 8. About NagarSathi & Core Team (`about.html`)
- Problem statement, solution pillars, and 4-step workflow.
- Technology stack and future roadmap (drone highway sweeps, transit bus camera integration, LoRaWAN moisture probes).
- **5 Editable Team Member Profiles:** Designated cards with roles, contributions, and social placeholders.

---

## 5. How to Run Locally

Because NagarSathi is built with standard HTML5, CSS3, and modern vanilla ES6 JavaScript, **no npm install, compilation, or build step is required**.

### Option A: Using Python (Recommended)
1. Open PowerShell or Terminal in the `NagarSathi` folder:
   ```bash
   cd "C:\Users\DEVANSH SHARMA\.gemini\antigravity\scratch\NagarSathi"
   python -m http.server 8000
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Option B: Using VS Code Live Server
1. Open the `NagarSathi` folder in VS Code.
2. Right click on `index.html` and choose **"Open with Live Server"**.

### Option C: Direct File Execution
You can also directly double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox, Safari). All CDN scripts (Lucide, Leaflet, Chart.js) load over HTTPS.

---

## 6. Python Flask & SQLite Integration Guide

The frontend is architected so switching from local demo state to a live Python Flask REST API takes only minutes.

### 1. The API Architecture (`js/api.js`)
In `js/api.js`, simply update:
```javascript
const USE_BACKEND_API = true; // Set to true
const API_BASE_URL = "http://localhost:5000/api";
```

### 2. Required Flask Endpoints
| HTTP Method | Route | Description |
|---|---|---|
| `GET` | `/api/reports` | Returns list of reports (accepts `?category=&priority=&status=&ward=&search=`) |
| `GET` | `/api/reports/<id>` | Returns single report details |
| `POST` | `/api/reports` | Creates a new citizen road defect report |
| `PATCH` | `/api/reports/<id>/status` | Updates report status, contractor assignment, and inspector verification |
| `POST` | `/api/ai/classify` | Accepts multipart image upload, returns predicted defect class and confidence |
| `GET` | `/api/analytics` | Returns aggregated metrics for dashboard counters and monthly trend charts |
| `POST` | `/api/budget/optimize` | Runs server-side knapsack algorithm for budget allocation |

### 3. Quickstart Python Flask Backend Skeleton (`app.py`)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app) # Enable CORS for frontend requests

def get_db():
    conn = sqlite3.connect("nagarsathi.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/reports", methods=["GET"])
def get_reports():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reports ORDER BY id DESC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(rows)

@app.route("/api/reports", methods=["POST"])
def create_report():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO reports (title, category, location, priority, status, description, lat, lng, image_url)
        VALUES (?, ?, ?, ?, 'Reported', ?, ?, ?, ?)
    """, (data.get('title'), data.get('category'), data.get('location'), 
          data.get('priority'), data.get('description'), data.get('lat'), data.get('lng'), data.get('imageUrl')))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({"success": True, "id": f"NS-2026-{new_id}"}), 201

if __name__ == "__main__":
    app.run(port=5000, debug=True)
```

---

## 7. Demo Reset & State Management

- All prototype actions (submitting a report, updating repair status, changing contractors, verifying repairs) persist in browser `localStorage` under the key `nagarsathi_reports_v1`.
- To reset the prototype back to the default Ghaziabad sample telemetry at any time during your hackathon presentation, click the **"Reset Demo Database"** button located at the bottom of the left sidebar on any page.

---

## 8. License & Acknowledgements
- Developed for Smart City & Urban Infrastructure Hackathon 2026.
- Map data &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- Icons by [Lucide](https://lucide.dev/).
