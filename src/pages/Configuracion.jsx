import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import UsuarioModal from '../components/UsuarioModal'
import { getUsuarios, crearUsuario } from '../service/configuracionService'
import '../css/configuracion.css'

export default function Configuracion() {
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('Todos')
  const [mostrarFiltro, setMostrarFiltro] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)

  useEffect(() => {
    getUsuarios().then(setUsuarios)
  }, [])

  const guardarUsuario = async (datos) => {
    const nuevo = await crearUsuario(datos)
    setUsuarios((anteriores) => [...anteriores, nuevo])
    setMostrarModal(false)
  }

  const texto = busqueda.trim().toLowerCase()

  const visibles = usuarios.filter((u) => {
    const coincide =
      u.nombre.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto) ||
      u.rol.toLowerCase().includes(texto)
    const cumpleRol = filtroRol === 'Todos' || u.rol === filtroRol
    return coincide && cumpleRol
  })

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
            onClick={() => setMostrarModal(true)}
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
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Último acceso</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{u.ultimoAcceso}</td>
                <td>
                  <span className={`badge ${u.estado.toLowerCase()}`}>{u.estado}</span>
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan="5" className="tabla-vacia">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {mostrarModal && (
        <UsuarioModal
          onCerrar={() => setMostrarModal(false)}
          onGuardar={guardarUsuario}
        />
      )}
    </div>
  )
}