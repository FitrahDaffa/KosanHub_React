import { initialResidents } from '../data/data.js'

export default function DataPenghuni() {
  return <section className="card border-0 shadow-sm"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-center mb-3"><div><h2 className="h5 fw-bold mb-1">Daftar Penghuni</h2><p className="text-secondary mb-0">Informasi penghuni aktif rumah kos.</p></div><span className="badge text-bg-primary">{initialResidents.length} penghuni</span></div><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Nama</th><th>Nomor kamar</th><th>Nomor telepon</th><th>Status</th></tr></thead><tbody>{initialResidents.map(p=><tr key={p.id}><td className="fw-semibold">{p.name}</td><td>{p.room}</td><td>{p.phone}</td><td><span className="badge rounded-pill text-bg-success">Aktif</span></td></tr>)}</tbody></table></div></div></section>
}
