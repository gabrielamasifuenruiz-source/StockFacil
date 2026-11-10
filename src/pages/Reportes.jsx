import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { getReporte } from '../service/reportesService'
import '../css/reportes.css'

export default function Reportes() {
  const [reporte, setReporte] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTono, setFiltroTono] = useState('Todos')
  const [mostrarFiltro, setMostrarFiltro] = useState(false)

  useEffect(() => {
    getReporte().then(setReporte)
  }, [])

  if (!reporte) return <p>Cargando...</p>

  const texto = busqueda.trim().toLowerCase()

  const visibles = reporte.indicadores.filter((i) => {
    const coincide = i.nombre.toLowerCase().includes(texto)
    const cumpleTono =
      filtroTono === 'Todos' ||
      (filtroTono === 'Favorable' && i.tono === 'positivo') ||
      (filtroTono === 'A revisar' && i.tono === 'alerta')
    return coincide && cumpleTono
  })

  const exportarCSV = () => {
    const filas = [
      ['Indicador', 'Período actual', 'Período anterior', 'Variación'],
      ...visibles.map((i) => [i.nombre, i.actual, i.anterior, i.variacion]),
    ]
    const csv = filas.map((f) => f.map((c) => `"${c}"`).join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = `reporte-${reporte.periodo.replace(' ', '-').toLowerCase()}.csv`
    enlace.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="reportes">
      <PageHeader
        titulo="Reportes"
        subtitulo="Convertí los datos de tu negocio en decisiones"
      />

      <section className="card reportes-card">
        <div className="productos-top">
          <h2>Resumen del período · {reporte.periodo}</h2>
          <button type="button" className="btn-primario" onClick={exportarCSV}>
            Exportar reporte
          </button>
        </div>

        <div className="productos-barra">
          <input
            type="text"
            className="productos-buscar"
            placeholder="⌕ Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            type="button"
            className="btn-filtrar"
            onClick={() => setMostrarFiltro(!mostrarFiltro)}
          >
            Filtrar
          </button>

          {mostrarFiltro && (
            <select
              className="productos-select"
              value={filtroTono}
              onChange={(e) => setFiltroTono(e.target.value)}
            >
              <option>Todos</option>
              <option>Favorable</option>
              <option>A revisar</option>
            </select>
          )}
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Período actual</th>
              <th>Período anterior</th>
              <th>Variación</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((i) => (
              <tr key={i.id}>
                <td>{i.nombre}</td>
                <td>{i.actual}</td>
                <td>{i.anterior}</td>
                <td>
                  <span className={`badge ${i.tono}`}>{i.variacion}</span>
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan="4" className="tabla-vacia">
                  No se encontraron indicadores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}