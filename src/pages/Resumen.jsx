import { useEffect, useState } from 'react'
import { getResumen } from '../service/resumenService'
import '../css/resumen.css'

export default function Resumen() {
  const [datos, setDatos] = useState(null)

  useEffect(() => {
    getResumen().then(setDatos)
  }, [])

  if (!datos) return <p>Cargando...</p>

  return (
    <div className="resumen">
      {/* Encabezado */}
      <header className="resumen-header">
        <div>
          <h1>Resumen</h1>
          <p>Una vista rápida del estado de tu negocio</p>
        </div>
        <div className="resumen-usuario">
          <div className="resumen-avatar">♙</div>
          <div>
            <strong>{datos.usuario.nombre}</strong>
            <small>{datos.usuario.rol}</small>
          </div>
        </div>
      </header>

      {/* Tarjetas */}
      <section className="resumen-tarjetas">
        {datos.tarjetas.map((t) => (
          <article key={t.titulo} className="card">
            <span className="tarjeta-titulo">{t.titulo}</span>
            <strong className="tarjeta-valor">{t.valor}</strong>
            <span className={`tarjeta-nota ${t.alerta ? 'alerta' : ''}`}>{t.nota}</span>
          </article>
        ))}
      </section>

      {/* Gráfico y distribución */}
      <section className="resumen-fila">
        <article className="card">
          <h2>Movimiento de ventas</h2>
          <small className="card-sub">Últimos 7 días</small>
          <div className="grafico">
            {datos.ventas.map((v) => (
              <div key={v.dia} className="grafico-col">
                <div className="grafico-barra" style={{ height: `${v.altura}%` }} />
                <span>{v.dia}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Distribución de stock</h2>
          <div className="stock-lista">
            {datos.stock.map((s) => (
              <div key={s.nombre} className="stock-item">
                <div className="stock-texto">
                  <span>{s.nombre}</span>
                  <strong>{s.porcentaje}%</strong>
                </div>
                <div className="stock-pista">
                  <div
                    className="stock-relleno"
                    style={{ width: `${s.porcentaje}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Actividad reciente */}
      <section className="card">
        <h2>Actividad reciente</h2>
        <table className="tabla">
          <thead>
            <tr>
              <th>Movimiento</th>
              <th>Referencia</th>
              <th>Fecha</th>
              <th>Responsable</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.actividad.map((a) => (
              <tr key={a.referencia}>
                <td>{a.movimiento}</td>
                <td>{a.referencia}</td>
                <td>{a.fecha}</td>
                <td>{a.responsable}</td>
                <td>{a.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}