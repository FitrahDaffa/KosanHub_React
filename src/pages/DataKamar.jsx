import { initialRooms } from '../data/data.js'

export default function DataKamar() {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="h5">Data kamar</h2>
        <p className="text-secondary">Daftar kamar kos yang tersedia.</p>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>Nomor</th><th>Tipe</th><th>Harga</th><th>Penghuni</th></tr>
            </thead>
            <tbody>
              {initialRooms.map((kamar) => (
                <tr key={kamar.number}>
                  <td>{kamar.number}</td>
                  <td>{kamar.type}</td>
                  <td>Rp {kamar.price.toLocaleString('id-ID')}</td>
                  <td>{kamar.resident || 'Kosong'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
