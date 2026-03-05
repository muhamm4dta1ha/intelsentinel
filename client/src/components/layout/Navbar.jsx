import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LiveDot } from './UI'

const NAV = [
  { path: '/',            label: 'COMMAND CENTER' },
  { path: '/heatmap',     label: 'HEATMAP' },
  { path: '/incidents',   label: 'INCIDENTS' },
  { path: '/groups',      label: 'GROUPS' },
  { path: '/capability',  label: 'CAPABILITY' },
  { path: '/socmint',     label: 'SOCMINT' },
]

export default function Navbar() {
  const [utc, setUtc] = useState('')
  const location = useLocation()

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setUtc(now.toUTCString().split(' ')[4] + ' UTC')
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-[1000] bg-[#030303]/95 border-b border-[rgba(232,0,30,0.25)] backdrop-blur-md flex items-center justify-between px-7">
      {/* Brand */}
      <div className="font-cond text-[20px] font-black italic tracking-[-1px] shrink-0">
        INTEL<span className="text-[#e8001e]">SENTINEL</span>
      </div>

      {/* Nav links */}
      <div className="flex gap-[2px] overflow-x-auto">
        {NAV.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `font-cond text-[11px] font-bold tracking-[1.5px] px-3 py-2 transition-all duration-150 uppercase border whitespace-nowrap ` +
              (isActive
                ? 'text-[#e8001e] border-[rgba(232,0,30,0.3)] bg-[rgba(232,0,30,0.06)]'
                : 'text-[#555] border-transparent hover:text-white hover:border-[#1c1c1c]')
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="font-mono text-[9px] text-[#555]">
          <LiveDot /><span>SYSTEM LIVE</span>
        </div>
        <div className="font-mono text-[11px] text-[#888]">{utc}</div>
        <div className="font-mono text-[8px] bg-[#e8001e] text-white px-2 py-1 tracking-[1px]">LEVEL 4</div>
      </div>
    </nav>
  )
}
