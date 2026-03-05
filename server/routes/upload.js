const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: '/tmp/uploads/' });

// POST /api/upload — accepts .xlsx or .csv, merges into data store
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const wb = XLSX.readFile(req.file.path);
    const results = [];

    wb.SheetNames.forEach(sheetName => {
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      rows.forEach((row, idx) => {
        const normalized = {
          id: `upload_${Date.now()}_${idx}`,
          year: sheetName || 'Unknown',
          source: req.body.source || 'UPLOADED',
          date: String(row['date'] || row['Date'] || ''),
          time: String(row['time'] || row['Time'] || ''),
          location: String(row['specific location'] || row['location'] || row['Location'] || ''),
          district: String(row['district'] || row['District'] || ''),
          coordinates: String(row['coordinates'] || ''),
          weapons: String(row['weapons used'] || row['weapons'] || ''),
          casualties: String(row['casualties'] || ''),
          details: String(row['details'] || row['Details'] || '').substring(0, 600),
          lat: null,
          lng: null,
          month: ''
        };

        // Parse coordinates
        if (normalized.coordinates) {
          try {
            const parts = normalized.coordinates.split(',');
            normalized.lat = parseFloat(parts[0].trim());
            normalized.lng = parseFloat(parts[1].trim());
          } catch (_) {}
        }

        // Parse month
        if (normalized.date && normalized.date.includes('-')) {
          normalized.month = normalized.date.split('-')[0].trim();
        }

        results.push(normalized);
      });
    });

    // Append to existing data
    const dataPath = path.join(__dirname, '../data/incidents.json');
    const existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const combined = [...existing, ...results];
    fs.writeFileSync(dataPath, JSON.stringify(combined));

    // Cleanup temp
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `Imported ${results.length} records from ${wb.SheetNames.length} sheet(s)`,
      count: results.length,
      newTotal: combined.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
