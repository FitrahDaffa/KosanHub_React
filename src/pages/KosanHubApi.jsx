import { useCallback, useEffect, useMemo, useState } from 'react'

const API = 'http://localhost:3001/api'
const sections = [
  { id: 'rooms', label: 'Data Kamar', singular: 'Kamar' },
  { id: 'residents', label: 'Data Penghuni', singular: 'Penghuni' },
  { id: 'payments', label: 'Pembayaran', singular: 'Pembayaran' },
]
const emptyForms = {
  rooms: { number: '', type: 'Standar', price: '' },
  residents: { name: '', phone: '', roomId: '' },
  payments: { code: '', amount: '', paidAt: new Date().toISOString().slice(0, 10), status: 'MENUNGGU', residentId: '' },
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    throw new Error(message || `Permintaan gagal (${response.status})`)
  }
  return body
}

function rupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0)
}

function dateLabel(value) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value))
}

export default function KosanHubApi() {
  const [active, setActive] = useState('rooms')
  const [data, setData] = useState({ rooms: [], residents: [], payments: [], stats: null })
  const [forms, setForms] = useState(emptyForms)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [rooms, residents, payments, stats] = await Promise.all([
        request('/rooms'), request('/residents'), request('/payments'), request('/stats'),
      ])
      setData({ rooms, residents, payments, stats })
    } catch (loadError) {
      setError(`${loadError.message}. Pastikan API berjalan di port 3000 dan database tersambung.`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const current = sections.find((section) => section.id === active)
  const visibleRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('id-ID')
    if (!query) return data[active]
    return data[active].filter((row) => JSON.stringify(row).toLocaleLowerCase('id-ID').includes(query))
  }, [active, data, search])

  function changeSection(id) {
    setActive(id)
    setSearch('')
    setEditing(null)
    setForms((currentForms) => ({ ...currentForms, [id]: { ...emptyForms[id] } }))
    setNotice('')
  }

  function startEdit(row) {
    setEditing(row.id)
    if (active === 'rooms') setForms((f) => ({ ...f, rooms: { number: row.number, type: row.type, price: String(row.price) } }))
    if (active === 'residents') setForms((f) => ({ ...f, residents: { name: row.name, phone: row.phone, roomId: row.roomId || '' } }))
    if (active === 'payments') setForms((f) => ({ ...f, payments: {
      code: row.code, amount: String(row.amount), paidAt: new Date(row.paidAt).toISOString().slice(0, 10),
      status: row.status, residentId: row.residentId,
    } }))
    setNotice('')
  }

  function resetForm() {
    setEditing(null)
    setForms((f) => ({ ...f, [active]: { ...emptyForms[active] } }))
  }

  async function submit(event) {
    event.preventDefault()
    const form = forms[active]
    let payload
    if (active === 'rooms') payload = { ...form, price: Number(form.price) }
    if (active === 'residents') {
      payload = { name: form.name, phone: form.phone }
      if (form.roomId) payload.roomId = form.roomId
      else if (editing) payload.roomId = null
    }
    if (active === 'payments') payload = {
      ...form, amount: Number(form.amount), paidAt: new Date(`${form.paidAt}T00:00:00.000Z`).toISOString(),
    }

    setSaving(true)
    setError('')
    setNotice('')
    try {
      await request(`/${active}${editing ? `/${editing}` : ''}`, { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(payload) })
      setNotice(editing ? 'Perubahan berhasil disimpan.' : `${current.singular} berhasil ditambahkan.`)
      resetForm()
      await loadData()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(row) {
    const label = active === 'rooms' ? row.number : active === 'residents' ? row.name : row.code
    if (!window.confirm(`Hapus ${label}?`)) return
    setError('')
    setNotice('')
    try {
      await request(`/${active}/${row.id}`, { method: 'DELETE' })
      setNotice(`${current.singular} berhasil dihapus.`)
      if (editing === row.id) resetForm()
      await loadData()
    } catch (removeError) {
      setError(removeError.message)
    }
  }

  function input(name, label, type = 'text', required = true) {
    return <div className="col-md-4" key={name}><label className="form-label small mb-1">{label}</label><input
      className="form-control form-control-sm" type={type} value={forms[active][name]} required={required} min={type === 'number' ? '0' : undefined}
      onChange={(event) => setForms((f) => ({ ...f, [active]: { ...f[active], [name]: event.target.value } }))}
    /></div>
  }

  function select(name, label, options, placeholder) {
    return <div className="col-md-4" key={name}><label className="form-label small mb-1">{label}</label><select
      className="form-select form-select-sm" value={forms[active][name]} required onChange={(event) => setForms((f) => ({ ...f, [active]: { ...f[active], [name]: event.target.value } }))}
    ><option value="">{placeholder}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
  }

  function formFields() {
    if (active === 'rooms') return <>{input('number', 'Nomor kamar')}{select('type', 'Tipe kamar', [{ value: 'Standar', label: 'Standar' }, { value: 'Premium', label: 'Premium' }], 'Pilih tipe')}{input('price', 'Harga per bulan (Rp)', 'number')}</>
    if (active === 'residents') {
      const available = data.rooms.filter((room) => !room.resident || room.resident.id === editing)
      return <>{input('name', 'Nama penghuni')}{input('phone', 'Nomor telepon', 'tel')}{select('roomId', 'Kamar (opsional)', available.map((room) => ({ value: room.id, label: `${room.number} · ${room.type}` })), 'Tanpa kamar')}</>
    }
    return <>{input('code', 'Kode pembayaran')}{input('amount', 'Jumlah (Rp)', 'number')}{input('paidAt', 'Tanggal', 'date')}
      {select('status', 'Status', [{ value: 'LUNAS', label: 'Lunas' }, { value: 'MENUNGGU', label: 'Menunggu' }, { value: 'TERTUNDA', label: 'Tertunda' }], 'Pilih status')}
      {select('residentId', 'Penghuni', data.residents.map((resident) => ({ value: resident.id, label: resident.name })), 'Pilih penghuni')}</>
  }

  function actions(row) {
    return <td className="text-nowrap"><button className="btn btn-link btn-sm p-0 me-2 text-decoration-none" type="button" onClick={() => startEdit(row)}>Ubah</button>
      <button className="btn btn-link btn-sm p-0 text-danger text-decoration-none" type="button" onClick={() => remove(row)}>Hapus</button></td>
  }

  function tableRows() {
    if (active === 'rooms') return visibleRows.map((room) => <tr key={room.id}><td className="fw-semibold">{room.number}</td><td>{room.type}</td><td>{rupiah(room.price)}</td><td>{room.resident?.name || 'Kosong'}</td>{actions(room)}</tr>)
    if (active === 'residents') return visibleRows.map((resident) => <tr key={resident.id}><td className="fw-semibold">{resident.name}</td><td>{resident.room?.number || 'Belum ada kamar'}</td><td>{resident.phone}</td>{actions(resident)}</tr>)
    return visibleRows.map((payment) => <tr key={payment.id}><td className="fw-semibold">{payment.code}</td><td>{payment.resident.name}</td><td>{payment.resident.room?.number || '—'}</td><td>{rupiah(payment.amount)}</td><td>{dateLabel(payment.paidAt)}</td><td><span className={`badge ${payment.status === 'LUNAS' ? 'text-bg-success' : payment.status === 'MENUNGGU' ? 'text-bg-warning' : 'text-bg-secondary'}`}>{payment.status}</span></td>{actions(payment)}</tr>)
  }

  const columns = active === 'rooms' ? ['Nomor kamar', 'Tipe', 'Harga sewa', 'Penghuni', 'Aksi'] : active === 'residents' ? ['Nama penghuni', 'Kamar', 'Nomor telepon', 'Aksi'] : ['Kode', 'Penghuni', 'Kamar', 'Jumlah', 'Tanggal', 'Status', 'Aksi']
  const tableContent = loading
    ? <tr><td colSpan={columns.length} className="text-center text-secondary py-4">Memuat data...</td></tr>
    : visibleRows.length
      ? tableRows()
      : <tr><td colSpan={columns.length} className="text-center text-secondary py-4">Data tidak ditemukan.</td></tr>

  return <div className="min-vh-100 bg-light">
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary"><div className="container-fluid px-4">
      <a className="navbar-brand fw-bold" href="/">KosanHub</a>
      <span className="navbar-text text-white-50 small">Data dari REST API · PostgreSQL · Prisma</span>
    </div></nav>
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div><h1 className="h2 fw-bold mb-1">Dashboard KosanHub</h1><p className="text-secondary mb-0">Kelola data yang tersimpan di PostgreSQL.</p></div>
        <span className={`badge rounded-pill ${error && !data.stats ? 'text-bg-danger' : 'text-bg-success'}`}>{error && !data.stats ? 'API terputus' : 'API terhubung'}</span>
      </div>

      <div className="row g-3 mb-3">
        {[
          ['Total kamar', data.stats?.rooms ?? '—', 'Unit terdaftar'],
          ['Penghuni aktif', data.stats?.residents ?? '—', 'Penghuni terdaftar'],
          ['Pembayaran', data.stats?.payments ?? '—', 'Transaksi tercatat'],
          ['Pendapatan lunas', rupiah(data.stats?.paidAmount), 'Total pembayaran lunas'],
        ].map(([label, value, note]) => <div className="col-sm-6 col-xl-3" key={label}><section className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">{label}</div><div className="h4 fw-bold mt-2 mb-1">{value}</div><div className="small text-secondary">{note}</div></div></section></div>)}
      </div>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div><h2 className="h5 fw-bold mb-1">Manajemen data</h2><p className="text-secondary small mb-0">Data tersimpan langsung melalui REST API.</p></div>
            <div className="d-flex gap-2"><input className="form-control form-control-sm" style={{ maxWidth: 210 }} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari data..." aria-label="Cari data" />
              <button className="btn btn-outline-primary btn-sm text-nowrap" type="button" onClick={loadData} disabled={loading}>Muat ulang</button></div>
          </div>

          <ul className="nav nav-tabs mb-3" role="tablist">{sections.map((section) => <li className="nav-item" key={section.id}><button className={`nav-link ${active === section.id ? 'active' : ''}`} type="button" role="tab" aria-selected={active === section.id} onClick={() => changeSection(section.id)}>{section.label} <span className="badge text-bg-light ms-1">{data[section.id].length}</span></button></li>)}</ul>

          <form className="border rounded bg-light p-3 mb-4" onSubmit={submit}>
            <div className="d-flex justify-content-between align-items-center mb-3"><div><h3 className="h6 fw-bold mb-1">{editing ? `Ubah ${current.singular}` : `Tambah ${current.singular}`}</h3><p className="small text-secondary mb-0">Isi informasi berikut.</p></div>{editing && <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetForm}>Batal</button>}</div>
            <div className="row g-2">{formFields()}</div>
            <button className="btn btn-primary btn-sm mt-3" type="submit" disabled={saving}>{saving ? 'Menyimpan...' : editing ? 'Simpan perubahan' : `Tambah ${current.singular.toLowerCase()}`}</button>
          </form>

          {error && <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert"><span>{error}</span><button className="btn btn-sm btn-outline-danger ms-2" type="button" onClick={loadData}>Coba lagi</button></div>}
          {notice && <div className="alert alert-success alert-dismissible" role="status">{notice}<button type="button" className="btn-close" aria-label="Tutup" onClick={() => setNotice('')} /></div>}
          <div className="d-flex justify-content-between align-items-center mb-2"><h3 className="h6 fw-bold mb-0">Daftar {current.label.toLowerCase()}</h3><span className="small text-secondary">{visibleRows.length} data</span></div>
          <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>{tableContent}</tbody>
          </table></div>
        </div>
      </section>
      <footer className="d-flex justify-content-between small text-secondary py-3"><span>© 2026 KosanHub</span><span>REST API · PostgreSQL · Prisma ORM</span></footer>
    </main>
  </div>
}
