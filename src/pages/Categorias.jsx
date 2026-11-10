import { useState } from "react";
import "../css/categorias.css";

const categoriasIniciales = [
  {
    id: 1,
    nombre: "Abarrotes",
    productos: 248,
    descripcion: "Productos de consumo diario",
    estado: "Activa",
  },
  {
    id: 2,
    nombre: "Bebidas",
    productos: 86,
    descripcion: "Agua, jugos, café y más",
    estado: "Activa",
  },
  {
    id: 3,
    nombre: "Lácteos",
    productos: 42,
    descripcion: "Leche, yogures y quesos",
    estado: "Activa",
  },
  {
    id: 4,
    nombre: "Limpieza",
    productos: 104,
    descripcion: "Hogar e higiene",
    estado: "Activa",
  },
  {
    id: 5,
    nombre: "Snacks",
    productos: 76,
    descripcion: "Galletas y aperitivos",
    estado: "Activa",
  },
];

export default function Categorias() {
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const categoriasFiltradas = categoriasIniciales.filter((categoria) => {
    const texto =
      `\({categoria.nombre} \){categoria.descripcion}`.toLocaleLowerCase("es");

    return (
      texto.includes(busqueda.toLocaleLowerCase("es")) &&
      (estado === "Todos" || categoria.estado === estado)
    );
  });

  return (
    <section className="categorias-pagina">
      <header className="categorias-cabecera">
        <div>
          <h1>Categorías</h1>
          <p>Organiza tus productos para encontrarlos más rápido</p>
        </div>

        <div className="categorias-usuario">
          <span className="categorias-avatar" aria-hidden="true">
            ♙
          </span>

          <div>
            <strong>Admin</strong>
            <small>Administrador</small>
          </div>
        </div>
      </header>

      <div className="categorias-tarjeta">
        <h2>Categorías de productos</h2>

        <div className="categorias-herramientas">
          <label className="categorias-buscador">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar categorías"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>

          <button
            type="button"
            className="categorias-boton-filtro"
            aria-expanded={mostrarFiltros}
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            Filtrar
          </button>

          {mostrarFiltros && (
            <select
              className="categorias-selector"
              aria-label="Filtrar por estado"
              value={estado}
              onChange={(evento) => setEstado(evento.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          )}
        </div>

        <div className="categorias-tabla-contenedor">
          <table className="categorias-tabla">
            <thead>
              <tr>
                <th scope="col">Categoría</th>
                <th scope="col">Productos</th>
                <th scope="col">Descripción</th>
                <th scope="col">Estado</th>
              </tr>
            </thead>

            <tbody>
              {categoriasFiltradas.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.productos}</td>
                  <td>{categoria.descripcion}</td>
                  <td>
                    <span
                      className={`categorias-estado ${
                        categoria.estado === "Activa"
                          ? "categorias-estado-activa"
                          : "categorias-estado-inactiva"
                      }`}
                    >
                      {categoria.estado}
                    </span>
                  </td>
                </tr>
              ))}

              {categoriasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={4} className="categorias-sin-resultados">
                    No se encontraron categorías.
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

