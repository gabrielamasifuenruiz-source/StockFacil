import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import MovimientoModal from '../components/MovimientoModal'
import { getMovimientos, crearMovimiento } from '../service/inventarioService'
import '../css/inventario.css'

const formatoCantidad = (n) => (n > 0 ? `+${n}` : `${n}`)

export default function Inventario() {
  const [movimientos, setMovimientos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    getMovimientos().then(setMovimientos)
  }, [])

  const guardarMovimiento = async (datos) => {
    const nuevo = await crearMovimiento(datos)
    setMovimientos((anteriores) => [nuevo, ...anteriores])
    setMostrarModal(false)
  }

  const texto = busqueda.trim().toLowerCase()

  const visibles = movimientos.filter((m) => {
    const coincide =
      m.producto.toLowerCase().includes(texto) ||
      m.usuario.toLowerCase().includes(texto) ||
      m.referencia.toLowerCase().includes(texto)
    const cumpleTipo = filtroTipo === 'Todos' || m.tipo === filtroTipo
    return coincide && cumpleTipo
  })

  return (
    <div className="inventario">
      <PageHeader
        titulo="Inventario"
        subtitulo="Consultá existencias, movimientos y alertas de stock"
      />

      <section className="card inventario-card">
        <div className="productos-top">
          <h2>Movimientos de inventario</h2>
          <button
            type="button"
            className="btn-primario"
            onClick={() => setMostrarModal(true)}
          >
            + Registrar movimiento
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
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option>Todos</option>
              <option>Entrada</option>
              <option>Salida</option>
              <option>Ajuste</option>
            </select>
          )}
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Referencia</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((m) => (
              <tr key={m.id}>
                <td>{m.fecha}</td>
                <td>{m.producto}</td>
                <td>
                  <span className={`badge ${m.tipo.toLowerCase()}`}>{m.tipo}</span>
                </td>
                <td>{formatoCantidad(m.cantidad)}</td>
                <td>{m.usuario}</td>
                <td>{m.referencia}</td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan="6" className="tabla-vacia">
                  No se encontraron movimientos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {mostrarModal && (
        <MovimientoModal
          onCerrar={() => setMostrarModal(false)}
          onGuardar={guardarMovimiento}
        />
      )}
    </div>
  )
}