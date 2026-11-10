import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './pages/Layout'
import Resumen from './pages/Resumen'
import Productos from './pages/Productos'
import Inventario from './pages/Inventario'
import Categorias from './pages/Categorias'
import Proveedores from './pages/Proveedores'
import Ventas from './pages/Ventas'
import Compras from './pages/Compras'
import Reportes from './pages/Reportes'
import Configuracion from './pages/Configuracion'
import { SesionContext } from './context/SesionContext'
import { RUTAS, PERMISOS } from './config/rutas'
import { leerSesion, guardarSesion, borrarSesion } from './service/authService'

const PAGINAS = {
  '/resumen': Resumen,
  '/productos': Productos,
  '/inventario': Inventario,
  '/categorias': Categorias,
  '/proveedores': Proveedores,
  '/ventas': Ventas,
  '/compras': Compras,
  '/reportes': Reportes,
  '/configuracion': Configuracion,
}

function App() {
  const [usuario, setUsuario] = useState(leerSesion)

  const iniciarSesion = (u) => {
    guardarSesion(u)
    setUsuario(u)
  }

  const cerrarSesion = () => {
    borrarSesion()
    setUsuario(null)
  }

  if (!usuario) {
    return <Login onLogin={iniciarSesion} />
  }

  const permitidas = RUTAS.filter((r) => PERMISOS[usuario.rol]?.includes(r.nombre))

  return (
    <SesionContext.Provider value={{ usuario, cerrarSesion }}>
      <Layout>
        <Routes>
          {permitidas.map((r) => {
            const Pagina = PAGINAS[r.ruta]
            return <Route key={r.ruta} path={r.ruta} element={<Pagina />} />
          })}
          <Route path="*" element={<Navigate to={permitidas[0]?.ruta ?? '/resumen'} replace />} />
        </Routes>
      </Layout>
    </SesionContext.Provider>
  )
}

export default App