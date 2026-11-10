import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ProductoModal from '../components/ProductoModal'
import { getProductos, crearProducto } from '../service/productosService'
import '../css/productos.css'

function calcularEstado(stock) {
  if (stock === 0) return { texto: 'Agotado', clase: 'agotado' }
  if (stock < 10) return { texto: 'Stock bajo', clase: 'bajo' }
  return { texto: 'Disponible', clase: 'disponible' }
}

const formatoPrecio = (n) => `S/ ${n.toFixed(2).replace('.', ',')}`

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    getProductos().then(setProductos)
  }, [])

  const guardarProducto = async (datos) => {
    const nuevo = await crearProducto(datos)
    setProductos((anteriores) => [...anteriores, nuevo])
    setMostrarModal(false)
  }

  const texto = busqueda.trim().toLowerCase()

  const visibles = productos.filter((p) => {
    const coincide =
      p.nombre.toLowerCase().includes(texto) ||
      p.sku.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto)
    const estado = calcularEstado(p.stock).texto
    const cumpleEstado = filtroEstado === 'Todos' || estado === filtroEstado
    return coincide && cumpleEstado
  })

  return (
    <div className="productos">
      <PageHeader
        titulo="Productos"
        subtitulo="Administrá tu catálogo, precios y niveles de stock"
      />

      <section className="card productos-card">
        <div className="productos-top">
          <h2>Listado de productos</h2>
          <button
            type="button"
            className="btn-primario"
            onClick={() => setMostrarModal(true)}
          >
            + Nuevo producto
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
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option>Todos</option>
              <option>Disponible</option>
              <option>Stock bajo</option>
              <option>Agotado</option>
            </select>
          )}
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => {
              const estado = calcularEstado(p.stock)
              return (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.sku}</td>
                  <td>{p.categoria}</td>
                  <td>{formatoPrecio(p.precio)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge ${estado.clase}`}>{estado.texto}</span>
                  </td>
                </tr>
              )
            })}
            {visibles.length === 0 && (
              <tr>
                <td colSpan="6" className="tabla-vacia">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {mostrarModal && (
        <ProductoModal
          onCerrar={() => setMostrarModal(false)}
          onGuardar={guardarProducto}
        />
      )}
    </div>
  )
}