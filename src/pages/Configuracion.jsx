import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import UsuarioModal from '../components/UsuarioModal'
import { Paginacion, ThOrdenable } from '../components/TablaControles'
import { useTabla } from '../hooks/useTabla'
import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from '../service/configuracionService'
import '../css/configuracion.css'

export default function Configuracion() {
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('Todos')
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [modal, setModal] = useState({ abierto: false, usuario: null })

  useEffect(() => {
    getUsuarios().then(setUsuarios)
  }, [])

  const texto = busqueda.trim().toLowerCase()

  const filtrados = usuarios.filter((u) => {
    const coincide =
      u.nombre.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto) ||
      u.rol.toLowerCase().includes(texto)
    return coincide && (filtroRol === 'Todos' || u.rol === filtroRol)
  })

  const tabla = useTabla(filtrados, 5)

  const cerrarModal = () => setModal({ abierto: false, usuario: null })

  const guardar = async (datos) => {
    if (modal.usuario) {
      const actualizado = await actualizarUsuario(modal.usuario.id, datos)
      setUsuarios((ant) => ant.map((u) => (u.id === actualizado.id ? actualizado : u)))
    } else {
      const nuevo = await crearUsuario(datos)
      setUsuarios((ant) => [...ant, nuevo])
    }
    cerrarModal()
  }

  const eliminar = async (usuario) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre}?`)) return
    try {
      await eliminarUsuario(usuario.id)
      setUsuarios((ant) => ant.filter((u) => u.id !== usuario.id))
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div className="configuracion">
      <PageHeader
        titulo="Configuración"
        subtitulo="Personalizá tu negocio y los permisos de tu equipo"
      />

      <section className="card configuracion-card">
        <div className="productos-top">
          <h2>Usuarios y permisos</h2>
          <button
            type="button"
            className="btn-primario"
            onClick={() => setModal({ abierto: true, usuario: null })}
          >
            + Nuevo usuario
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
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
            >
              <option>Todos</option>
              <option>Administrador</option>
              <option>Almacén</option>
              <option>Ventas</option>
            </select>
          )}
        </div>

        <table className="tabla">
          <thead>
            <tr>
              <ThOrdenable campo="nombre" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>Usuario</ThOrdenable>
              <ThOrdenable campo="correo" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>Correo</ThOrdenable>
              <ThOrdenable campo="rol" orden={tabla.orden} onOrdenar={tabla.ordenarPor}>Rol</ThOrdenable>
              <th>Último acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tabla.visibles.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{u.ultimoAcceso}</td>
                <td>
                  <span className={`badge ${u.estado.toLowerCase()}`}>{u.estado}</span>
                </td>
                <td className="acciones">
                  <button
                    type="button"
                    className="btn-icono"
                    aria-label="Editar"
                    onClick={() => setModal({ abierto: true, usuario: u })}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="btn-icono peligro"
                    aria-label="Eliminar"
                    onClick={() => eliminar(u)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
            {tabla.total === 0 && (
              <tr>
                <td colSpan="6" className="tabla-vacia">
                  No se encontraron usuarios.
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
        <UsuarioModal
          usuario={modal.usuario}
          onCerrar={cerrarModal}
          onGuardar={guardar}
        />
      )}
    </div>
  )
}