import { useState } from "react";
import "../css/compras.css";

const ordenes = [
  {
    numero: "OC-1048",
    fecha: "24 oct 2026",
    proveedor: "Distribuidora El Sol",
    articulos: 8,
    total: 1240,
    estado: "Recibida",
  },
  {
    numero: "OC-1047",
    fecha: "23 oct 2026",
    proveedor: "Comercial Andina",
    articulos: 5,
    total: 680.5,
    estado: "En tránsito",
  },
  {
    numero: "OC-1046",
    fecha: "21 oct 2026",
    proveedor: "Mayorista San José",
    articulos: 12,
    total: 2450,
    estado: "Pendiente",
  },
  {
    numero: "OC-1045",
    fecha: "18 oct 2026",
    proveedor: "Distribuidora El Sol",
    articulos: 6,
    total: 820,
    estado: "Recibida",
  },
];

const clasesEstado = {
  Recibida: "compras-recibida",
  "En tránsito": "compras-transito",
  Pendiente: "compras-pendiente",
};

function formatoTotal(total) {
  return `S/ ${total.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function Compras() {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [estado, setEstado] = useState("Todos");

  const resultados = ordenes.filter((orden) => {
    const texto = [
      orden.numero,
      orden.fecha,
      orden.proveedor,
      orden.estado,
    ]
      .join(" ")
      .toLocaleLowerCase("es");

    return (
      texto.includes(busqueda.trim().toLocaleLowerCase("es")) &&
      (estado === "Todos" || orden.estado === estado)
    );
  });

  return (
    <section className="compras-pagina">
      <header className="compras-cabecera">
        <div>
          <h1>Compras</h1>
          <p>Gestiona órdenes de compra y recepción de mercadería</p>
        </div>

        <div className="compras-usuario">
          <span className="compras-avatar" aria-hidden="true">
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

      <div className="compras-tarjeta">
        <h2>Órdenes de compra</h2>

        <div className="compras-herramientas">
          <label className="compras-buscador">
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
              aria-label="Buscar órdenes de compra"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <button
            type="button"
            className="compras-filtrar"
            aria-expanded={mostrarFiltros}
            aria-controls="compras-filtro-estado"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            Filtrar
          </button>

          {mostrarFiltros && (
            <select
              id="compras-filtro-estado"
              className="compras-selector"
              aria-label="Filtrar por estado"
              value={estado}
              onChange={(evento) => setEstado(evento.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Recibida">Recibida</option>
              <option value="En tránsito">En tránsito</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          )}
        </div>

        <div className="compras-tabla-contenedor">
          <table className="compras-tabla">
            <thead>
              <tr>
                <th scope="col">N.° orden</th>
                <th scope="col">Fecha</th>
                <th scope="col">Proveedor</th>
                <th scope="col">Artículos</th>
                <th scope="col">Total</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>

            <tbody>
              {resultados.map((orden) => (
                <tr key={orden.numero}>
                  <td>{orden.numero}</td>
                  <td>{orden.fecha}</td>
                  <td>{orden.proveedor}</td>
                  <td>{orden.articulos}</td>
                  <td>{formatoTotal(orden.total)}</td>
                  <td>
                    <span
                      className={`compras-estado ${
                        clasesEstado[orden.estado]
                      }`}
                    >
                      {orden.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {resultados.length === 0 && (
                <tr>
                  <td colSpan={6} className="compras-vacio">
                    No se encontraron órdenes de compra.
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
