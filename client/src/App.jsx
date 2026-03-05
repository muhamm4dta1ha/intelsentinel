import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import StatusBar from './components/layout/StatusBar'
import CommandCenter from './components/pages/CommandCenter'
import Heatmap from './components/pages/Heatmap'
import Incidents from './components/pages/Incidents'
import Groups from './components/pages/Groups'
import Capability from './components/pages/Capability'
import Socmint from './components/pages/Socmint'

export default function App() {
  return (
    <div className="min-h-screen bg-[#030303]">
      <Navbar />
      <main className="pt-14 pb-7">
        <Routes>
          <Route path="/"           element={<CommandCenter />} />
          <Route path="/heatmap"    element={<Heatmap />} />
          <Route path="/incidents"  element={<Incidents />} />
          <Route path="/groups"     element={<Groups />} />
          <Route path="/capability" element={<Capability />} />
          <Route path="/socmint"    element={<Socmint />} />
        </Routes>
      </main>
      <StatusBar />
    </div>
  )
}
