import { useEffect, useState } from 'react'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/penghuni`
const newResident = () => ({
  name: '',
  room: '',
  phone: '',
  moveInDate: new Date().toISOString().slice(0, 10),
  status: 'Active',
})

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(' ') : data?.message
    throw new Error(message || `Permintaan gagal (HTTP ${response.status}).`)
  }

  return data
}

export default function DataPenghuni() {
  const [residents, setResidents] = useState([])
  const [form, setForm] = useState(newResident)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadResidents() {
    setLoading(true)
    setError('')
    try {
      setResidents(await request())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResidents()
  }, [])

  function openCreateForm() {
    setEditingId(null)
    setForm(newResident())
    setError('')
    setShowForm(true)
  }

  function openEditForm(resident) {
    setEditingId(resident.id)
    setForm({ ...resident })
    setError('')
    setShowForm(true)
  }

  async function saveResident(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const saved = await request(editingId ? `/${editingId}` : '', {
        method: editingId ? 'PATCH' : 'POST',
        body: JSON.stringify(form),
      })
      setResidents((current) => editingId
        ? current.map((resident) => resident.id === saved.id ? saved : resident)
        : [...current, saved])
      setShowForm(false)
      setEditingId(null)
      setForm(newResident())
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteResident(resident) {
    if (!window.confirm(`Hapus data ${resident.name}?`)) return
    setError('')
    try {
      await request(`/${resident.id}`, { method: 'DELETE' })
      setResidents((current) => current.filter((item) => item.id !== resident.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Daftar Penghuni</h2>
            <p className="text-secondary mb-0">Informasi penghuni aktif rumah kos.</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge text-bg-primary">{residents.length} penghuni</span>
            <button className="btn btn-primary btn-sm" onClick={openCreateForm}>+ Tambah Penghuni</button>
          </div>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        {showForm && (
          <form className="card card-body bg-light mb-3" onSubmit={saveResident}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="resident-name">Nama</label>
                <input id="resident-name" className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} minLength={2} maxLength={80} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="resident-room">Nomor kamar</label>
                <input id="resident-room" className="form-control" value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value.toUpperCase() })} placeholder="Contoh: C02" pattern="[A-Z][0-9]{2}" required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="resident-phone">Nomor telepon</label>
                <input id="resident-phone" className="form-control" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} minLength={8} maxLength={20} required />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="resident-date">Tanggal masuk</label>
                <input id="resident-date" className="form-control" type="date" value={form.moveInDate} onChange={(event) => setForm({ ...form, moveInDate: event.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="resident-status">Status</label>
                <select id="resident-status" className="form-select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  <option value="Active">Aktif</option>
                  <option value="Leaving">Segera keluar</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn btn-success" disabled={saving}>{saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Simpan'}</button>
            </div>
          </form>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light"><tr><th>Nama</th><th>Nomor kamar</th><th>Nomor telepon</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan="5" className="text-center text-secondary py-4">Memuat data penghuni...</td></tr>}
              {!loading && residents.map((resident) => (
                <tr key={resident.id}>
                  <td className="fw-semibold">{resident.name}</td>
                  <td>{resident.room}</td>
                  <td>{resident.phone}</td>
                  <td><span className={`badge rounded-pill ${resident.status === 'Active' ? 'text-bg-success' : 'text-bg-warning'}`}>{resident.status === 'Active' ? 'Aktif' : 'Segera keluar'}</span></td>
                  <td><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" onClick={() => openEditForm(resident)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => deleteResident(resident)}>Hapus</button></div></td>
                </tr>
              ))}
              {!loading && residents.length === 0 && !error && <tr><td colSpan="5" className="text-center text-secondary py-4">Belum ada data penghuni.</td></tr>}
              {!loading && residents.length === 0 && error && <tr><td colSpan="5" className="text-center text-secondary py-4">Data penghuni belum dapat dimuat.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
