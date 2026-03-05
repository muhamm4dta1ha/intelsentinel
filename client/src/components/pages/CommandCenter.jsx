import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { useFetch } from '../../hooks/useFetch'
import { fetchStats } from '../../utils/api'
import {
  Card, StatCard, SectionTitle, Badge, ProgressBar, Spinner, ErrorBox, Button, ClearanceBanner, LiveDot
} from '../layout/UI'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d0d0d] border border-[rgba(232,0,30,0.3)] p-3">
      <div className="font-mono text-[9px] text-[#e8001e] mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="font-mono text-[10px]" style={{ color: p.color }}>
          {p.dataKey.toUpperCase()}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function CommandCenter() {
  const navigate = useNavigate()
  const { data: stats, loading, error } = useFetch(fetchStats)

  if (loading) return <div className="page-enter"><Spinner text="LOADING COMMAND CENTER…" /></div>
  if (error)   return <div className="p-8"><ErrorBox message={error} /></div>

  const totalTTP = stats.bySource?.TTP || 0
  const totalBLA = stats.bySource?.BLA || 0
  const total    = stats.total || 0

  return (
    <div className="page-enter">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#0a0000] via-[#050505] to-[#000] border-b border-[rgba(232,0,30,0.2)] px-10 py-8 overflow-hidden">
        <div
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 font-cond font-black italic text-[130px] text-[rgba(232,0,30,0.025)] pointer-events-none whitespace-nowrap"
          aria-hidden
        >INTELSENTINEL</div>
        <ClearanceBanner />
        <div className="font-cond text-[46px] font-black italic leading-tight uppercase">
          PAKISTAN THREAT<br />INTELLIGENCE PLATFORM
        </div>
        <div className="font-mono text-[10px] text-[#555] mt-2">
          SIGINT · HUMINT · OSINT · SOCMINT · GEOINT &nbsp;·&nbsp; SATP DATA — {total} RECORDS LOADED
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="red" onClick={() => navigate('/heatmap')}>⊕ OPEN HEATMAP</Button>
          <Button variant="ghost" onClick={() => navigate('/incidents')}>BROWSE INCIDENTS →</Button>
        </div>
      </div>

      {/* Top-level stats */}
      <div className="grid grid-cols-4 border-b border-[#1c1c1c]">
        <StatCard label="Total Incidents" value={total.toLocaleString()} redAccent className="border-r border-[#1c1c1c]" />
        <StatCard label="TTP Incidents"   value={totalTTP.toLocaleString()} sub="Tehrik-i-Taliban Pakistan" className="border-r border-[#1c1c1c]" />
        <StatCard label="BLA Incidents"   value={totalBLA.toLocaleString()} sub="Baloch Liberation Army" className="border-r border-[#1c1c1c]" />
        <StatCard label="Geolocated"      value={stats.withCoords || 0} sub={`of ${total} total`} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[280px_1fr] min-h-[calc(100vh-340px)]">
        {/* Left sidebar */}
        <div className="border-r border-[#1c1c1c] p-5 flex flex-col gap-6">
          {/* Year breakdown */}
          <div>
            <SectionTitle>BY YEAR</SectionTitle>
            {stats.yearSourceSorted?.map(y => (
              <div key={y.year} className="mb-3">
                <div className="flex justify-between font-mono text-[9px] text-[#555] mb-1">
                  <span>{y.year}</span>
                  <span className="text-[#888]">{(y.TTP + y.BLA).toLocaleString()}</span>
                </div>
                <div className="h-[3px] bg-[#111]">
                  <div
                    className="h-full bg-[#e8001e] transition-all duration-700"
                    style={{ width: `${Math.round(((y.TTP + y.BLA) / total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Source split */}
          <div>
            <SectionTitle>SOURCE SPLIT</SectionTitle>
            <div className="space-y-2">
              {[{ label: 'TTP', val: totalTTP }, { label: 'BLA', val: totalBLA }].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="font-cond text-[22px] font-black italic w-10">{s.label}</div>
                  <div className="flex-1">
                    <div className="flex justify-between font-mono text-[9px] mb-1">
                      <span className="text-[#e8001e]">{s.val}</span>
                      <span className="text-[#444]">{Math.round((s.val / total) * 100)}%</span>
                    </div>
                    <div className="h-[3px] bg-[#111]">
                      <div className="h-full bg-[#e8001e]" style={{ width: `${Math.round((s.val / total) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top weapons */}
          <div>
            <SectionTitle>TOP WEAPONS</SectionTitle>
            {stats.topWeapons?.slice(0, 8).map(w => (
              <div key={w.weapon} className="mb-2">
                <ProgressBar label={w.weapon.substring(0, 22)} value={w.count} max={stats.topWeapons[0]?.count} />
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Yearly stacked bar */}
          <Card>
            <SectionTitle>INCIDENTS BY YEAR & SOURCE</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.yearSourceSorted} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                <XAxis dataKey="year" tick={{ fill: '#555', fontSize: 10, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="TTP" stackId="a" fill="#e8001e" />
                <Bar dataKey="BLA" stackId="a" fill="#8a0012" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly chart */}
          <Card>
            <SectionTitle>INCIDENT FREQUENCY BY MONTH (ALL YEARS)</SectionTitle>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.byMonthSorted} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                <XAxis
                  dataKey="month"
                  tickFormatter={m => m.substring(0, 3).toUpperCase()}
                  tick={{ fill: '#555', fontSize: 9, fontFamily: 'Share Tech Mono' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis tick={{ fill: '#555', fontSize: 9, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#e8001e" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Weapon chart */}
          <Card>
            <SectionTitle>WEAPON TYPE FREQUENCY</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.topWeapons?.slice(0, 10)} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#555', fontSize: 9, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category" dataKey="weapon" width={130}
                  tick={{ fill: '#666', fontSize: 9, fontFamily: 'Share Tech Mono' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => v.length > 18 ? v.substring(0, 18) + '…' : v}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#e8001e" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}
