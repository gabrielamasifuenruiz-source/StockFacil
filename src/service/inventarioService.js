import { ajustarStock } from './productosService'

let movimientos = [
  { id: 1, fecha: '24 oct, 09:42', producto: 'Arroz extra 5 kg', tipo: 'Entrada', cantidad: 48, usuario: 'María P.', referencia: 'OC-1048' },
  { id: 2, fecha: '24 oct, 09:18', producto: 'Leche evaporada', tipo: 'Salida', cantidad: -12, usuario: 'Carlos R.', referencia: 'VT-2831' },
  { id: 3, fecha: '24 oct, 08:56', producto: 'Aceite vegetal 1 L', tipo: 'Ajuste', cantidad: -2, usuario: 'María P.', referencia: 'AJ-0086' },
  { id: 4, fecha: '23 oct, 17:20', producto: 'Galletas surtidas', tipo: 'Entrada', cantidad: 24, usuario: 'Carlos R.', referencia: 'OC-1042' },
  { id: 5, fecha: '23 oct, 15:44', producto: 'Detergente limón', tipo: 'Salida', cantidad: -6, usuario: 'María P.', referencia: 'VT-2820' },
]

const PREFIJOS = { Entrada: 'OC', Salida: 'VT', Ajuste: 'AJ' }
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

function formatearFecha(fecha) {
  const hora = String(fecha.getHours()).padStart(2, '0')
  const min = String(fecha.getMinutes()).padStart(2, '0')
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]}, ${hora}:${min}`
}

export async function getMovimientos() {
  await esperar(300)
  return [...movimientos]
}

export async function crearMovimiento({ producto, tipo, cantidad, referencia }) {
  await esperar(400)

  // Entrada suma, Salida resta y Ajuste respeta el signo escrito
  let delta = cantidad
  if (tipo === 'Entrada') delta = Math.abs(cantidad)
  if (tipo === 'Salida') delta = -Math.abs(cantidad)

  // Lanza error si no alcanza el stock
  await ajustarStock(producto, delta)

  const nuevo = {
    id: Date.now(),
    fecha: formatearFecha(new Date()),
    producto,
    tipo,
    cantidad: delta,
    usuario: 'Admin',
    referencia:
      referencia || `${PREFIJOS[tipo]}-${Math.floor(1000 + Math.random() * 9000)}`,
  }

  movimientos = [nuevo, ...movimientos]
  return nuevo
}