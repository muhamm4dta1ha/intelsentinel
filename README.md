# INTELSENTINEL
### Pakistan Threat Intelligence Platform — MERN Stack (No MongoDB)

A full-stack intelligence dashboard built with **Express.js + React + Recharts + Leaflet**, visualizing real SATP incident data for TTP and BLA activities.

---

## 📁 Project Structure

```
intelsentinel/
├── server/                     # Express.js backend
│   ├── index.js                # Server entry point (port 5000)
│   ├── routes/
│   │   ├── incidents.js        # /api/incidents — data query, stats, map, filter
│   │   └── upload.js           # /api/upload — Excel/CSV file ingestion
│   ├── data/
│   │   └── incidents.json      # 853 real SATP records (TTP + BLA, 2023–2026)
│   └── package.json
│
├── client/                     # React + Vite frontend (port 3000)
│   ├── src/
│   │   ├── App.jsx             # Router setup
│   │   ├── main.jsx
│   │   ├── index.css           # Global styles + Tailwind + Leaflet overrides
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx  # Fixed top nav with live clock
│   │   │   │   ├── StatusBar.jsx # Fixed bottom status bar
│   │   │   │   └── UI.jsx      # Shared: Card, Badge, Button, Input, Select, etc.
│   │   │   └── pages/
│   │   │       ├── CommandCenter.jsx  # Dashboard — stats, charts, overview
│   │   │       ├── Heatmap.jsx        # Leaflet map with real GPS coordinates
│   │   │       ├── Incidents.jsx      # Filterable/searchable incident table
│   │   │       ├── Groups.jsx         # TTP & BLA group profiles
│   │   │       ├── Capability.jsx     # Kinetic/cyber/financial assessment
│   │   │       └── Socmint.jsx        # Social media intelligence dashboard
│   │   ├── hooks/
│   │   │   └── useFetch.js     # Generic data-fetching hook
│   │   └── utils/
│   │       └── api.js          # Axios API helpers
│   ├── vite.config.js          # Vite + proxy to :5000
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                # Root — concurrently dev runner
└── README.md
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
# From project root
npm run install:all
```

Or manually:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Run in development (both server + client)
```bash
npm run dev
```
- **Backend API**: http://localhost:5000
- **Frontend**:    http://localhost:3000

### 3. Production build
```bash
npm run build        # builds client to client/dist/
NODE_ENV=production npm start  # serves from Express
```

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/api/health`             | Server health check                      |
| GET    | `/api/incidents`          | All incidents (filterable, paginated)    |
| GET    | `/api/incidents/stats`    | Aggregated stats (charts, counters)      |
| GET    | `/api/incidents/map`      | Geolocated incidents only (for Leaflet)  |
| GET    | `/api/incidents/years`    | Available year list                      |
| GET    | `/api/incidents/:id`      | Single incident detail                   |
| POST   | `/api/upload`             | Upload new Excel/CSV data file           |

### Query Parameters (`/api/incidents`)
- `year` — filter by year (2023, 2024, 2025, 2026)
- `source` — TTP or BLA
- `month` — January, February, etc.
- `weapon` — IED, Bomb, Mortar, etc.
- `hasCoords` — true to return only geolocated
- `search` — text search across location/district/details
- `page` / `limit` — pagination (default 50)

---

## 📊 Data

**File 1:** `satp_ttp_with_coordinates.xlsx` — 427 TTP incidents (2023–2026)
**File 2:** `SATP_Incidents_with_coords.xlsx` — 426 BLA incidents (2023–2026)

**Columns:** date · time · specific location · district · coordinates · weapons used · casualties · details

Both files are pre-loaded into `server/data/incidents.json` at startup.  
To add more data: use the upload feature in the app or drop a new sheet into the data folder.

---

## 🔧 Adding MongoDB Later

The data layer is intentionally isolated in `server/routes/incidents.js`.
Replace the `loadData()` function with Mongoose queries:

```js
// Current (JSON file):
function loadData() {
  return JSON.parse(fs.readFileSync('data/incidents.json'))
}

// Future (MongoDB):
const Incident = require('../models/Incident')
const data = await Incident.find(query).lean()
```

---

## 📦 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Node.js, Express.js                     |
| Frontend   | React 18, React Router v6, Vite         |
| Charts     | Recharts (Bar, Radar, CartesianGrid)    |
| Map        | Leaflet + React-Leaflet                 |
| Styling    | Tailwind CSS v3 + custom CSS variables  |
| File Parse | xlsx (server-side Excel/CSV ingestion)  |
| HTTP       | Axios                                   |
| Dev        | Concurrently, Nodemon                   |
