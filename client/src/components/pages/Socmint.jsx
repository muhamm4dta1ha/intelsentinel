import React, { useState, useEffect } from 'react'
import { Card, SectionTitle, Badge, ProgressBar, StatCard } from '../layout/UI'

const STREAM = [
  { id: 'AL-ANSAR_TACTICAL', time: '02:14:04 Z', text: 'The harvest of patience arrives. Assemble the faithful at predetermined coordinates. Phase 2 initiates tomorrow.', tags: ['RECRUITMENT', 'MOBILIZATION'] },
  { id: 'SHADOW_INTEL_99',   time: '02:10:22 Z', text: 'Distribution of digital OPSEC manuals via decentralized storage. All units must acknowledge receipt via channel Delta-7.', tags: ['TRADECRAFT', 'OPSEC'] },
  { id: 'KHORASAN_MEDIA',    time: '01:54:10 Z', text: 'New visual release: Strategic infrastructure seizure in Sector 7. Logistics compromised. Full report on secure channel.', tags: ['PROPAGANDA', 'VIOLENCE'] },
  { id: 'TTP_OFFICIAL',      time: '01:22:44 Z', text: 'Mobilization order broadcast across 14 provincial cells. Phase 2 operational tempo commences Friday at dawn.', tags: ['MOBILIZATION', 'CRITICAL'] },
  { id: 'BALOCH_LIBERATION', time: '01:08:33 Z', text: 'BLA Majeed Brigade communique: "Zirpahazag operations continue. Enemy positions marked for Phase 3 engagement."', tags: ['BLA', 'OPERATIONS'] },
]

export default function Socmint() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 5000)
    return () => clearInterval(id)
  }, [])

  const indices = [
    { label: 'RADICALIZATION VELOCITY', val: 82 },
    { label: 'ECHO CHAMBER DENSITY',    val: 67 },
    { label: 'HOSTILITY INDEX',         val: 74 },
    { label: 'NARRATIVE COHERENCE',     val: 58 },
    { label: 'MOBILIZATION SIGNALS',    val: 71 },
  ]

  return (
    <div className="page-enter overflow-y-auto">
      <div className="px-8 py-6 flex flex-col gap-5">
        {/* Top signals */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { platform: 'TWITTER / X',      vol: '4.2K', trend: '+14%', pct: 60, status: 'HIGH ACTIVITY',  statusColor: 'warn' },
            { platform: 'TELEGRAM CHANNELS', vol: '8.9K', trend: '+32%', pct: 85, status: 'ESCALATING',    statusColor: 'red' },
            { platform: 'META / FACEBOOK',   vol: '1.2K', trend: '+2%',  pct: 20, status: 'BASELINE',      statusColor: 'dim' },
          ].map(s => (
            <Card key={s.platform} redBorder={s.statusColor === 'red'}>
              <div className="font-mono text-[9px] text-[#555] tracking-[2px] mb-2">{s.platform}</div>
              <div className="flex items-end justify-between">
                <div className="font-cond text-[32px] font-black italic">{s.vol}</div>
                <div className="font-mono text-[12px] text-[#e8001e] font-bold">{s.trend}</div>
              </div>
              <div className="h-[3px] bg-[#111] my-3">
                <div className="h-full bg-[#e8001e] transition-all" style={{ width: `${s.pct}%` }} />
              </div>
              <Badge variant={s.statusColor}>{s.status}</Badge>
            </Card>
          ))}
        </div>

        {/* Propaganda stream + indices */}
        <div className="grid grid-cols-[1fr_380px] gap-5">
          {/* Stream */}
          <Card>
            <SectionTitle>LIVE PROPAGANDA STREAM</SectionTitle>
            <div className="divide-y divide-[#0d0d0d]">
              {STREAM.map((s, i) => (
                <div key={s.id} className="py-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] text-[#e8001e] font-bold">@{s.id}</span>
                    <span className="font-mono text-[9px] text-[#444]">{s.time}</span>
                  </div>
                  <p className="text-[13px] text-[#aaa] italic leading-relaxed mb-3">"{s.text}"</p>
                  <div className="flex gap-2 flex-wrap">
                    {s.tags.map(t => (
                      <span key={t} className="font-mono text-[8px] px-2 py-1 bg-[#110005] text-[#e8001e] border border-[#3d0000] tracking-[1px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <Card>
              <SectionTitle>RADICALIZATION INDICES</SectionTitle>
              {indices.map(i => <ProgressBar key={i.label} label={i.label} value={i.val} />)}
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Narrative Impact"  value="12.4K" />
              <StatCard label="Audience Exposure" value="2.1M"  />
              <StatCard label="Identified Assets" value="342"   />
              <StatCard label="Hostility Index"   value="74%"   />
            </div>
          </div>
        </div>

        {/* Network graph (SVG) */}
        <Card style={{ height: '220px', position: 'relative', overflow: 'hidden', background: '#000' }}>
          <SectionTitle>RELATIONAL NETWORK MAP</SectionTitle>
          <svg width="100%" height="180" className="absolute top-10 left-0">
            {/* Static network visualization */}
            {Array.from({ length: 40 }, (_, i) => {
              const x1 = 50 + Math.sin(i * 0.7) * 400 + 400
              const y1 = 30 + Math.cos(i * 0.5) * 60 + 60
              const x2 = 50 + Math.sin((i + 3) * 0.7) * 400 + 400
              const y2 = 30 + Math.cos((i + 3) * 0.5) * 60 + 60
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(232,0,30,0.1)" strokeWidth="0.5" />
            })}
            {Array.from({ length: 28 }, (_, i) => {
              const x = 60 + (i * 37) % 860
              const y = 20 + (i * 23) % 140
              const main = i < 5
              return (
                <circle
                  key={i}
                  cx={x} cy={y}
                  r={main ? 5 : 3}
                  fill={main ? '#e8001e' : 'rgba(232,0,30,0.5)'}
                  stroke={main ? '#e8001e' : 'none'}
                  strokeWidth="1"
                />
              )
            })}
          </svg>
          <div className="absolute bottom-3 right-4 font-mono text-[8px] text-[#333]">
            342 NODES · 1,204 CONNECTIONS
          </div>
        </Card>
      </div>
    </div>
  )
}
