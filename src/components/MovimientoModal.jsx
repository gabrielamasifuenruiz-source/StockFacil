import { useEffect, useState } from 'react'
import { getProductos } from '../service/productosService'

export default function MovimientoModal({ onCerrar, onGuardar }) {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({
    producto: '',
    tipo: 'Entrada',
    cantidad: '',
    referencia: '',
  })
  const [errores, setErrores] = useState({})
  const [errorForm, setErrorForm] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getProductos().then(setProductos)
  }, [])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validar = () => {
    const nuevos = {}
    const cantidad = Number(form.cantidad)

    if (!form.producto) nuevos.producto = 'Elegí un producto.'

    if (form.cantidad === '' || !Number.isInteger(cantidad)) {
      nuevos.cantidad = 'Ingresá un número entero.'
    } else if (form.tipo !== 'Ajuste' && cantidad <= 0) {
      nuevos.cantidad = 'La cantidad debe ser mayor a 0.'
    } else if (form.tipo === 'Ajuste' && cantidad === 0) {
      nuevos.cantidad = 'El ajuste no puede ser 0.'
    }
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
        producto: form.producto,
        tipo: form.tipo,
        cantidad: Number(form.cantidad),
        referencia: form.referencia.trim().toUpperCase(),
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
        <h2>Registrar movimiento</h2>

        <label htmlFor="producto">Producto</label>
        <select id="producto" name="producto" value={form.producto} onChange={cambiar}>
          <option value="">Seleccionar</option>
          {productos.map((p) => (
            <option key={p.id} value={p.nombre}>
              {p.nombre} (stock: {p.stock})
            </option>
          ))}
        </select>
        {errores.producto && <p className="modal-error">{errores.producto}</p>}

        <div className="modal-fila">
          <div>
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" name="tipo" value={form.tipo} onChange={cambiar}>
              <option>Entrada</option>
              <option>Salida</option>
              <option>Ajuste</option>
            </select>
          </div>
          <div>
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              value={form.cantidad}
              onChange={cambiar}
            />
            {errores.cantidad && <p className="modal-error">{errores.cantidad}</p>}
          </div>
        </div>

        {form.tipo === 'Ajuste' && (
          <p className="modal-ayuda">
            En un ajuste usá un número negativo para restar (ej: -2).
          </p>
        )}

        <label htmlFor="referencia">Referencia (opcional)</label>
        <input
          id="referencia"
          name="referencia"
          placeholder="Ej: OC-1050"
          value={form.referencia}
          onChange={cambiar}
        />

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