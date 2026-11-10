import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { getProductos, calcularEstado } from '../service/productosService'

export default function PageHeader({ titulo, subtitulo }) {
  const { usuario, cerrarSesion } = useSesion()
  const navigate = useNavigate()
  const [alertas, setAlertas] = useState([])
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    getProductos().then((lista) =>
      setAlertas(lista.filter((p) => calcularEstado(p.stock).clase !== 'disponible'))
    )
  }, [])

  return (
    <header className="page-header">
      <div>
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>

      <div className="page-header-acciones">
        <div className="alertas">
          <button
            type="button"
            className="alertas-btn"
            onClick={() => setAbierto(!abierto)}
            aria-label="Alertas de stock"
          >
            🔔
            {alertas.length > 0 && (
              <span className="alertas-contador">{alertas.length}</span>
            )}
          </button>

          {abierto && (
            <div className="alertas-panel">
              <strong>Alertas de stock</strong>
              {alertas.length === 0 && <p className="alertas-vacio">Todo en orden.</p>}
              {alertas.map((p) => (
                <div key={p.id} className="alertas-item">
                  <span>{p.nombre}</span>
                  <span className={`badge ${calcularEstado(p.stock).clase}`}>
                    {p.stock === 0 ? 'Agotado' : `Quedan ${p.stock}`}
                  </span>
                </div>
              ))}
              <button
                type="button"
                className="alertas-link"
                onClick={() => {
                  setAbierto(false)
                  navigate('/productos')
                }}
              >
                Ver productos
              </button>
            </div>
          )}
        </div>

        <div className="page-header-usuario">
          <div className="page-header-avatar">♙</div>
          <div>
            <strong>{usuario.nombre}</strong>
            <small>{usuario.rol}</small>
          </div>
        </div>

        <button type="button" className="btn-secundario" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}