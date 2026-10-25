import { useMemo, useState } from 'react'
import { initialResidents, initialRooms } from '../data/data.js'

function SummaryCard({ title, value, note, icon, tone, trend }) {
  return <div className="col-6 col-xl-3"><article className="card summary-card h-100 border"><div className="card-body p-3 p-lg-4"><div className="d-flex justify-content-between"><span className={`summary-icon ${tone} rounded-3 d-grid`}>{icon}</span><span className="text-secondary">Â·Â·Â·</span></div><p className="text-secondary small mb-1 mt-3">{title}</p><div className="summary-value fw-bold">{value}</div><div className="small text-secondary mt-1">{trend && <span className="badge text-bg-success-subtle text-success me-1">{trend}</span>}{note}</div></div></article></div>
}

function RoomStatus({ rooms }) {
  const occupied = rooms.filter((room) => room.resident).length
  const percent = rooms.length ? Math.round((occupied / rooms.length) * 100) : 0
  return <section className="card panel-card h-100"><div className="card-body p-3 p-lg-4"><div className="d-flex justify-content-between"><div><h2 className="panel-title">Status Kamar</h2><p className="text-secondary small">Pantau ketersediaan kamar kos Anda</p></div><button className="btn btn-link text-success text-decoration-none small p-0">Lihat semua â†’</button></div><div className="d-flex align-items-baseline justify-content-between mt-4 mb-2"><strong className="fs-4">{occupied}<span className="fs-6 fw-normal text-secondary ms-1">/ {rooms.length} kamar terisi</span></strong><span className="text-success small fw-bold">{percent}%</span></div><div className="progress" role="progressbar" aria-label="Persentase kamar terisi" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><div className="progress-bar bg-success" style={{ width: `${percent}%` }} /></div><div className="room-grid mt-3">{rooms.map((room) => <div key={room.number} className="room-chip rounded border text-center p-2"><span className={`status-dot ${room.resident ? 'bg-success' : 'bg-warning'}`} /> <strong>{room.number}</strong><small className="d-block text-secondary mt-1">{room.resident ? 'Terisi' : 'Kosong'}</small></div>)}</div><div className="d-flex justify-content-end gap-3 text-secondary mt-3 room-legend"><span><i className="status-dot bg-success" />Terisi</span><span><i className="status-dot bg-warning" />Kosong</span></div></div></section>
}

function IncomeCard() {
  return <section className="card panel-card h-100"><div className="card-body p-3 p-lg-4"><div className="d-flex justify-content-between"><div><h2 className="panel-title">Ringkasan Pendapatan</h2><p className="text-secondary small">Total pembayaran bulan ini</p></div><button className="btn btn-light btn-sm">Â·Â·Â·</button></div><div className="income-value fw-bold mt-4">Rp 3.000.000</div><div className="small text-secondary"><span className="text-success fw-semibold">â†— 8,5%</span> dari bulan lalu</div><div className="income-note border-top mt-4 pt-3 small text-secondary">Pendapatan tercatat dari pembayaran sewa bulan Oktober.</div></div></section>
}

function ResidentForm({ rooms, onAdd, onCancel }) {
  const [form, setForm] = useState({ name: '', room: '', phone: '' })
  const [error, setError] = useState('')
  const availableRooms = rooms.filter((room) => !room.resident)
  function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.room || !form.phone.trim()) { setError('Lengkapi nama, kamar, dan nomor telepon.'); return }
    onAdd({ ...form, name: form.name.trim(), phone: form.phone.trim() })
  }
  return <form className="resident-form bg-light border-top border-bottom p-3" onSubmit={submit}><div className="row g-2"><div className="col-md-4"><label className="form-label small">Nama penghuni<input className="form-control form-control-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Rina Maharani" /></label></div><div className="col-md-4"><label className="form-label small">Nomor kamar<select className="form-select form-select-sm" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}><option value="">Pilih kamar kosong</option>{availableRooms.map((room) => <option key={room.number} value={room.number}>{room.number} Â· {room.type}</option>)}</select></label></div><div className="col-md-4"><label className="form-label small">Nomor telepon<input className="form-control form-control-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" /></label></div></div>{error && <div className="text-danger small mb-2">{error}</div>}{!availableRooms.length && <div className="text-danger small mb-2">Semua kamar sudah terisi.</div>}<div className="d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancel}>Batal</button><button type="submit" className="btn btn-success btn-sm" disabled={!availableRooms.length}>Simpan penghuni â†’</button></div></form>
}

function ResidentList({ residents, rooms, onAdd }) {
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const filtered = residents.filter((resident) => `${resident.name} ${resident.room} ${resident.phone}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="card panel-card resident-panel"><div className="card-body p-0"><div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 p-3 p-lg-4"><div><h2 className="panel-title">Daftar Penghuni</h2><p className="text-secondary small mb-0">Informasi penghuni yang sedang aktif</p></div><div className="d-flex gap-2"><input className="form-control form-control-sm search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari penghuni..." aria-label="Cari penghuni"/><button className="btn btn-success btn-sm text-nowrap" onClick={() => setShowForm(!showForm)}>ï¼‹ Tambah Penghuni</button></div></div>
    {showForm && <ResidentForm rooms={rooms} onCancel={() => setShowForm(false)} onAdd={(resident) => { onAdd(resident); setShowForm(false) }} />}
    <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th className="ps-4">NAMA PENGHUNI</th><th>NOMOR KAMAR</th><th>NOMOR TELEPON</th><th>STATUS</th><th /></tr></thead><tbody>{filtered.map((resident) => <tr key={resident.id}><td className="ps-4"><div className="d-flex align-items-center gap-2"><div className={`avatar resident-avatar rounded-circle fw-bold d-grid avatar-${resident.id % 5}`}>{resident.name.split(' ').slice(0, 2).map((word) => word[0]).join('')}</div><div><strong className="d-block resident-name">{resident.name}</strong><small className="text-secondary">Bergabung Sep 2026</small></div></div></td><td><span className="badge text-bg-light border room-label">{resident.room}</span></td><td className="text-secondary">{resident.phone}</td><td><span className="badge rounded-pill text-bg-success-subtle text-success"><i className="status-dot bg-success me-1"/>Aktif</span></td><td><button className="btn btn-sm text-secondary" aria-label={`Aksi ${resident.name}`}>Â·Â·Â·</button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="text-center text-secondary small py-4">{residents.length ? 'Penghuni tidak ditemukan.' : 'Belum ada data penghuni.'}</div>}</div>
    <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top text-secondary small"><span>Menampilkan <strong>{filtered.length}</strong> dari <strong>{residents.length}</strong> penghuni</span><div className="btn-group btn-group-sm"><button className="btn btn-outline-secondary" disabled>â†</button><button className="btn btn-success">1</button><button className="btn btn-outline-secondary" disabled>â†’</button></div></div>
  </div></section>
}

function Dashboard() {
  const [rooms, setRooms] = useState(initialRooms)
  const [residents, setResidents] = useState(initialResidents)
  const occupied = useMemo(() => rooms.filter((room) => room.resident).length, [rooms])
  function addResident(data) {
    setResidents((current) => [...current, { ...data, id: Date.now() }])
    setRooms((current) => current.map((room) => room.number === data.room ? { ...room, resident: data.name } : room))
  }
  return <><div className="page-intro d-flex justify-content-between align-items-end mb-4"><div><div className="eyebrow text-uppercase fw-semibold">Minggu, 25 Oktober 2026 <span className="text-success">â€¢</span> Selamat pagi</div><h1 className="h2 fw-bold mb-1">Dashboard</h1><p className="text-secondary small mb-0">Berikut ringkasan aktivitas rumah kos Anda hari ini.</p></div><button className="btn btn-outline-secondary btn-sm bg-white">â–¦ã€€Oktober 2026ã€€âŒ„</button></div>
    <div className="row g-3 mb-3"><SummaryCard title="Total Kamar" value={rooms.length} note="Kamar terdaftar" icon="âŒ‚" tone="blue"/><SummaryCard title="Kamar Terisi" value={occupied} note="tingkat hunian" icon="â–¦" tone="green" trend="â†— 12%"/><SummaryCard title="Kamar Kosong" value={rooms.length - occupied} note="Siap untuk disewakan" icon="âŒ‚" tone="orange"/><SummaryCard title="Total Penghuni" value={residents.length} note="Penghuni aktif" icon="â™™" tone="purple"/></div>
    <div className="row g-3 mb-3"><div className="col-lg-6"><RoomStatus rooms={rooms}/></div><div className="col-lg-6"><IncomeCard/></div></div>
    <ResidentList residents={residents} rooms={rooms} onAdd={addResident}/>
  </>
}


export default Dashboard

