import { useState } from "react";
import "../css/ventas.css";

const ventasIniciales = [
  {
    id: "VT-2831",
    fecha: "24 oct, 09:18",
    cliente: "Venta mostrador",
    productos: 4,
    total: 84.6,
    pago: "Efectivo",
    estado: "Pagada",
  },
  {
    id: "VT-2830",
    fecha: "24 oct, 08:52",
    cliente: "Minimarket Luz",
    productos: 12,
    total: 248,
    pago: "Transferencia",
    estado: "Pagada",
  },
  {
    id: "VT-2829",
    fecha: "23 oct, 17:45",
    cliente: "Venta mostrador",
    productos: 2,
    total: 26.8,
    pago: "Tarjeta",
    estado: "Pagada",
  },
  {
    id: "VT-2828",
    fecha: "23 oct, 16:20",
    cliente: "Bodega Central",
    productos: 8,
    total: 119.5,
    pago: "Crédito",
    estado: "Pendiente",
  },
];

function formatoTotal(total) {
  return `S/ ${total.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function Ventas() {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [estado, setEstado] = useState("Todos");

  const ventasFiltradas = ventasIniciales.filter((venta) => {
    const texto = [
      venta.id,
      venta.fecha,
      venta.cliente,
      venta.pago,
      venta.estado,
    ]
      .join(" ")
      .toLocaleLowerCase("es");

    return (
      texto.includes(busqueda.trim().toLocaleLowerCase("es")) &&
      (estado === "Todos" || venta.estado === estado)
    );
  });

  return (
    <section className="ventas-pagina">
      <header className="ventas-cabecera">
        <div>
          <h1>Ventas</h1>
          <p>Registra ventas y consulta el historial de operaciones</p>
        </div>

        <div className="ventas-usuario">
          <span className="ventas-avatar" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="8" r="3" />
              <path d="M5 20v-2a7 7 0 0 1 14 0v2H5Z" />
            </svg>
          </span>

          <div>
            <strong>Admin</strong>
            <small>Administrador</small>
          </div>
        </div>
      </header>

      <div className="ventas-tarjeta">
        <h2>Historial de ventas</h2>

        <div className="ventas-herramientas">
          <label className="ventas-buscador">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar ventas"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <button
            type="button"
            className="ventas-filtrar"
            aria-expanded={mostrarFiltros}
            aria-controls="ventas-filtro-estado"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            Filtrar
          </button>

          {mostrarFiltros && (
            <select
              id="ventas-filtro-estado"
              className="ventas-selector"
              aria-label="Filtrar ventas por estado"
              value={estado}
              onChange={(evento) => setEstado(evento.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pagada">Pagadas</option>
              <option value="Pendiente">Pendientes</option>
            </select>
          )}
        </div>

        <div className="ventas-tabla-contenedor">
          <table className="ventas-tabla">
            <thead>
              <tr>
                <th scope="col">N.° venta</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cliente</th>
                <th scope="col">Productos</th>
                <th scope="col">Total</th>
                <th scope="col">Pago</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>

            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.fecha}</td>
                  <td>{venta.cliente}</td>
                  <td>{venta.productos}</td>
                  <td>{formatoTotal(venta.total)}</td>
                  <td>{venta.pago}</td>
                  <td>
                    <span
                      className={`ventas-estado ${
                        venta.estado === "Pagada"
                          ? "ventas-pagada"
                          : "ventas-pendiente"
                      }`}
                    >
                      {venta.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {ventasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="ventas-vacio">
                    No se encontraron ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
