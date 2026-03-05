import React, { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, SectionTitle, StatCard, Badge, ProgressBar, ClearanceBanner, Button } from '../layout/UI'

const GROUPS = {
  TTP: {
    label: 'TTP — TEHRIK-I-TALIBAN PAKISTAN',
    threatIndex: '9.1',
    alertLevel: 'CRITICAL',
    cells: 68,
    funding: '$14.2M',
    radarData: [
      { axis: 'ARMS',   val: 92 }, { axis: 'IED',    val: 88 },
      { axis: 'HEAVY',  val: 71 }, { axis: 'CYBER',   val: 35 },
      { axis: 'COMMS',  val: 55 }, { axis: 'RECON',   val: 60 }
    ],
    kinetic: [
      { label: 'SMALL ARMS', val: 92 },
      { label: 'IED / VBIED', val: 88 },
      { label: 'HEAVY ORDNANCE', val: 71 },
      { label: 'UAV / DRONES', val: 38 },
      { label: 'SECURE COMMS', val: 55 },
    ],
    cyber: { score: '3.8', offensive: '2.8', defensive: '4.8' },
    financial: { 'TAXATION REVENUE': 'STABLE', 'EXTERNAL FUNDING': 'HIGH', 'HAWALA NETWORK': 'ACTIVE', 'LIQUIDITY': 'A+' },
    recruit: [35,52,48,78,91,84,102,95,118],
    engagements: [
      { date: 'MAR 01', event: 'IED Strike', risk: 'CRITICAL' },
      { date: 'FEB 26', event: 'Ambush',     risk: 'HIGH' },
      { date: 'FEB 22', event: 'VBIED',      risk: 'CRITICAL' },
      { date: 'FEB 18', event: 'Kidnapping', risk: 'MED' },
    ]
  },
  BLA: {
    label: 'BLA — BALOCH LIBERATION ARMY',
    threatIndex: '8.4',
    alertLevel: 'HIGH',
    cells: 42,
    funding: '$6.8M',
    radarData: [
      { axis: 'ARMS',   val: 78 }, { axis: 'IED',    val: 85 },
      { axis: 'HEAVY',  val: 40 }, { axis: 'CYBER',   val: 45 },
      { axis: 'COMMS',  val: 70 }, { axis: 'RECON',   val: 75 }
    ],
    kinetic: [
      { label: 'SMALL ARMS', val: 78 },
      { label: 'IED / RCIED', val: 85 },
      { label: 'SUICIDE OPS', val: 62 },
      { label: 'INTELLIGENCE', val: 70 },
      { label: 'MEDIA / PSYOPS', val: 80 },
    ],
    cyber: { score: '5.2', offensive: '4.1', defensive: '6.3' },
    financial: { 'DIASPORA FUNDING': 'HIGH', 'NATURAL RESOURCES': 'MODERATE', 'EXTERNAL SPONSORS': 'ACTIVE', 'LIQUIDITY': 'B+' },
    recruit: [28,35,40,65,72,68,90,85,98],
    engagements: [
      { date: 'JAN 04', event: 'FC Convoy VBIED', risk: 'CRITICAL' },
      { date: 'FEB 28', event: 'Fidayee Attack', risk: 'CRITICAL' },
      { date: 'FEB 04', event: 'Train Siege', risk: 'HIGH' },
      { date: 'JAN 11', event: 'RCIED — Panjgur', risk: 'HIGH' },
    ]
  }
}

const riskColor = { CRITICAL: 'text-[#e8001e]', HIGH: 'text-[#ff6600]', MED: 'text-[#ffaa00]' }

export default function Capability() {
  const [group, setGroup] = useState('TTP')
  const g = GROUPS[group]
  const max = Math.max(...g.recruit)

  return (
    <div className="page-enter overflow-y-auto">
      {/* Header */}
      <div className="px-10 py-6 bg-gradient-to-b from-[#0a0000] to-transparent border-b border-[#1c1c1c]">
        <ClearanceBanner />
        <div className="flex justify-between items-end">
          <div>
            <div className="font-cond text-[36px] font-black italic leading-none">
              {g.label}
            </div>
            <div className="font-mono text-[10px] text-[#555] mt-1">
              CAPABILITY ASSESSMENT // AFPAK COMMAND // LEVEL 4 CLEARANCE
            </div>
          </div>
          <div className="flex gap-2">
            {Object.keys(GROUPS).map(k => (
              <button
                key={k}
                onClick={() => setGroup(k)}
                className={`font-cond font-bold text-[11px] tracking-[2px] px-4 py-2 border transition-all ${
                  group === k
                    ? 'bg-[#e8001e] border-[#e8001e] text-white'
                    : 'bg-transparent border-[#333] text-[#666] hover:border-[#e8001e] hover:text-[#e8001e]'
                }`}
              >{k}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-10 py-6">
        {/* Top metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Threat Index"  value={g.threatIndex} trend="/10" redAccent />
          <StatCard label="Alert Level"   value={g.alertLevel} redAccent />
          <StatCard label="Active Cells"  value={g.cells} sub="SIGINT VERIFIED" />
          <StatCard label="Resource Index" value={g.funding} sub="ANNUAL EST." />
        </div>

        {/* Kinetic + Cyber */}
        <div className="grid grid-cols-[2fr_1fr] gap-5 mb-5">
          <Card>
            <SectionTitle>KINETIC & TACTICAL SOPHISTICATION</SectionTitle>
            <div className="grid grid-cols-2 gap-8 items-center">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={g.radarData}>
                  <PolarGrid stroke="#1c1c1c" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: '#555', fontSize: 9, fontFamily: 'Share Tech Mono' }}
                  />
                  <Radar
                    dataKey="val"
                    stroke="#e8001e"
                    fill="#e8001e"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div>
                {g.kinetic.map(k => (
                  <ProgressBar key={k.label} label={k.label} value={k.val} />
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>CYBER CAPABILITY</SectionTitle>
            <div className="flex flex-col items-center py-4">
              <div
                className="w-[120px] h-[120px] rounded-full border-[8px] border-[#e8001e] flex flex-col items-center justify-center"
                style={{ boxShadow: '0 0 28px rgba(232,0,30,0.3)' }}
              >
                <div className="font-cond text-[32px] font-black">{g.cyber.score}</div>
                <div className="font-mono text-[7px] text-[#555]">SOPHISTICATION</div>
              </div>
              <div className="flex justify-around w-full mt-5">
                <div className="text-center">
                  <div className="font-mono text-[8px] text-[#555] mb-1">OFFENSIVE</div>
                  <div className="font-cond text-[22px] font-black text-[#e8001e]">{g.cyber.offensive}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-[8px] text-[#555] mb-1">DEFENSIVE</div>
                  <div className="font-cond text-[22px] font-black">{g.cyber.defensive}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Recruitment */}
          <Card>
            <SectionTitle>RECRUITMENT TREND</SectionTitle>
            <div className="flex items-end gap-[5px] h-[90px]">
              {g.recruit.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 min-h-[3px] transition-all duration-700"
                  style={{
                    height: `${(v / max) * 100}%`,
                    background: v === max ? '#e8001e' : '#3d0000'
                  }}
                />
              ))}
            </div>
            <div className="font-mono text-[8px] text-[#444] mt-2">▲ SURGE DETECTED RECENT PERIOD</div>
          </Card>

          {/* Financial */}
          <Card>
            <SectionTitle>FINANCIAL HEALTH</SectionTitle>
            <div className="divide-y divide-[#111]">
              {Object.entries(g.financial).map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <span className="font-mono text-[8px] text-[#555]">{k}</span>
                  <Badge variant={v === 'ACTIVE' || v === 'HIGH' ? 'red' : 'dim'}>{v}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent engagements */}
          <Card>
            <SectionTitle>RECENT ENGAGEMENTS</SectionTitle>
            <div className="divide-y divide-[#111]">
              {g.engagements.map(e => (
                <div key={e.date} className="flex justify-between items-center py-2">
                  <span className="font-mono text-[8px] text-[#555]">{e.date}</span>
                  <span className="font-mono text-[9px]">{e.event}</span>
                  <span className={`font-mono text-[8px] font-bold ${riskColor[e.risk] || 'text-[#888]'}`}>{e.risk}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
