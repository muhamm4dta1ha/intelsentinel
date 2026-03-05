import React, { useState, useEffect, useCallback } from 'react'
import { fetchIncidents } from '../../utils/api'
import {
  Card, SectionTitle, Badge, Spinner, ErrorBox, Button, Select, Input
} from '../layout/UI'

const YEAR_OPTIONS = ['2023','2024','2025','2026']
const SOURCE_OPTIONS = [{ value: 'TTP', label: 'TTP' }, { value: 'BLA', label: 'BLA' }]
const WEAPON_OPTIONS = ['IED','Bomb','Mortar','Grenade','AK-47','Small Arms','Rocket','Mine','Drone']
const PAGE_SIZE = 40

export default function Incidents() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  // Filters
  const [year, setYear]     = useState('')
  const [source, setSource] = useState('')
  const [weapon, setWeapon] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    fetchIncidents({ year, source, weapon, search, page, limit: PAGE_SIZE })
      .then(res => { setData(res.data); setTotal(res.total); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [year, source, weapon, search, page])

  useEffect(() => { setPage(1) }, [year, source, weapon, search])
  useEffect(() => { load() }, [load])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const srcColor = (src) => src === 'TTP' ? 'red' : 'warn'

  return (
    <div className="page-enter flex flex-col h-[calc(100vh-84px)]">
      {/* Filter bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#1c1c1c] bg-[#080808] flex-wrap">
        <div className="font-cond text-[14px] font-black italic mr-2">INCIDENT DATABASE</div>
        <Select value={year}   onChange={setYear}   options={YEAR_OPTIONS}   placeholder="ALL YEARS" />
        <Select value={source} onChange={setSource} options={SOURCE_OPTIONS} placeholder="ALL SOURCES" />
        <Select value={weapon} onChange={setWeapon} options={WEAPON_OPTIONS} placeholder="ALL WEAPONS" />
        <form
          className="flex gap-2"
          onSubmit={e => { e.preventDefault(); setSearch(searchInput) }}
        >
          <Input value={searchInput} onChange={setSearchInput} placeholder="SEARCH LOCATION / DETAILS…" className="w-56" />
          <Button variant="red" onClick={() => setSearch(searchInput)}>GO</Button>
        </form>
        <Button variant="ghost" onClick={() => { setYear(''); setSource(''); setWeapon(''); setSearch(''); setSearchInput('') }}>
          RESET
        </Button>
        <div className="ml-auto font-mono text-[9px] text-[#555]">
          {total.toLocaleString()} RECORDS
        </div>
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-y-auto">
        {loading && <Spinner />}
        {error   && <div className="p-6"><ErrorBox message={error} /></div>}
        {!loading && !error && (
          <table className="intel-table w-full">
            <thead className="sticky top-0 z-10">
              <tr>
                <th>DATE</th>
                <th>YEAR</th>
                <th>SOURCE</th>
                <th>LOCATION</th>
                <th>DISTRICT</th>
                <th>WEAPONS</th>
                <th>CASUALTIES</th>
                <th>COORDS</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr
                  key={row.id}
                  onClick={() => setSelected(row)}
                  className="cursor-pointer"
                >
                  <td className="font-mono text-[9px] whitespace-nowrap">{row.date}</td>
                  <td className="font-mono text-[9px]">{row.year}</td>
                  <td>
                    <Badge variant={srcColor(row.source)}>{row.source}</Badge>
                  </td>
                  <td className="max-w-[180px] truncate">{row.location}</td>
                  <td className="max-w-[160px] truncate text-[#555]">{row.district}</td>
                  <td className="max-w-[140px] truncate text-[#888]">{row.weapons || '—'}</td>
                  <td>
                    {row.casualties
                      ? <span className="font-mono text-[9px] text-[#e8001e]">{row.casualties}</span>
                      : <span className="text-[#333]">—</span>
                    }
                  </td>
                  <td>
                    {row.lat
                      ? <span className="font-mono text-[8px] text-[#444]">✓</span>
                      : <span className="text-[#222]">—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#1c1c1c] bg-[#080808]">
          <Button variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            ← PREV
          </Button>
          <span className="font-mono text-[9px] text-[#555]">
            PAGE {page} / {totalPages} &nbsp;·&nbsp; {total.toLocaleString()} RECORDS
          </span>
          <Button variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            NEXT →
          </Button>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#0a0a0a] border border-[rgba(232,0,30,0.3)] p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-mono text-[9px] text-[#e8001e] tracking-[3px] mb-2">
                  INCIDENT REPORT // {selected.source} // {selected.year}
                </div>
                <div className="font-cond text-[24px] font-black italic uppercase">
                  {selected.location || selected.district}
                </div>
                <div className="font-mono text-[10px] text-[#555] mt-1">{selected.date}</div>
              </div>
              <button onClick={() => setSelected(null)} className="font-mono text-[#444] hover:text-[#e8001e] text-[20px] leading-none">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'DISTRICT', val: selected.district },
                { label: 'WEAPONS', val: selected.weapons || '—' },
                { label: 'CASUALTIES', val: selected.casualties || '—' },
                { label: 'COORDINATES', val: selected.lat ? `${selected.lat?.toFixed(4)}, ${selected.lng?.toFixed(4)}` : 'Not available' },
              ].map(f => (
                <div key={f.label} className="bg-[#050505] border border-[#1c1c1c] p-3">
                  <div className="font-mono text-[8px] text-[#555] mb-1">{f.label}</div>
                  <div className={`text-[13px] ${f.label === 'CASUALTIES' && selected.casualties ? 'text-[#e8001e] font-bold' : 'text-[#ccc]'}`}>{f.val}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#050505] border border-[#1c1c1c] p-4">
              <div className="font-mono text-[8px] text-[#555] mb-2">INCIDENT DETAILS</div>
              <div className="text-[12px] text-[#888] leading-relaxed">{selected.details}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
