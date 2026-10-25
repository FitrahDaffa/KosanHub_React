import { useState } from 'react'

export default function App() {
  const [kamar, setKamar] = useState([])
  const [namaKamar, setNamaKamar] = useState('')

  function tambahKamar(event) {
    event.preventDefault()

    if (namaKamar.trim() === '') return

    setKamar([...kamar, { id: Date.now(), nama: namaKamar.trim() }])
    setNamaKamar('')
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="card-title h3 mb-4">Daftar Kamar Kos</h1>

              <form onSubmit={tambahKamar}>
                <label className="form-label" htmlFor="nama-kamar">Nama kamar</label>
                <div className="input-group mb-4">
                  <input
                    className="form-control"
                    id="nama-kamar"
                    type="text"
                    placeholder="Contoh: Kamar A01"
                    value={namaKamar}
                    onChange={(event) => setNamaKamar(event.target.value)}
                  />
                  <button className="btn btn-success" type="submit">Tambah</button>
                </div>
              </form>

              {kamar.length === 0 ? (
                <p className="alert alert-secondary mb-0">Belum ada data kamar.</p>
              ) : (
                <ul className="list-group">
                  {kamar.map((item) => (
                    <li className="list-group-item" key={item.id}>
                      {item.nama}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
