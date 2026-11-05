import { useEffect, useState } from "react";
import { obtenerResumen } from "../service/resumenService";
import "../css/resumen.css";
// Formato de la maqueta: punto para los miles y coma para los decimales (1.284 · +8,2%)
const numero = new Intl.NumberFormat('de-DE');
const decimal = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const soles = (n) => `S/ ${numero.format(n)}`;
const variacion = (n) => `${n >= 0 ? '+' : '−'}${decimal.format(Math.abs(n))}% vs. mes anterior`;

export default function Resumen({ onNavegar }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    obtenerResumen()
      .then((d) => vigente && setDatos(d))
      .catch(() => vigente && setError('No se pudo cargar el resumen. Intenta nuevamente.'));
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <Layout
      activo="resumen"
      onNavegar={onNavegar}
      titulo="Resumen"
      subtitulo="Una vista rápida del estado de tu negocio"
    >
      {error && <p className="resumen-estado error">{error}</p>}
      {!error && !datos && <p className="resumen-estado">Cargando resumen…</p>}
      {datos && <Contenido datos={datos} />}
    </Layout>
  );
}

function Contenido({ datos }) {
  const { kpis, ventasSemana, distribucionStock, actividad } = datos;
  const maximo = Math.max(...ventasSemana.map((d) => d.monto));

  const tarjetas = [
    {
      etiqueta: 'Productos activos',
      valor: numero.format(kpis.productosActivos.valor),
      detalle: variacion(kpis.productosActivos.variacion),
    },
    {
      etiqueta: 'Valor de inventario',
      valor: soles(kpis.valorInventario.valor),
      detalle: variacion(kpis.valorInventario.variacion),
    },
    {
      etiqueta: 'Ventas del mes',
      valor: soles(kpis.ventasMes.valor),
      detalle: variacion(kpis.ventasMes.variacion),
    },
    {
      etiqueta: 'Stock bajo',
      valor: `${kpis.stockBajo} ${kpis.stockBajo === 1 ? 'producto' : 'productos'}`,
      detalle: 'Requieren atención',
      tono: 'aviso',
    },
  ];

  return (
    <div className="resumen">
      {/* Indicadores */}
      <section className="kpis" aria-label="Indicadores del negocio">
        {tarjetas.map((t) => (
          <article key={t.etiqueta} className="tarjeta kpi">
            <span className="kpi-etiqueta">{t.etiqueta}</span>
            <span className="kpi-valor">{t.valor}</span>
            <span className={`kpi-detalle${t.tono ? ` ${t.tono}` : ''}`}>{t.detalle}</span>
          </article>
        ))}
      </section>

      <div className="paneles">
        {/* Movimiento de ventas */}
        <section className="tarjeta panel panel-grafico">
          <h2 className="panel-titulo">Movimiento de ventas</h2>
          <p className="panel-subtitulo">Últimos 7 días</p>
          <div className="barras" role="img" aria-label="Ventas de los últimos 7 días">
            {ventasSemana.map((d) => (
              <div key={d.dia} className="barra-col">
                <div
                  className="barra"
                  style={{ height: `${(d.monto / maximo) * 100}%` }}
                  title={`${d.dia}: ${soles(d.monto)}`}
                />
                <span className="barra-dia">{d.dia}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Distribución de stock */}
        <section className="tarjeta panel panel-distribucion">
          <h2 className="panel-titulo">Distribución de stock</h2>
          <div className="distribucion">
            {distribucionStock.map((d) => (
              <div key={d.estado} className="dist-item">
                <div className="dist-cabecera">
                  <span className="dist-etiqueta">{d.estado}</span>
                  <span className="dist-porcentaje">{d.porcentaje}%</span>
                </div>
                <div className="dist-pista">
                  <div
                    className={`dist-relleno${d.tono === 'ok' ? '' : ` ${d.tono}`}`}
                    style={{ width: `${d.porcentaje}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Actividad reciente */}
      <section className="tarjeta panel panel-actividad">
        <h2 className="panel-titulo">Actividad reciente</h2>
        <div className="tabla-scroll">
          <div className="tabla" role="table" aria-label="Actividad reciente">
            <div className="tabla-fila encabezado" role="row">
              <span role="columnheader">Movimiento</span>
              <span role="columnheader">Referencia</span>
              <span role="columnheader">Fecha</span>
              <span role="columnheader">Responsable</span>
              <span role="columnheader">Estado</span>
            </div>
            {actividad.map((a) => (
              <div key={a.id} className="tabla-fila" role="row">
                <span role="cell">{a.movimiento}</span>
                <span role="cell">{a.referencia}</span>
                <span role="cell">{a.fecha}</span>
                <span role="cell">{a.responsable}</span>
                <span role="cell">{a.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
