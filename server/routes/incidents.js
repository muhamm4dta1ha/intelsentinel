const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load data from JSON file (simulates MongoDB collection)
function loadData() {
  const filePath = path.join(__dirname, '../data/incidents.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// ─── GET /api/incidents ─────────────────────────────────────────────────────
// Query params: year, source, month, weapon, hasCoords, page, limit, search
router.get('/', (req, res) => {
  try {
    let data = loadData();
    const { year, source, month, weapon, hasCoords, page = 1, limit = 50, search } = req.query;

    if (year)      data = data.filter(d => d.year === year);
    if (source)    data = data.filter(d => d.source === source);
    if (month)     data = data.filter(d => d.month && d.month.toLowerCase().includes(month.toLowerCase()));
    if (weapon)    data = data.filter(d => d.weapons && d.weapons.toLowerCase().includes(weapon.toLowerCase()));
    if (hasCoords === 'true') data = data.filter(d => d.lat && d.lng);
    if (search)    data = data.filter(d =>
      (d.location + d.district + d.details + d.weapons).toLowerCase().includes(search.toLowerCase())
    );

    const total = data.length;
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = data.slice(start, start + parseInt(limit));

    res.json({ total, page: parseInt(page), limit: parseInt(limit), data: paginated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/incidents/stats ─────────────────────────────────────────────
router.get('/stats', (req, res) => {
  try {
    const data = loadData();

    // Total by year
    const byYear = {};
    data.forEach(d => {
      byYear[d.year] = (byYear[d.year] || 0) + 1;
    });

    // Total by source
    const bySource = {};
    data.forEach(d => {
      bySource[d.source] = (bySource[d.source] || 0) + 1;
    });

    // By month (across all years)
    const monthOrder = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const byMonth = {};
    data.forEach(d => {
      if (d.month) {
        const m = monthOrder.find(mo => d.month.toLowerCase().startsWith(mo.toLowerCase().substring(0, 3)));
        if (m) byMonth[m] = (byMonth[m] || 0) + 1;
      }
    });
    const byMonthSorted = monthOrder.map(m => ({ month: m, count: byMonth[m] || 0 }));

    // By weapon type
    const byWeapon = {};
    data.forEach(d => {
      if (d.weapons) {
        d.weapons.split(',').forEach(w => {
          const cleaned = w.trim().replace(/\(.*?\)/g, '').trim();
          if (cleaned && cleaned !== 'None') {
            byWeapon[cleaned] = (byWeapon[cleaned] || 0) + 1;
          }
        });
      }
    });
    const topWeapons = Object.entries(byWeapon)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([weapon, count]) => ({ weapon, count }));

    // By year+source (for stacked chart)
    const byYearSource = {};
    data.forEach(d => {
      const key = d.year;
      if (!byYearSource[key]) byYearSource[key] = { year: key, TTP: 0, BLA: 0 };
      byYearSource[key][d.source]++;
    });
    const yearSourceSorted = Object.values(byYearSource).sort((a, b) => a.year.localeCompare(b.year));

    // With coordinates
    const withCoords = data.filter(d => d.lat && d.lng).length;

    res.json({
      total: data.length,
      withCoords,
      byYear,
      bySource,
      byMonthSorted,
      topWeapons,
      yearSourceSorted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/incidents/map ───────────────────────────────────────────────
// Returns only geolocated incidents (lightweight for map rendering)
router.get('/map', (req, res) => {
  try {
    let data = loadData();
    const { year, source } = req.query;

    if (year)   data = data.filter(d => d.year === year);
    if (source) data = data.filter(d => d.source === source);

    const geoData = data
      .filter(d => d.lat && d.lng)
      .map(d => ({
        id: d.id,
        lat: d.lat,
        lng: d.lng,
        source: d.source,
        year: d.year,
        location: d.location,
        district: d.district,
        weapons: d.weapons,
        casualties: d.casualties,
        date: d.date,
        details: d.details ? d.details.substring(0, 200) : ''
      }));

    res.json({ total: geoData.length, data: geoData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/incidents/years ─────────────────────────────────────────────
router.get('/years', (req, res) => {
  const data = loadData();
  const years = [...new Set(data.map(d => d.year))].sort();
  res.json(years);
});

// ─── GET /api/incidents/:id ──────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const data = loadData();
  const item = data.find(d => String(d.id) === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

module.exports = router;
