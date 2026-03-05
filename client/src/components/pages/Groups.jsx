import React, { useState } from 'react'
import { Card, SectionTitle, Badge, StatCard, ProgressBar, ClearanceBanner, Button } from '../layout/UI'

const GROUPS = [
  {
    id: 'ttp',
    name: 'TTP',
    fullName: 'Tehrik-i-Taliban Pakistan',
    type: 'JIHADIST',
    threat: 'CRITICAL',
    threatScore: 9.1,
    region: 'KP / FATA / Pak-Afghan Border',
    founded: '2007',
    strength: '30,000–40,000',
    funding: '$14.2M/yr',
    ideology: 'Salafi-Jihadism / Deobandi',
    attacks: 427,
    activeCells: 68,
    lethality: 91,
    attackTrend: '+18%',
    kinetic: { 'SMALL ARMS': 92, 'IED / VBIED': 88, 'HEAVY ORDNANCE': 71, 'DRONES / UAV': 38, 'SECURE COMMS': 55 },
    financial: { 'TAXATION REVENUE': 'STABLE', 'EXTERNAL FUNDING': 'HIGH', 'HAWALA NETWORK': 'ACTIVE', 'LIQUIDITY': 'A+' },
    leaders: [
      { name: 'Noor Wali Mehsud', role: 'SUPREME COMMANDER' },
      { name: 'Mufti Hazrat Ali', role: 'MILITARY CHIEF' },
      { name: 'Faqir Mohammed', role: 'STRATEGIC COUNCIL' }
    ],
    tenets: [
      'Enforce strict Sharia law across Pakistan',
      'Expel all foreign military presence from the region',
      'Overthrow Pakistani state apparatus and establish an Islamic emirate'
    ],
    goals: [
      'Control strategic border crossings at Khyber/Torkham',
      'Expand urban cell networks into Punjab and Sindh',
      'Destabilize CPEC infrastructure and economic corridors'
    ],
    timeline: [
      { date: 'MAR 01, 2025', event: 'IED Strike — Peshawar Ring Road', detail: 'Suicide IED targeting military convoy. 9 casualties confirmed, 14 injured.' },
      { date: 'FEB 14, 2025', event: 'Coordinated Ambush — Khyber District', detail: 'Multi-team ambush on security checkpoint. 4 KIA, 6 injured.' },
      { date: 'JAN 28, 2025', event: 'VBIED Intercept — Islamabad Suburbs', detail: 'Vehicle-borne IED intercepted. Bomb disposal neutralized device.' }
    ]
  },
  {
    id: 'bla',
    name: 'BLA',
    fullName: 'Baloch Liberation Army',
    type: 'SEPARATIST',
    threat: 'HIGH',
    threatScore: 8.4,
    region: 'Balochistan / Makran Coast',
    founded: '2000',
    strength: '5,000–10,000',
    funding: '$6.8M/yr',
    ideology: 'Baloch Nationalism / Separatism',
    attacks: 426,
    activeCells: 42,
    lethality: 76,
    attackTrend: '+22%',
    kinetic: { 'SMALL ARMS': 78, 'IED / RCIED': 85, 'SUICIDE OPS': 62, 'INTELLIGENCE': 70, 'MEDIA / PSYOPS': 80 },
    financial: { 'DIASPORA FUNDING': 'HIGH', 'NATURAL RESOURCES': 'MODERATE', 'EXTERNAL SPONSORS': 'ACTIVE', 'LIQUIDITY': 'B+' },
    leaders: [
      { name: 'Bashir Zeb', role: 'SUPREME COMMANDER' },
      { name: 'Jeeyand Baloch', role: 'SPOKESMAN / MEDIA WING' },
      { name: 'Majeed Brigade', role: 'ELITE OPERATIONS UNIT' }
    ],
    tenets: [
      'Establish an independent Balochistan state',
      'End Pakistani military and administrative control',
      'Reclaim natural resource revenues for Baloch people'
    ],
    goals: [
      'Target CPEC projects and Chinese-Pakistani interests',
      'Maintain cross-border operational safe havens in Afghanistan',
      'Gain international recognition as a national liberation movement'
    ],
    timeline: [
      { date: 'JAN 04, 2025', event: 'FC Convoy Suicide Attack — Turbat', detail: 'Majeed Brigade Fidayee op. 47 claimed killed by BLA; official count: 11.' },
      { date: 'FEB 28, 2025', event: 'First Female Fidayee — Turbat', detail: 'First confirmed female suicide attacker in BLA history. FC checkpoint targeted.' },
      { date: 'FEB 04, 2025', event: 'Train Hostage Siege — Balochistan Railway', detail: 'Simultaneous ambush on passenger train. 12-hour hostage situation resolved.' }
    ]
  }
]

export default function Groups() {
  const [activeId, setActiveId] = useState('ttp')
  const g = GROUPS.find(x => x.id === activeId)

  return (
    <div className="page-enter flex h-[calc(100vh-84px)]">
      {/* Group list */}
      <div className="w-[300px] border-r border-[#1c1c1c] bg-[#080808] overflow-y-auto">
        <div className="p-4 border-b border-[#1c1c1c] sticky top-0 bg-[#080808] z-10">
          <div className="font-mono text-[9px] text-[#e8001e] tracking-[3px]">TRACKED GROUPS</div>
        </div>
        {GROUPS.map(grp => (
          <div
            key={grp.id}
            onClick={() => setActiveId(grp.id)}
            className={`p-4 border-b border-[#1c1c1c] cursor-pointer transition-all duration-150 ${
              activeId === grp.id
                ? 'bg-[rgba(232,0,30,0.08)] border-l-[3px] border-l-[#e8001e]'
                : 'hover:bg-[#0d0d0d]'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-cond text-[18px] font-black italic">{grp.name}</div>
              <Badge variant={grp.threat === 'CRITICAL' ? 'red' : 'warn'}>{grp.threat}</Badge>
            </div>
            <div className="font-mono text-[9px] text-[#444] mb-2">{grp.fullName}</div>
            <div className="flex gap-4 font-mono text-[8px] text-[#555]">
              <span>⊕ {grp.activeCells} cells</span>
              <span>✦ {grp.attacks} attacks</span>
            </div>
          </div>
        ))}
      </div>

      {/* Group detail */}
      <div className="flex-1 overflow-y-auto p-8">
        <ClearanceBanner />
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="font-cond text-[44px] font-black italic leading-none uppercase">
              {g.name} <Badge variant="red">{g.threat}</Badge>
            </div>
            <div className="font-body text-[14px] text-[#666] mt-1">{g.fullName}</div>
            <div className="flex gap-3 mt-3">
              <Badge variant="dim">{g.ideology}</Badge>
              <Badge variant="dim">{g.type}</Badge>
              <Badge variant="dim">EST. {g.founded}</Badge>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-24 h-24 rounded-full border-[6px] border-[#e8001e] flex flex-col items-center justify-center"
              style={{ boxShadow: '0 0 24px rgba(232,0,30,0.3), inset 0 0 24px rgba(232,0,30,0.05)' }}
            >
              <div className="font-cond text-[30px] font-black">{g.threatScore}</div>
              <div className="font-mono text-[7px] text-[#555]">THREAT</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Incidents (SATP)" value={g.attacks} redAccent />
          <StatCard label="Annual Funding"  value={g.funding} />
          <StatCard label="Active Cells"    value={g.activeCells} />
          <div className="intel-card p-5">
            <div className="font-mono text-[9px] text-[#555] tracking-[2px] mb-2">LETHALITY INDEX</div>
            <div className="h-[6px] bg-[#111] mt-3">
              <div className="h-full bg-[#e8001e]" style={{ width: `${g.lethality}%`, boxShadow: '0 0 10px rgba(232,0,30,0.5)' }} />
            </div>
            <div className="font-mono text-[9px] text-[#e8001e] mt-1">{g.lethality}%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* Kinetic */}
          <Card>
            <SectionTitle>KINETIC CAPABILITIES</SectionTitle>
            {Object.entries(g.kinetic).map(([k, v]) => (
              <ProgressBar key={k} label={k} value={v} />
            ))}
          </Card>

          {/* Financial */}
          <Card>
            <SectionTitle>FINANCIAL HEALTH</SectionTitle>
            <div className="divide-y divide-[#111]">
              {Object.entries(g.financial).map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <span className="font-mono text-[9px] text-[#555]">{k}</span>
                  <Badge variant={v === 'ACTIVE' || v === 'HIGH' ? 'red' : 'dim'}>{v}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <SectionTitle>LEADERSHIP</SectionTitle>
              {g.leaders.map((l, i) => (
                <div key={l.name} className="flex items-center gap-3 mb-2">
                  <div className={`flex items-center justify-center border font-cond font-black text-[${i===0?'16':'13'}px] ${i===0?'w-10 h-10 border-[#e8001e]':'w-8 h-8 border-[#333]'} bg-[#0d0d0d] text-[#888]`}>
                    {l.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-cond text-[13px] font-bold">{l.name}</div>
                    <div className="font-mono text-[8px] text-[#e8001e]">{l.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <Card className="border-l-[3px] border-l-[#e8001e]">
            <SectionTitle>CORE TENETS</SectionTitle>
            <ul className="pl-4 space-y-2">
              {g.tenets.map(t => <li key={t} className="text-[13px] text-[#888] leading-relaxed">• {t}</li>)}
            </ul>
          </Card>
          <Card className="border-l-[3px] border-l-[#e8001e]">
            <SectionTitle>STRATEGIC GOALS</SectionTitle>
            <ul className="pl-4 space-y-2">
              {g.goals.map(go => <li key={go} className="text-[13px] text-[#888] leading-relaxed">◎ {go}</li>)}
            </ul>
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <SectionTitle>RECENT INCIDENT TIMELINE</SectionTitle>
          <div className="border-l border-[rgba(232,0,30,0.3)] ml-3 pl-6 space-y-6">
            {g.timeline.map(t => (
              <div key={t.date} className="relative">
                <div className="absolute left-[-27px] top-[6px] w-2 h-2 rounded-full bg-[#e8001e] shadow-[0_0_8px_rgba(232,0,30,0.5)]" />
                <div className="font-mono text-[9px] text-[#e8001e] font-bold mb-1">{t.date}</div>
                <div className="font-cond text-[16px] font-bold mb-1">{t.event}</div>
                <div className="text-[12px] text-[#666] leading-relaxed">{t.detail}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
