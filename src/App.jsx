import { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import DataKamar from './pages/DataKamar.jsx'
import DataPenghuni from './pages/DataPenghuni.jsx'
import Pembayaran from './pages/Pembayaran.jsx'
import Laporan from './pages/Laporan.jsx'

const menu = ['Dashboard', 'Data Kamar', 'Data Penghuni', 'Pembayaran', 'Laporan']

export default function App() {
  const [halaman, setHalaman] = useState('Dashboard')
  return <div className="min-vh-100 bg-light">
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary"><div className="container-fluid px-4"><a className="navbar-brand fw-bold" href="#dashboard" onClick={() => setHalaman('Dashboard')}>KosanHub</a><button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarKosan" aria-controls="navbarKosan" aria-expanded="false" aria-label="Buka menu"><span className="navbar-toggler-icon" /></button><div className="collapse navbar-collapse" id="navbarKosan"><ul className="navbar-nav ms-auto">{menu.map((item) => <li className="nav-item" key={item}><button className={`nav-link ${halaman === item ? 'active fw-semibold' : ''}`} onClick={() => setHalaman(item)}>{item}</button></li>)}</ul></div></div></nav>
    <main className="container py-4"><h1 className="h2 fw-bold">{halaman === 'Dashboard' ? 'Dashboard KosanHub' : halaman}</h1><p className="text-secondary">{halaman === 'Dashboard' ? 'Selamat datang di halaman dashboard.' : `Kelola informasi ${halaman.toLowerCase()} kos Anda.`}</p>
      {halaman === 'Dashboard' && <Dashboard />}
      {halaman === 'Data Kamar' && <DataKamar />}
      {halaman === 'Data Penghuni' && <DataPenghuni />}
      {halaman === 'Pembayaran' && <Pembayaran />}
      {halaman === 'Laporan' && <Laporan />}
    </main>
  </div>
}
