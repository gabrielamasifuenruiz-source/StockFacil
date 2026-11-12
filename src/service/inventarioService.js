import { ajustarStock, getProductos } from './productosService'

// Datos de ejemplo. No representan ventas reales.
// Conservamos las fechas originales y añadimos el año.
let movimientos = [
  {
    id: 1,
    fecha: '24 oct, 09:42',
    fechaISO: '2026-10-24T09:42:00-05:00',
    producto: 'Arroz extra 5 kg',
    tipo: 'Entrada',
    cantidad: 48,
    usuario: 'María P.',
    referencia: 'OC-1048',
  },
  {
    id: 2,
    fecha: '24 oct, 09:18',
    fechaISO: '2026-10-24T09:18:00-05:00',
    producto: 'Leche evaporada',
    tipo: 'Salida',
    cantidad: -12,
    usuario: 'Carlos R.',
    referencia: 'VT-2831',
  },
  {
    id: 3,
    fecha: '24 oct, 08:56',
    fechaISO: '2026-10-24T08:56:00-05:00',
    producto: 'Aceite vegetal 1 L',
    tipo: 'Ajuste',
    cantidad: -2,
    usuario: 'María P.',
    referencia: 'AJ-0086',
  },
  {
    id: 4,
    fecha: '23 oct, 17:20',
    fechaISO: '2026-10-23T17:20:00-05:00',
    producto: 'Galletas surtidas',
    tipo: 'Entrada',
    cantidad: 24,
    usuario: 'Carlos R.',
    referencia: 'OC-1042',
  },
  {
    id: 5,
    fecha: '23 oct, 15:44',
    fechaISO: '2026-10-23T15:44:00-05:00',
    producto: 'Detergente limón',
    tipo: 'Salida',
    cantidad: -6,
    usuario: 'María P.',
    referencia: 'VT-2820',
  },
]

const PREFIJOS = {
  Entrada: 'OC',
  Salida: 'VT',
  Ajuste: 'AJ',
}

const esperar = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(fecha)
}

export async function getMovimientos() {
  await esperar(300)

  return movimientos
    .map((movimiento) => ({ ...movimiento }))
    .sort(
      (a, b) =>
        new Date(b.fechaISO).getTime() -
        new Date(a.fechaISO).getTime()
    )
}

export async function crearMovimiento({
  producto,
  tipo,
  cantidad,
  referencia,
}) {
  await esperar(400)

  if (!Object.prototype.hasOwnProperty.call(PREFIJOS, tipo)) {
    throw new Error('Selecciona un tipo de movimiento válido.')
  }

  if (
    cantidad === null ||
    cantidad === undefined ||
    String(cantidad).trim() === ''
  ) {
    throw new Error('Ingresa la cantidad.')
  }

  const numero = Number(cantidad)

  if (!Number.isInteger(numero) || numero === 0) {
    throw new Error('La cantidad debe ser un entero distinto de cero.')
  }

  const productos = await getProductos()
  const encontrado = productos.find((p) => p.nombre === producto)

  if (!encontrado) {
    throw new Error('Producto no encontrado.')
  }

  let delta = numero

  if (tipo === 'Entrada') delta = Math.abs(numero)
  if (tipo === 'Salida') delta = -Math.abs(numero)

  // Si no alcanza el stock, no se registra el movimiento.
  await ajustarStock(producto, delta)

  const ahora = new Date()
  let id = Date.now()

  while (movimientos.some((m) => m.id === id)) {
    id += 1
  }

  const nuevo = {
    id,
    fecha: formatearFecha(ahora),
    fechaISO: ahora.toISOString(),
    producto,
    tipo,
    cantidad: delta,
    precioUnitario: Number(encontrado.precio),
    usuario: 'Admin',
    referencia:
      String(referencia ?? '').trim() ||
      `\({PREFIJOS[tipo]}-\){id}`,
  }

  movimientos = [nuevo, ...movimientos]

  return { ...nuevo }
}
