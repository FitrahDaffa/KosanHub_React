import { useEffect, useState } from 'react'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

export default function DataApi() {
  const [users, setUsers] = useState([])
  const [kataKunci, setKataKunci] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [simulasi, setSimulasi] = useState('')
  async function muatData() {
    setSimulasi('')
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Gagal memuat data')
      setUsers(await response.json())
    } catch {
      setError('Data gagal dimuat. Periksa koneksi internet dan coba lagi.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { muatData() }, [])
  const penghuni = users.map((user, index) => ({
    ...user,
    kamar: ['A01', 'A02', 'B01', 'B02', 'C01', 'C02'][index % 6],
    sewa: index % 3 === 2 ? 750000 : 500000,
    pembayaran: index % 4 === 0 ? 'Belum lunas' : 'Lunas',
  }))
  const hasil = penghuni.filter((user) => `${user.name} ${user.email} ${user.kamar} ${user.address.city}`.toLowerCase().includes(kataKunci.toLowerCase()))

  const modeLoading = simulasi === 'loading' || (!simulasi && loading)
  const modeError = simulasi === 'error' || (!simulasi && error)
  const modeSuccess = simulasi === 'success' || (!simulasi && !loading && !error)

  return <section className="card border-0 shadow-sm mt-4"><div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2 py-3"><div><h2 className="h5 mb-1">Penghuni Kos</h2><small className="text-secondary">Data dari API eksternal · {hasil.length} penghuni</small></div><div className="d-flex flex-wrap gap-2"><input className="form-control form-control-sm" placeholder="Cari nama atau kamar..." aria-label="Cari penghuni" value={kataKunci} onChange={(event) => setKataKunci(event.target.value)} /><button className="btn btn-outline-primary btn-sm text-nowrap" onClick={muatData} disabled={loading}>Muat ulang</button></div></div><div className="px-3 pt-3"><div className="d-flex align-items-center flex-wrap gap-2"><span className="small fw-semibold text-secondary me-1">Simulasi screenshot:</span><button className={`btn btn-sm ${simulasi==='loading'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setSimulasi('loading')}>Loading</button><button className={`btn btn-sm ${simulasi==='success'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setSimulasi('success')}>Success</button><button className={`btn btn-sm ${simulasi==='error'?'btn-danger':'btn-outline-danger'}`} onClick={()=>setSimulasi('error')}>Error</button><button className="btn btn-sm btn-outline-secondary" onClick={()=>setSimulasi('')}>Asli</button></div></div>{modeLoading && <div className="text-center p-4"><span className="spinner-border spinner-border-sm text-primary me-2" />Memuat data penghuni...</div>}{modeError && <div className="alert alert-danger m-3" role="alert">Data gagal dimuat. Periksa koneksi internet dan coba lagi. <button className="btn btn-sm btn-outline-danger ms-2" onClick={muatData}>Coba lagi</button></div>}{modeSuccess && <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th className="ps-4">Nama penghuni</th><th>Kontak email</th><th>Kamar</th><th>Sewa per bulan</th><th>Status pembayaran</th></tr></thead><tbody>{hasil.map((user) => <tr key={user.id}><td className="ps-4 fw-semibold">{user.name}</td><td>{user.email}</td><td><span className="badge text-bg-light border">{user.kamar}</span></td><td>Rp {user.sewa.toLocaleString('id-ID')}</td><td><span className={`badge rounded-pill ${user.pembayaran==='Lunas'?'text-bg-success':'text-bg-warning'}`}>{user.pembayaran}</span></td></tr>)}{hasil.length === 0 && <tr><td colSpan="5" className="text-center text-secondary py-4">Penghuni tidak ditemukan.</td></tr>}</tbody></table></div>}<div className="card-footer bg-white small text-secondary">Profil dasar dimuat dari JSONPlaceholder; nomor kamar, tarif, dan status pembayaran adalah data simulasi KosanHub.</div></section>
}
