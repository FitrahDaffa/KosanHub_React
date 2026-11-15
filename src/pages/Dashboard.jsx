import { useState } from 'react'
import DataApi from './DataApi.jsx'

export default function Dashboard() {
  const [kamar, setKamar] = useState([])
  const [namaKamar, setNamaKamar] = useState('')
  function tambahKamar(event) {
    event.preventDefault()
    const nama = namaKamar.trim()
    if (!nama) return
    setKamar((current) => [...current, { id: Date.now(), nama }])
    setNamaKamar('')
  }

  return <>
    <div className="row g-3 my-3">{[['Total kamar', kamar.length], ['Kamar tersedia', kamar.length], ['Status data', kamar.length ? 'Sudah ada data' : 'Belum ada data']].map(([label, value]) => <div className="col-md-4" key={label}><div className="card border-0 shadow-sm h-100"><div className="card-body p-4"><div className="text-secondary small">{label}</div><div className="h3 fw-bold mt-2 mb-0">{value}</div></div></div></div>)}</div>
    <section className="card border-0 shadow-sm"><div className="card-body p-4"><div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><div><h2 className="h4 fw-bold mb-1">Daftar kamar</h2><p className="text-secondary mb-0">Tambahkan kamar baru ke daftar kos.</p></div><span className="badge rounded-pill text-bg-light border">{kamar.length} item</span></div><form onSubmit={tambahKamar}><label className="form-label fw-semibold" htmlFor="nama-kamar">Nama kamar</label><div className="input-group input-group-lg mb-4"><input className="form-control" id="nama-kamar" placeholder="Contoh: Kamar A01" value={namaKamar} onChange={(event) => setNamaKamar(event.target.value)} /><button className="btn btn-primary px-4">Tambah</button></div></form>{kamar.length === 0 ? <div className="alert alert-secondary mb-0">Belum ada data kamar. Isi nama kamar di atas, lalu tekan Tambah.</div> : <ul className="list-group">{kamar.map((item, index) => <li className="list-group-item d-flex align-items-center gap-3" key={item.id}><span className="badge text-bg-primary">{String(index + 1).padStart(2, '0')}</span><span className="fw-semibold">{item.nama}</span><span className="badge rounded-pill text-bg-success ms-auto">Tersedia</span></li>)}</ul>}</div></section>
    <DataApi />
  </>
}
