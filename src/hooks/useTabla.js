import { useMemo, useState } from 'react'

export function useTabla(filas, porPagina = 5) {
  const [orden, setOrden] = useState({ campo: null, direccion: 'asc' })
  const [pagina, setPagina] = useState(1)

  const ordenadas = useMemo(() => {
    if (!orden.campo) return filas
    const copia = [...filas]
    copia.sort((a, b) => {
      const x = a[orden.campo]
      const y = b[orden.campo]
      const r =
        typeof x === 'number' && typeof y === 'number'
          ? x - y
          : String(x).localeCompare(String(y), 'es')
      return orden.direccion === 'asc' ? r : -r
    })
    return copia
  }, [filas, orden])

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina))
  const paginaActual = Math.min(pagina, totalPaginas)
  const visibles = ordenadas.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  )

  const ordenarPor = (campo) => {
    setPagina(1)
    setOrden((o) =>
      o.campo === campo
        ? { campo, direccion: o.direccion === 'asc' ? 'desc' : 'asc' }
        : { campo, direccion: 'asc' }
    )
  }

  return {
    visibles,
    orden,
    ordenarPor,
    pagina: paginaActual,
    setPagina,
    totalPaginas,
    total: ordenadas.length,
  }
}