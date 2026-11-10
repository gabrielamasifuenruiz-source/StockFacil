import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useSesion } from '../context/SesionContext'
import '../css/layout.css'

export default function Layout({ children }) {
  const { usuario } = useSesion()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="layout">
      <Sidebar
        rol={usuario.rol}
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />
      {menuAbierto && (
        <div className="layout-fondo" onClick={() => setMenuAbierto(false)} />
      )}

      <main className="layout-main">
        <button
          type="button"
          className="layout-hamburguesa"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        {children}
      </main>
    </div>
  )
}