import React from 'react'

// ── Card ──────────────────────────────────────────────
export function Card({ children, className = '', redBorder = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`intel-card p-5 relative ${redBorder ? 'border-l-[3px] border-l-[#e8001e]' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// ── SectionTitle ──────────────────────────────────────
export function SectionTitle({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <div className="w-[3px] h-[14px] bg-[#e8001e] shrink-0" />
      <span className="font-mono text-[10px] text-[#e8001e] tracking-[3px] uppercase font-bold">
        {children}
      </span>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────
export function Badge({ children, variant = 'dim' }) {
  const styles = {
    red:  'bg-[#e8001e] text-white',
    dim:  'bg-[#111] text-[#888] border border-[#1c1c1c]',
    warn: 'bg-[#7a2d00] text-[#ff8c42]',
    ok:   'bg-[#003d1a] text-[#00cc44]'
  }
  return (
    <span className={`font-mono text-[8px] px-[6px] py-[2px] tracking-[1px] uppercase ${styles[variant]}`}>
      {children}
    </span>
  )
}

// ── StatCard ──────────────────────────────────────────
export function StatCard({ label, value, sub, redAccent = false, trend, className = '' }) {
  return (
    <Card redBorder={redAccent} className={className}>
      <div className="font-mono text-[9px] text-[#555] tracking-[2px] uppercase mb-2">{label}</div>
      <div className={`font-cond text-[32px] font-black italic leading-none ${redAccent ? 'text-[#e8001e]' : 'text-white'}`}>
        {value}
        {trend && (
          <span className="text-[13px] ml-1 text-[#e8001e]">{trend}</span>
        )}
      </div>
      {sub && <div className="font-mono text-[8px] text-[#444] mt-1 tracking-[1px]">{sub}</div>}
    </Card>
  )
}

// ── ProgressBar ───────────────────────────────────────
export function ProgressBar({ value, max = 100, label, showVal = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="mb-3">
      {label && (
        <div className="flex justify-between font-mono text-[9px] mb-1">
          <span className="text-[#666]">{label}</span>
          {showVal && <span className="text-[#e8001e]">{value}</span>}
        </div>
      )}
      <div className="h-[3px] bg-[#111]">
        <div
          className="h-full bg-[#e8001e] transition-all duration-700"
          style={{ width: `${pct}%`, boxShadow: '0 0 6px rgba(232,0,30,0.4)' }}
        />
      </div>
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────
export function Spinner({ text = 'LOADING INTEL…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="w-8 h-8 border-2 border-[#1c1c1c] border-t-[#e8001e] rounded-full animate-spin" />
      <div className="font-mono text-[9px] text-[#555] tracking-[3px]">{text}</div>
    </div>
  )
}

// ── ErrorBox ──────────────────────────────────────────
export function ErrorBox({ message }) {
  return (
    <div className="border border-[#e8001e]/30 bg-[#e8001e]/5 p-4 font-mono text-[10px] text-[#e8001e]">
      ⚠ API ERROR: {message}
    </div>
  )
}

// ── Button ────────────────────────────────────────────
export function Button({ children, onClick, variant = 'ghost', className = '', disabled = false }) {
  const styles = {
    red:   'bg-[#e8001e] text-white hover:bg-[#ff0022] hover:shadow-[0_0_20px_rgba(232,0,30,0.4)]',
    ghost: 'bg-transparent border border-[#333] text-[#888] hover:border-[#e8001e] hover:text-[#e8001e]'
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-cond text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 transition-all duration-150 disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// ── Select ────────────────────────────────────────────
export function Select({ value, onChange, options, placeholder = 'ALL', className = '' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`bg-[#0d0d0d] border border-[#1c1c1c] text-[#888] font-mono text-[10px] px-3 py-2 focus:outline-none focus:border-[#e8001e] tracking-[1px] ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  )
}

// ── Input ─────────────────────────────────────────────
export function Input({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-[#0d0d0d] border border-[#1c1c1c] text-white font-mono text-[11px] px-3 py-2 focus:outline-none focus:border-[#e8001e] placeholder-[#333] ${className}`}
    />
  )
}

// ── LiveDot ───────────────────────────────────────────
export function LiveDot() {
  return (
    <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#e8001e] live-pulse mr-1" />
  )
}

// ── ClearanceBanner ───────────────────────────────────
export function ClearanceBanner() {
  return (
    <div className="font-mono text-[9px] text-[#e8001e] tracking-[3px] flex items-center gap-2 mb-2">
      ✔ CLASSIFIED // TOP SECRET // LEVEL 4 CLEARANCE REQUIRED
    </div>
  )
}
