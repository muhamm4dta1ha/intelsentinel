import React, { useState, useEffect } from 'react'

export default function StatusBar() {
  const [utc, setUtc] = useState('')
  useEffect(() => {
    const tick = () => setUtc(new Date().toUTCString().split(' ')[4])
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 h-7 bg-[#030303]/95 border-t border-[rgba(232,0,30,0.25)] z-[999] flex items-center justify-between px-7">
      <div className="flex gap-6 font-mono text-[9px] text-[#555]">
        <span>KERNEL: <span className="text-[#00cc44]">SECURE</span></span>
        <span>SAT-LINK: <span className="text-[#00cc44]">ACTIVE</span></span>
        <span>LATENCY: <span className="text-[#00cc44]">14MS</span></span>
        <span>DB: <span className="text-[#00cc44]">SYNCHRONIZED</span></span>
        <span>THREAT: <span className="text-[#e8001e]">ELEVATED</span></span>
      </div>
      <div className="font-mono text-[9px] text-[#e8001e]">● INTEL_STREAM: ACTIVE</div>
      <div className="font-mono text-[9px] text-[#555]">UTC: {utc}</div>
    </div>
  )
}
