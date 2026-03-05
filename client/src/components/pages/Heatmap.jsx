import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { fetchMapData, fetchStats } from '../../utils/api'
import { Card, SectionTitle, Badge, Spinner, StatCard, Select, Button, ProgressBar } from '../layout/UI'

const YEAR_OPTIONS = ['2023', '2024', '2025', '2026']
const SOURCE_OPTIONS = [
  { value: 'TTP', label: 'TTP — Tehrik-i-Taliban' },
  { value: 'BLA', label: 'BLA — Baloch Liberation' }
]

function MapResetView({ lat, lng, zoom }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], zoom) }, [lat, lng, zoom])
  return null
}

export default function Heatmap() {
  const [markers, setMarkers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState('')
  const [source, setSource] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchMapData({ year, source }),
      fetchStats()
    ]).then(([mapRes, statsRes]) => {
      setMarkers(mapRes.data)
      setStats(statsRes)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [year, source])

  const getColor = (src) => src === 'TTP' ? '#e8001e' : '#ff6600'

  const regionalData = [
    { label: 'KP / FATA',     pct: 65 },
    { label: 'BALOCHISTAN',   pct: 58 },
    { label: 'PUNJAB',        pct: 18 },
    { label: 'SINDH',         pct: 12 },
    { label: 'GILGIT-B.',     pct: 5  },
  ]

  return (
    <div className="page-enter h-[calc(100vh-84px)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(232,0,30,0.2)] bg-[#030303]">
        <div className="font-cond text-[16px] font-black italic tracking-[1px]">
          PAKISTAN <span className="text-[#e8001e]">THREAT HEATMAP</span>
          <span className="font-mono text-[9px] text-[#555] ml-4 not-italic font-normal">
            {markers.length} GEOLOCATED INCIDENTS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={year} onChange={setYear}
            options={YEAR_OPTIONS} placeholder="ALL YEARS"
          />
          <Select
            value={source} onChange={setSource}
            options={SOURCE_OPTIONS} placeholder="ALL SOURCES"
          />
          <Button variant="ghost" onClick={() => { setYear(''); setSource('') }}>RESET</Button>
        </div>
      </div>

      {/* Map + sidepanels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[260px] border-r border-[#1c1c1c] bg-[#080808] p-4 flex flex-col gap-5 overflow-y-auto">
          <div>
            <SectionTitle>LEGEND</SectionTitle>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-[9px] text-[#888]">
                <div className="w-3 h-3 rounded-full bg-[#e8001e]" /> TTP INCIDENT
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] text-[#888]">
                <div className="w-3 h-3 rounded-full bg-[#ff6600]" /> BLA INCIDENT
              </div>
            </div>
          </div>
          <div>
            <SectionTitle>REGIONAL DISTRIBUTION</SectionTitle>
            {regionalData.map(r => (
              <ProgressBar key={r.label} label={r.label} value={r.pct} showVal={false} />
            ))}
          </div>
          <div>
            <SectionTitle>ACTIVE FILTERS</SectionTitle>
            <div className="flex flex-col gap-1 font-mono text-[9px]">
              <div className="flex justify-between text-[#555]">
                <span>YEAR</span><span className="text-[#e8001e]">{year || 'ALL'}</span>
              </div>
              <div className="flex justify-between text-[#555]">
                <span>SOURCE</span><span className="text-[#e8001e]">{source || 'ALL'}</span>
              </div>
              <div className="flex justify-between text-[#555]">
                <span>PLOTTED</span><span className="text-white">{markers.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 z-[500] bg-[#030303]/80 flex items-center justify-center">
              <Spinner text="LOADING MAP DATA…" />
            </div>
          )}
          <MapContainer
            center={[30.3753, 69.3451]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            {markers.map(m => (
              <CircleMarker
                key={m.id}
                center={[m.lat, m.lng]}
                radius={selected?.id === m.id ? 9 : 6}
                pathOptions={{
                  color: getColor(m.source),
                  fillColor: getColor(m.source),
                  fillOpacity: 0.7,
                  weight: selected?.id === m.id ? 2 : 1
                }}
                eventHandlers={{ click: () => setSelected(m) }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Barlow, sans-serif', minWidth: '220px', background: '#0d0d0d', color: '#e8e8e8', padding: '10px', border: '1px solid rgba(232,0,30,0.3)' }}>
                    <div style={{ fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#e8001e', marginBottom: '6px', letterSpacing: '2px' }}>
                      {m.source} · {m.year} · {m.date}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{m.location || m.district}</div>
                    {m.weapons && <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>⚔ {m.weapons}</div>}
                    {m.casualties && <div style={{ fontSize: '11px', color: '#e8001e' }}>☠ {m.casualties}</div>}
                    {m.details && <div style={{ fontSize: '11px', color: '#666', marginTop: '6px', lineHeight: '1.5' }}>{m.details.substring(0, 180)}…</div>}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Right panel - incident detail */}
        <div className="w-[280px] border-l border-[#1c1c1c] bg-[#080808] p-4 overflow-y-auto">
          {selected ? (
            <div>
              <SectionTitle>INCIDENT DETAIL</SectionTitle>
              <div className="space-y-3">
                <div>
                  <div className="font-mono text-[8px] text-[#555] mb-1">SOURCE</div>
                  <Badge variant={selected.source === 'TTP' ? 'red' : 'warn'}>{selected.source}</Badge>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-[#555] mb-1">DATE</div>
                  <div className="font-cond text-[15px] font-bold">{selected.date} {selected.year}</div>
                </div>
                <div>
                  <div className="font-mono text-[8px] text-[#555] mb-1">LOCATION</div>
                  <div className="text-[13px] text-[#ccc]">{selected.location}</div>
                  <div className="font-mono text-[9px] text-[#444] mt-1">{selected.district}</div>
                </div>
                {selected.weapons && (
                  <div>
                    <div className="font-mono text-[8px] text-[#555] mb-1">WEAPONS</div>
                    <div className="text-[12px] text-[#e8001e]">{selected.weapons}</div>
                  </div>
                )}
                {selected.casualties && (
                  <div>
                    <div className="font-mono text-[8px] text-[#555] mb-1">CASUALTIES</div>
                    <div className="font-cond text-[18px] font-black text-[#e8001e]">{selected.casualties}</div>
                  </div>
                )}
                <div>
                  <div className="font-mono text-[8px] text-[#555] mb-1">COORDINATES</div>
                  <div className="font-mono text-[9px] text-[#444]">{selected.lat?.toFixed(4)}, {selected.lng?.toFixed(4)}</div>
                </div>
                {selected.details && (
                  <div>
                    <div className="font-mono text-[8px] text-[#555] mb-1">DETAILS</div>
                    <div className="text-[11px] text-[#777] leading-relaxed">{selected.details}</div>
                  </div>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="font-mono text-[9px] text-[#444] hover:text-[#e8001e] mt-2"
                >
                  × CLEAR SELECTION
                </button>
              </div>
            </div>
          ) : (
            <div>
              <SectionTitle>MAP STATS</SectionTitle>
              <div className="space-y-3 font-mono text-[9px]">
                <div className="flex justify-between border-b border-[#111] pb-2">
                  <span className="text-[#555]">TOTAL PLOTTED</span>
                  <span className="text-white">{markers.length}</span>
                </div>
                <div className="flex justify-between border-b border-[#111] pb-2">
                  <span className="text-[#555]">TTP MARKERS</span>
                  <span className="text-[#e8001e]">{markers.filter(m => m.source === 'TTP').length}</span>
                </div>
                <div className="flex justify-between border-b border-[#111] pb-2">
                  <span className="text-[#555]">BLA MARKERS</span>
                  <span className="text-[#ff6600]">{markers.filter(m => m.source === 'BLA').length}</span>
                </div>
                {['2023','2024','2025','2026'].map(y => (
                  <div key={y} className="flex justify-between border-b border-[#111] pb-2">
                    <span className="text-[#555]">{y}</span>
                    <span className="text-[#888]">{markers.filter(m => m.year === y).length}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 font-mono text-[9px] text-[#333] text-center">
                Click a marker to view incident details
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
