const pembayaran = [
  { id: 'BYR-001', nama: 'Andi Saputra', kamar: 'A01', jumlah: 500000, tanggal: '1 Oktober 2026', status: 'Lunas' },
  { id: 'BYR-002', nama: 'Budi Santoso', kamar: 'A02', jumlah: 500000, tanggal: '2 Oktober 2026', status: 'Lunas' },
  { id: 'BYR-003', nama: 'Citra Amelia', kamar: 'B01', jumlah: 750000, tanggal: '3 Oktober 2026', status: 'Menunggu' },
  { id: 'BYR-004', nama: 'Dewi Lestari', kamar: 'B02', jumlah: 750000, tanggal: '4 Oktober 2026', status: 'Lunas' },
  { id: 'BYR-005', nama: 'Eko Pratama', kamar: 'C01', jumlah: 500000, tanggal: '5 Oktober 2026', status: 'Tertunda' },
]

export default function Pembayaran() {
  const lunas = pembayaran.filter(p => p.status === 'Lunas').reduce((total, p) => total + p.jumlah, 0)
  return <><div className="row g-3 mb-3"><div className="col-md-6"><div className="card border-0 shadow-sm"><div className="card-body"><div className="small text-secondary">Pendapatan tercatat</div><div className="h3 fw-bold text-success mt-2">Rp {lunas.toLocaleString('id-ID')}</div></div></div></div><div className="col-md-6"><div className="card border-0 shadow-sm"><div className="card-body"><div className="small text-secondary">Pembayaran bulan ini</div><div className="h3 fw-bold mt-2">{pembayaran.length} transaksi</div></div></div></div></div><section className="card border-0 shadow-sm"><div className="card-body p-4"><h2 className="h5 fw-bold">Riwayat Pembayaran</h2><p className="text-secondary">Pembayaran sewa bulan Oktober 2026.</p><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>ID</th><th>Penghuni</th><th>Kamar</th><th>Jumlah</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>{pembayaran.map(p=><tr key={p.id}><td>{p.id}</td><td className="fw-semibold">{p.nama}</td><td>{p.kamar}</td><td>Rp {p.jumlah.toLocaleString('id-ID')}</td><td>{p.tanggal}</td><td><span className={`badge rounded-pill ${p.status==='Lunas'?'text-bg-success':p.status==='Menunggu'?'text-bg-warning':'text-bg-secondary'}`}>{p.status}</span></td></tr>)}</tbody></table></div></div></section></>
}
