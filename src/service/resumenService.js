import { getProductos, calcularEstado } from './productosService'
import { getMovimientos } from './inventarioService'

const moneda = (valor) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(valor)

const numero = (valor) =>
  new Intl.NumberFormat('es-PE').format(valor)

const TITULOS = {
  Entrada: 'Entrada de mercadería',
  Salida: 'Salida registrada',
  Ajuste: 'Ajuste de inventario',
}

// Devuelve la fecha de Perú con formato AAAA-MM-DD.
function claveFecha(fecha) {
  if (
    !(fecha instanceof Date) ||
    Number.isNaN(fecha.getTime())
  ) {
    throw new Error('Se encontró una fecha inválida en el resumen.')
  }

  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(fecha)

  const obtener = (tipo) =>
    partes.find((parte) => parte.type === tipo).value

  return (
    obtener('year') +
    '-' +
    obtener('month') +
    '-' +
    obtener('day')
  )
}

function fechaValida(movimiento) {
  if (!movimiento.fechaISO) return null

  const fecha = new Date(movimiento.fechaISO)

  return Number.isNaN(fecha.getTime()) ? null : fecha
}

export async function getResumen() {
  const [productos, movimientos] = await Promise.all([
    getProductos(),
    getMovimientos(),
  ])

  const hoy = claveFecha(new Date())
  const mesActual = hoy.slice(0, 7)

  const precios = new Map(
    productos.map((producto) => [
      producto.nombre,
      Number(producto.precio) || 0,
    ])
  )

  // Las salidas se usan como estimación, no como facturación.
  // Si no hay precio histórico, se utiliza el precio actual.
  const importeSalida = (movimiento) => {
    const precio =
      movimiento.precioUnitario ??
      precios.get(movimiento.producto) ??
      0

    return (
      Math.abs(Number(movimiento.cantidad) || 0) *
      (Number(precio) || 0)
    )
  }

  const movimientosConFecha = movimientos
    .map((movimiento) => ({
      ...movimiento,
      fechaObjeto: fechaValida(movimiento),
    }))
    .filter((movimiento) => movimiento.fechaObjeto !== null)
    .sort(
      (a, b) =>
        b.fechaObjeto.getTime() - a.fechaObjeto.getTime()
    )

  const salidas = movimientosConFecha.filter(
    (movimiento) => movimiento.tipo === 'Salida'
  )

  const salidasDelMes = salidas.filter(
    (movimiento) =>
      claveFecha(movimiento.fechaObjeto).slice(0, 7) ===
      mesActual
  )

  const totalVentas = salidasDelMes.reduce(
    (suma, movimiento) => suma + importeSalida(movimiento),
    0
  )

  const valorInventario = productos.reduce(
    (suma, producto) =>
      suma +
      (Number(producto.precio) || 0) *
        (Number(producto.stock) || 0),
    0
  )

  const unidades = productos.reduce(
    (suma, producto) => suma + (Number(producto.stock) || 0),
    0
  )

  const categorias = new Set(
    productos.map((producto) => producto.categoria)
  ).size

  const bajos = productos.filter(
    (producto) =>
      calcularEstado(Number(producto.stock)).clase === 'bajo'
  ).length

  const agotados = productos.filter(
    (producto) =>
      calcularEstado(Number(producto.stock)).clase === 'agotado'
  ).length

  const disponibles = productos.length - bajos - agotados
  const atencion = bajos + agotados

  // Los porcentajes suman 100 cuando hay productos.
  const cantidades = [disponibles, bajos, agotados]

  const exactos = cantidades.map((cantidad) =>
    productos.length > 0
      ? (cantidad / productos.length) * 100
      : 0
  )

  const porcentajes = exactos.map(Math.floor)

  if (productos.length > 0) {
    const orden = exactos
      .map((valor, indice) => ({
        indice,
        resto: valor - porcentajes[indice],
      }))
      .sort((a, b) => b.resto - a.resto)

    const faltantes =
      100 -
      porcentajes.reduce((suma, porcentaje) => suma + porcentaje, 0)

    for (let i = 0; i < faltantes; i += 1) {
      porcentajes[orden[i].indice] += 1
    }
  }

  // Las 17:00 UTC corresponden a las 12:00 en Perú.
  const [anio, mes, diaDelMes] = hoy.split('-').map(Number)

  const base = new Date(
    Date.UTC(anio, mes - 1, diaDelMes, 17, 0, 0)
  )

  const dias = Array.from({ length: 7 }, (_, indice) => {
    const fecha = new Date(
      base.getTime() - (6 - indice) * 24 * 60 * 60 * 1000
    )

    const clave = claveFecha(fecha)

    const total = salidas
      .filter(
        (movimiento) =>
          claveFecha(movimiento.fechaObjeto) === clave
      )
      .reduce(
        (suma, movimiento) => suma + importeSalida(movimiento),
        0
      )

    return {
      dia: new Intl.DateTimeFormat('es-PE', {
        timeZone: 'America/Lima',
        weekday: 'short',
      }).format(fecha),
      total,
    }
  })

  const maximo = Math.max(
    ...dias.map((dia) => dia.total),
    0
  )

  return {
    tarjetas: [
      {
        titulo: 'Productos activos',
        valor: numero(productos.length),
        nota: categorias + ' categorías',
      },
      {
        titulo: 'Valor de inventario',
        valor: moneda(valorInventario),
        nota: numero(unidades) + ' unidades en stock',
      },
      {
        titulo: 'Salidas estimadas del mes',
        valor: moneda(totalVentas),
        nota:
          salidasDelMes.length +
          ' salidas; no es facturación',
      },
      {
        titulo: 'Stock bajo o agotado',
        valor: atencion + ' productos',
        nota:
          atencion > 0
            ? 'Requieren atención'
            : 'Todo en orden',
        alerta: atencion > 0,
      },
    ],

    ventas: dias.map((dia) => ({
      ...dia,
      altura:
        maximo > 0
          ? (dia.total / maximo) * 100
          : 0,
    })),

    stock: [
      {
        nombre: 'Disponible',
        porcentaje: porcentajes[0],
        color: '#6f9f98',
      },
      {
        nombre: 'Stock bajo',
        porcentaje: porcentajes[1],
        color: '#d9a05b',
      },
      {
        nombre: 'Agotado',
        porcentaje: porcentajes[2],
        color: '#c95d5d',
      },
    ],

    actividad: movimientosConFecha.slice(0, 5).map((movimiento) => ({
      id: movimiento.id,
      movimiento:
        TITULOS[movimiento.tipo] ?? movimiento.tipo,
      referencia: movimiento.referencia,
      fecha: movimiento.fecha,
      responsable: movimiento.usuario,
      estado: 'Registrado',
    })),
  }
}
