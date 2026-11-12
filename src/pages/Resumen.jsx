import { useEffect, useState } from 'react'
import { getResumen } from '../service/resumenService'
import PageHeader from '../components/PageHeader'
import '../css/resumen.css'

export default function Resumen() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let activo = true

    async function cargarResumen() {
      setError('')
      setDatos(null)

      try {
        const resultado = await getResumen()

        if (
          !resultado ||
          !Array.isArray(resultado.tarjetas) ||
          !Array.isArray(resultado.ventas) ||
          !Array.isArray(resultado.stock) ||
          !Array.isArray(resultado.actividad)
        ) {
          throw new Error(
            'El servicio de resumen devolvió datos con un formato incorrecto.'
          )
        }

        if (activo) {
          setDatos(resultado)
        }
      } catch (err) {
        console.error('Error al cargar el resumen:', err)

        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : 'Ocurrió un error al cargar el resumen.'
          )
        }
      }
    }

    cargarResumen()

    return () => {
      activo = false
    }
  }, [intento])

  if (error) {
    return (
      <div className="resumen">
        <PageHeader
          titulo="Resumen"
          subtitulo="Una vista rápida del estado de tu negocio"
        />

        <section className="card" role="alert">
          <h2>No se pudo cargar el resumen</h2>
          <p>{error}</p>

          <button
            type="button"
            className="btn-primario"
            onClick={() => setIntento((actual) => actual + 1)}
          >
            Reintentar
          </button>
        </section>
      </div>
    )
  }

  if (!datos) {
    return (
      <div className="resumen">
        <p role="status">Cargando resumen...</p>
      </div>
    )
  }

  const hayVentas = datos.ventas.some(
    (venta) => Number(venta.altura) > 0
  )

  return (
    <div className="resumen">
      <PageHeader
        titulo="Resumen"
        subtitulo="Una vista rápida del estado de tu negocio"
      />

      <section className="resumen-tarjetas">
        {datos.tarjetas.map((tarjeta) => (
          <article key={tarjeta.titulo} className="card">
            <span className="tarjeta-titulo">
              {tarjeta.titulo}
            </span>

            <strong className="tarjeta-valor">
              {tarjeta.valor}
            </strong>

            <span
              className={`tarjeta-nota ${
                tarjeta.alerta ? 'alerta' : ''
              }`}
            >
              {tarjeta.nota}
            </span>
          </article>
        ))}
      </section>

      <section className="resumen-fila">
        <article className="card">
          <h2>Movimiento de ventas</h2>

          <small className="card-sub">
            Últimos 7 días · importes estimados de salidas
          </small>

          {!hayVentas && (
            <p>No hay salidas registradas en los últimos 7 días.</p>
          )}

          <div className="grafico">
            {datos.ventas.map((venta, indice) => (
              <div
                key={`\({venta.dia}-\){indice}`}
                className="grafico-col"
              >
                <div
                  className="grafico-barra"
                  title={
                    venta.total != null
                      ? new Intl.NumberFormat('es-PE', {
                          style: 'currency',
                          currency: 'PEN',
                        }).format(venta.total)
                      : venta.dia
                  }
                  style={{
                    height: `${
                      Math.min(
                        100,
                        Math.max(0, Number(venta.altura) || 0)
                      )
                    }%`,
                  }}
                />

                <span>{venta.dia}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Distribución de stock</h2>

          <div className="stock-lista">
            {datos.stock.map((stock) => (
              <div key={stock.nombre} className="stock-item">
                <div className="stock-texto">
                  <span>{stock.nombre}</span>
                  <strong>{stock.porcentaje}%</strong>
                </div>

                <div className="stock-pista">
                  <div
                    className="stock-relleno"
                    style={{
                      width: `${stock.porcentaje}%`,
                      background: stock.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card">
        <h2>Actividad reciente</h2>

        <div style={{ overflowX: 'auto' }}>
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
              {datos.actividad.map((actividad, indice) => (
                <tr
                  key={
                    actividad.id ??
                    `\({actividad.referencia}-\){indice}`
                  }
                >
                  <td>{actividad.movimiento}</td>
                  <td>{actividad.referencia}</td>
                  <td>{actividad.fecha}</td>
                  <td>{actividad.responsable}</td>
                  <td>{actividad.estado}</td>
                </tr>
              ))}

              {datos.actividad.length === 0 && (
                <tr>
                  <td colSpan="5" className="tabla-vacia">
                    Todavía no hay movimientos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
