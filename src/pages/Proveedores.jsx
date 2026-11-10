import { useState } from "react";
import "../css/proveedores.css";

const proveedores = [
  {
    id: 1,
    nombre: "Distribuidora El Sol",
    documento: "20548762119",
    contacto: "(01) 456-7890",
    ultimaCompra: "22 oct 2026",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Comercial Andina",
    documento: "20471239876",
    contacto: "987 654 321",
    ultimaCompra: "20 oct 2026",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Mayorista San José",
    documento: "20600987123",
    contacto: "(01) 333-9080",
    ultimaCompra: "18 oct 2026",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Importaciones Lima",
    documento: "20111222334",
    contacto: "999 222 111",
    ultimaCompra: "10 oct 2026",
    estado: "Inactivo",
  },
];

export default function Proveedores() {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [estado, setEstado] = useState("Todos");

  const resultados = proveedores.filter((proveedor) => {
    const texto = [
      proveedor.nombre,
      proveedor.documento,
      proveedor.contacto,
    ]
      .join(" ")
      .toLocaleLowerCase("es");

    return (
      texto.includes(busqueda.trim().toLocaleLowerCase("es")) &&
      (estado === "Todos" || proveedor.estado === estado)
    );
  });

  return (
    <section className="proveedores-pagina">
      <header className="proveedores-cabecera">
        <div>
          <h1>Proveedores</h1>
          <p>Mantén los datos de tus proveedores y sus compras</p>
        </div>

        <div className="proveedores-usuario">
          <span className="proveedores-avatar" aria-hidden="true">
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

      <div className="proveedores-tarjeta">
        <h2>Directorio de proveedores</h2>

        <div className="proveedores-herramientas">
          <label className="proveedores-buscador">
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
              aria-label="Buscar proveedores"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <button
            type="button"
            className="proveedores-filtrar"
            aria-expanded={mostrarFiltros}
            aria-controls="proveedores-filtro-estado"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            Filtrar
          </button>

          {mostrarFiltros && (
            <select
              id="proveedores-filtro-estado"
              className="proveedores-selector"
              aria-label="Filtrar por estado"
              value={estado}
              onChange={(evento) => setEstado(evento.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          )}
        </div>

        <div className="proveedores-tabla-contenedor">
          <table className="proveedores-tabla">
            <thead>
              <tr>
                <th scope="col">Proveedor</th>
                <th scope="col">RUC / documento</th>
                <th scope="col">Contacto</th>
                <th scope="col">Última compra</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>

            <tbody>
              {resultados.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.documento}</td>
                  <td>{proveedor.contacto}</td>
                  <td>{proveedor.ultimaCompra}</td>
                  <td>
                    <span
                      className={`proveedores-estado ${
                        proveedor.estado === "Activo"
                          ? "proveedores-activo"
                          : "proveedores-inactivo"
                      }`}
                    >
                      {proveedor.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {resultados.length === 0 && (
                <tr>
                  <td colSpan={5} className="proveedores-vacio">
                    No se encontraron proveedores.
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
