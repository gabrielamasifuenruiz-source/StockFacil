export function ThOrdenable({ campo, orden, onOrdenar, children }) {
  const activo = orden.campo === campo
  return (
    <th className="th-ordenable" onClick={() => onOrdenar(campo)}>
      {children}
      <span className="th-flecha">
        {activo ? (orden.direccion === 'asc' ? ' ▲' : ' ▼') : ' ↕'}
      </span>
    </th>
  )
}

export function Paginacion({ pagina, totalPaginas, total, onCambiar }) {
  if (total === 0) return null
  return (
    <div className="paginacion">
      <span>
        {total} resultados · Página {pagina} de {totalPaginas}
      </span>
      <div>
        <button
          type="button"
          className="btn-secundario"
          disabled={pagina === 1}
          onClick={() => onCambiar(pagina - 1)}
        >
          Anterior
        </button>
        <button
          type="button"
          className="btn-secundario"
          disabled={pagina === totalPaginas}
          onClick={() => onCambiar(pagina + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}