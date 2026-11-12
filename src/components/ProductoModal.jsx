import { useState } from 'react'

const CATEGORIAS = ['Abarrotes', 'Lácteos', 'Limpieza', 'Snacks', 'Bebidas']

export default function ProductoModal({ producto, onCerrar, onGuardar }) {
const [form, setForm] = useState({
  nombre: producto?.nombre ?? '',
  sku: producto?.sku ?? '',
  categoria: producto?.categoria ?? '',
  precio: producto?.precio ?? '',
  stock: producto?.stock ?? '',
})
  const [errores, setErrores] = useState({})
  const [errorForm, setErrorForm] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validar = () => {
    const nuevos = {}
    if (!form.nombre.trim()) nuevos.nombre = 'Ingresá el nombre.'
    if (!form.sku.trim()) nuevos.sku = 'Ingresá el SKU.'
    if (!form.categoria) nuevos.categoria = 'Elegí una categoría.'
    if (form.precio === '' || Number(form.precio) <= 0)
      nuevos.precio = 'El precio debe ser mayor a 0.'
    if (form.stock === '' || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock)))
      nuevos.stock = 'El stock debe ser un número entero (0 o más).'
    return nuevos
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorForm('')

    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setGuardando(true)
    try {
      await onGuardar({
        nombre: form.nombre.trim(),
        sku: form.sku.trim().toUpperCase(),
        categoria: form.categoria,
        precio: Number(form.precio),
        stock: Number(form.stock),
      })
    } catch (err) {
      setErrorForm(err.message)
      setGuardando(false)
    }
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2>{producto ? 'Editar producto' : 'Nuevo producto'}</h2>

        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} />
        {errores.nombre && <p className="modal-error">{errores.nombre}</p>}

        <div className="modal-fila">
          <div>
            <label htmlFor="sku">SKU</label>
            <input id="sku" name="sku" value={form.sku} onChange={cambiar} />
            {errores.sku && <p className="modal-error">{errores.sku}</p>}
          </div>
          <div>
            <label htmlFor="categoria">Categoría</label>
            <select id="categoria" name="categoria" value={form.categoria} onChange={cambiar}>
              <option value="">Seleccionar</option>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errores.categoria && <p className="modal-error">{errores.categoria}</p>}
          </div>
        </div>

        <div className="modal-fila">
          <div>
            <label htmlFor="precio">Precio (S/)</label>
            <input
              id="precio"
              name="precio"
              type="number"
              step="0.01"
              value={form.precio}
              onChange={cambiar}
            />
            {errores.precio && <p className="modal-error">{errores.precio}</p>}
          </div>
          <div>
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={cambiar}
            />
            {errores.stock && <p className="modal-error">{errores.stock}</p>}
          </div>
        </div>

        {errorForm && <p className="modal-error">{errorForm}</p>}

        <div className="modal-botones">
          <button type="button" className="btn-secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="btn-primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}