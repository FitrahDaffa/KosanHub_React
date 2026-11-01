const laporan = [
  { id: 'LAP-001', judul: 'Rekap pembayaran Oktober', kategori: 'Keuangan', tanggal: '10 Oktober 2026', status: 'Selesai' },
  { id: 'LAP-002', judul: 'Kondisi dan ketersediaan kamar', kategori: 'Operasional', tanggal: '12 Oktober 2026', status: 'Selesai' },
  { id: 'LAP-003', judul: 'Daftar penghuni aktif', kategori: 'Penghuni', tanggal: '15 Oktober 2026', status: 'Diproses' },
]

export default function Laporan() {
  return <><div className="row g-3 mb-3">{[['Total laporan', laporan.length], ['Selesai', laporan.filter(item=>item.status==='Selesai').length], ['Diproses', laporan.filter(item=>item.status==='Diproses').length]].map(([label,value])=><div className="col-md-4" key={label}><div className="card border-0 shadow-sm"><div className="card-body"><div className="small text-secondary">{label}</div><div className="h3 fw-bold mt-2 mb-0">{value}</div></div></div></div>)}</div><section className="card border-0 shadow-sm"><div className="card-body p-4"><h2 className="h5 fw-bold">Riwayat Laporan</h2><p className="text-secondary">Ringkasan laporan pengelolaan rumah kos.</p><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>ID</th><th>Nama laporan</th><th>Kategori</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>{laporan.map(item=><tr key={item.id}><td>{item.id}</td><td className="fw-semibold">{item.judul}</td><td>{item.kategori}</td><td>{item.tanggal}</td><td><span className={`badge rounded-pill ${item.status==='Selesai'?'text-bg-success':'text-bg-warning'}`}>{item.status}</span></td></tr>)}</tbody></table></div></div></section></>
}
