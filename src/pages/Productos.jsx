import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ProductoModal from '../components/ProductoModal'
import { Paginacion, ThOrdenable } from '../components/TablaControles'
import { useTabla } from '../hooks/useTabla'
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  calcularEstado,
} from '../service/productosService'
import '../css/productos.css'

const formatoPrecio = (n) => `S/ ${n.toFixed(2).replace('.', ',')}`

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [modal, setModal] = useState({ abierto: false, producto: null })

  useEffect(() => {
    getProductos().then(setProductos)
  }, [])

  const texto = busqueda.trim().toLowerCase()

  const filtrados = productos.filter((p) => {
    const coincide =
      p.nombre.toLowerCase().includes(texto) ||
      p.sku.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto)
    const estado = calcularEstado(p.stock).texto
    return coincide && (filtroEstado === 'Todos' || estado === filtroEstado)
  })

  const tabla = useTabla(filtrados, 5)

  const cerrarModal = () => setModal({ abierto: false, producto: null })

  const guardar = async (datos) => {
    if (modal.producto) {
      const actualizado = await actualizarProducto(modal.producto.id, datos)
      setProductos((ant) => ant.map((p) => (p.id === actualizado.id ? actualizado : p)))
    } else {
      const nuevo = await crearProducto(datos)
      setProductos((ant) => [...ant, nuevo])
    }
    cerrarModal()
  }

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    await eliminarProducto(producto.id)
    setProductos((ant) => ant.filter((p) => p.id !== producto.id))
  }

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
            onClick={() => setModal({ abierto: true, producto: null })}
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
              <ThOrdenable campo="nombre" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>Producto</ThOrdenable>
              <ThOrdenable campo="sku" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>SKU</ThOrdenable>
              <ThOrdenable campo="categoria" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>Categoría</ThOrdenable>
              <ThOrdenable campo="precio" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>Precio</ThOrdenable>
              <ThOrdenable campo="stock" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>Stock</ThOrdenable>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tabla.visibles.map((p) => {
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
                  <td className="acciones">
                    <button
                      type="button"
                      className="btn-icono"
                      aria-label="Editar"
                      onClick={() => setModal({ abierto: true, producto: p })}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="btn-icono peligro"
                      aria-label="Eliminar"
                      onClick={() => eliminar(p)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              )
            })}
            {tabla.total === 0 && (
              <tr>
                <td colSpan="7" className="tabla-vacia">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Paginacion
          pagina={tabla.pagina}
          totalPaginas={tabla.totalPaginas}
          total={tabla.total}
          onCambiar={tabla.setPagina}
        />
      </section>

      {modal.abierto && (
        <ProductoModal
          producto={modal.producto}
          onCerrar={cerrarModal}
          onGuardar={guardar}
        />
      )}
    </div>
  )
}