let productos = [
  { id: 1, nombre: 'Arroz extra 5 kg', sku: 'ARZ-005', categoria: 'Abarrotes', precio: 22.9, stock: 124 },
  { id: 2, nombre: 'Aceite vegetal 1 L', sku: 'ACE-001', categoria: 'Abarrotes', precio: 9.5, stock: 8 },
  { id: 3, nombre: 'Leche evaporada', sku: 'LEC-400', categoria: 'Lácteos', precio: 4.2, stock: 96 },
  { id: 4, nombre: 'Detergente limón', sku: 'DET-090', categoria: 'Limpieza', precio: 12.8, stock: 0 },
  { id: 5, nombre: 'Galletas surtidas', sku: 'GAL-120', categoria: 'Snacks', precio: 6.5, stock: 45 },
  { id: 6, nombre: 'Café molido 250 g', sku: 'CAF-250', categoria: 'Bebidas', precio: 18, stock: 12 },
]

export const STOCK_BAJO = 10

const esperar = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function calcularEstado(stock) {
  if (stock <= 0) {
    return { texto: 'Agotado', clase: 'agotado' }
  }

  if (stock < STOCK_BAJO) {
    return { texto: 'Stock bajo', clase: 'bajo' }
  }

  return { texto: 'Disponible', clase: 'disponible' }
}

export async function getProductos() {
  await esperar(400)
  return productos.map((producto) => ({ ...producto }))
}

export async function crearProducto(nuevo) {
  await esperar(400)

  const sku = String(nuevo.sku ?? '').trim()

  if (!sku) {
    throw new Error('Ingresa el código SKU.')
  }

  const repetido = productos.some(
    (p) => p.sku.toLowerCase() === sku.toLowerCase()
  )

  if (repetido) {
    throw new Error('Ya existe un producto con ese SKU.')
  }

  const precio = Number(nuevo.precio)
  const stock = Number(nuevo.stock)

  if (!Number.isFinite(precio) || precio < 0) {
    throw new Error('Ingresa un precio válido.')
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un entero mayor o igual a cero.')
  }

  let id = Date.now()
  while (productos.some((p) => String(p.id) === String(id))) {
    id += 1
  }

  const producto = {
    ...nuevo,
    id,
    sku,
    precio,
    stock,
  }

  productos = [...productos, producto]
  return { ...producto }
}

export async function actualizarProducto(id, datos) {
  await esperar(400)

  const actual = productos.find(
    (p) => String(p.id) === String(id)
  )

  if (!actual) {
    throw new Error('Producto no encontrado.')
  }

  const actualizado = {
    ...actual,
    ...datos,
    id: actual.id,
  }

  actualizado.sku = String(actualizado.sku ?? '').trim()
  actualizado.precio = Number(actualizado.precio)
  actualizado.stock = Number(actualizado.stock)

  if (!actualizado.sku) {
    throw new Error('Ingresa el código SKU.')
  }

  const repetido = productos.some(
    (p) =>
      String(p.id) !== String(id) &&
      p.sku.toLowerCase() === actualizado.sku.toLowerCase()
  )

  if (repetido) {
    throw new Error('Ya existe un producto con ese SKU.')
  }

  if (
    !Number.isFinite(actualizado.precio) ||
    actualizado.precio < 0
  ) {
    throw new Error('Ingresa un precio válido.')
  }

  if (
    !Number.isInteger(actualizado.stock) ||
    actualizado.stock < 0
  ) {
    throw new Error('El stock debe ser un entero mayor o igual a cero.')
  }

  productos = productos.map((p) =>
    String(p.id) === String(id) ? actualizado : p
  )

  return { ...actualizado }
}

export async function eliminarProducto(id) {
  await esperar(300)

  const existe = productos.some(
    (p) => String(p.id) === String(id)
  )

  if (!existe) {
    throw new Error('Producto no encontrado.')
  }

  productos = productos.filter(
    (p) => String(p.id) !== String(id)
  )
}

export async function ajustarStock(nombre, delta) {
  const producto = productos.find((p) => p.nombre === nombre)

  if (!producto) {
    throw new Error('Producto no encontrado.')
  }

  const cantidad = Number(delta)

  if (!Number.isInteger(cantidad)) {
    throw new Error('El ajuste debe ser un número entero.')
  }

  const nuevoStock = Number(producto.stock) + cantidad

  if (nuevoStock < 0) {
    throw new Error(
      `Stock insuficiente. Disponible: ${producto.stock}.`
    )
  }

  const actualizado = { ...producto, stock: nuevoStock }

  productos = productos.map((p) =>
    p.id === producto.id ? actualizado : p
  )

  return { ...actualizado }
}
