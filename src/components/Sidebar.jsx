import { NavLink } from 'react-router-dom'
import { RUTAS, PERMISOS } from '../config/rutas'

export default function Sidebar({ rol, abierto, onCerrar }) {
  const permitidas = PERMISOS[rol] ?? []

  return (
    <aside className={`sidebar ${abierto ? 'abierto' : ''}`}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-sf">SF</span>
        <span className="sidebar-logo-name">StockFácil</span>
      </div>

      <nav className="sidebar-nav">
        {RUTAS.filter((r) => permitidas.includes(r.nombre)).map((item) => (
          <NavLink
            key={item.ruta}
            to={item.ruta}
            onClick={onCerrar}
            className={({ isActive }) => `sidebar-item ${isActive ? 'activo' : ''}`}
          >
            <span className="sidebar-icono">{item.icono}</span>
            {item.nombre}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-plan">
        <small>Plan de equipo</small>
        <strong>Gestión de inventario</strong>
      </div>
    </aside>
  )
}