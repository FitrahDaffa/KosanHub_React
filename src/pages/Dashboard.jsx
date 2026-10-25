import { initialRooms, initialResidents } from '../data/data.js'

export default function Dashboard() {
  const kamarTerisi = initialRooms.filter((kamar) => kamar.resident).length

  return (
    <>
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card"><div className="card-body">
            <p className="text-secondary mb-1">Total kamar</p>
            <h2 className="h3">{initialRooms.length}</h2>
          </div></div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card"><div className="card-body">
            <p className="text-secondary mb-1">Kamar terisi</p>
            <h2 className="h3">{kamarTerisi}</h2>
          </div></div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card"><div className="card-body">
            <p className="text-secondary mb-1">Kamar kosong</p>
            <h2 className="h3">{initialRooms.length - kamarTerisi}</h2>
          </div></div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card"><div className="card-body">
            <p className="text-secondary mb-1">Penghuni aktif</p>
            <h2 className="h3">{initialResidents.length}</h2>
          </div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="h5">Daftar kamar</h2>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Kamar</th><th>Tipe</th><th>Harga per bulan</th>
                  <th>Penghuni</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {initialRooms.map((kamar) => (
                  <tr key={kamar.number}>
                    <td>{kamar.number}</td>
                    <td>{kamar.type}</td>
                    <td>Rp {kamar.price.toLocaleString('id-ID')}</td>
                    <td>{kamar.resident || 'Belum ada'}</td>
                    <td>{kamar.resident ? 'Terisi' : 'Kosong'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
