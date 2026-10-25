import { useState } from 'react'
import { navigation } from './data/data.js'
import Dashboard from './pages/Dashboard.jsx'
import DataKamar from './pages/DataKamar.jsx'
import DataPenghuni from './pages/DataPenghuni.jsx'
import Pembayaran from './pages/Pembayaran.jsx'
import Laporan from './pages/Laporan.jsx'
import './App.css'

function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar bg-white border-end d-flex flex-column p-3">
      <a href="#dashboard" className="brand d-flex align-items-center gap-2 mb-5 text-decoration-none" onClick={() => onNavigate('Dashboard')}>
        <span className="brand-mark rounded-3 text-white fw-bold d-grid">K</span>
        <span className="fw-bold text-dark fs-5">Kosan<span className="text-success">Hub</span><small className="d-block text-secondary">PROPERTY MANAGER</small></span>
      </a>
      <div className="text-uppercase text-secondary fw-semibold small px-2 mb-2">Menu utama</div>
      <nav className="nav nav-pills flex-column gap-1" aria-label="Navigasi utama">
        {navigation.map((item) => <button key={item.label} className={`nav-link text-start ${active === item.label ? 'active' : 'text-secondary'}`} onClick={() => onNavigate(item.label)}><span className="nav-icon me-3">{item.icon}</span>{item.label}</button>)}
      </nav>
      <div className="mt-auto">
        <div className="help-card card border-0 bg-light mb-3"><div className="card-body p-3"><strong className="small">Butuh bantuan?</strong><p className="text-secondary small my-2">Hubungi tim support kami.</p><button className="btn btn-link p-0 text-success text-decoration-none small fw-semibold" onClick={() => window.alert('Hubungi support KosanHub melalui support@kosanhub.id.')}>Hubungi Support â†—</button></div></div>
        <button className="btn btn-light w-100 text-start text-secondary mb-2" onClick={() => window.alert('Anda telah keluar dari akun demo.')}>â†ªã€€Keluar</button>
        <div className="d-flex align-items-center gap-2 border-top pt-3"><div className="avatar admin-avatar rounded-circle fw-bold d-grid">AR</div><div><strong className="d-block small">Admin Rumah Kos</strong><span className="text-secondary small">Administrator</span></div></div>
      </div>
    </aside>
  )
}

function Topbar() {
  return <header className="topbar bg-white border-bottom d-flex align-items-center justify-content-between px-4"><div className="small text-secondary">Workspace <span className="mx-2">/</span><strong className="text-dark">Dashboard</strong></div><div className="d-flex align-items-center gap-3"><button className="btn btn-light btn-sm" aria-label="Cari">âŒ•</button><button className="btn btn-light btn-sm position-relative" aria-label="Notifikasi">â™§<span className="notification-dot" /></button><div className="avatar admin-avatar rounded-circle fw-bold d-grid">AR</div><div><strong className="d-block small">Admin Rumah Kos</strong><span className="text-secondary small">Administrator</span></div><span className="text-secondary">âŒ„</span></div></header>
}

function App() {
  const [active, setActive] = useState('Dashboard')
  return <div className="app-shell"><Sidebar active={active} onNavigate={setActive}/><div className="main-column"><Topbar/><main className="main-content container-fluid">{active === 'Dashboard' && <Dashboard/>}{active === 'Data Kamar' && <DataKamar/>}{active === 'Data Penghuni' && <DataPenghuni/>}{active === 'Pembayaran' && <Pembayaran/>}{active === 'Laporan' && <Laporan/>}<footer className="text-center text-secondary small py-4">Â© 2026 KosanHub <span className="px-1">â€¢</span> Kelola kos lebih mudah.</footer></main></div></div>
}

export default App



