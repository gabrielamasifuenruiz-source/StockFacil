let productos = [
  { id: 1, nombre: 'Arroz extra 5 kg', sku: 'ARZ-005', categoria: 'Abarrotes', precio: 22.9, stock: 124 },
  { id: 2, nombre: 'Aceite vegetal 1 L', sku: 'ACE-001', categoria: 'Abarrotes', precio: 9.5, stock: 8 },
  { id: 3, nombre: 'Leche evaporada', sku: 'LEC-400', categoria: 'Lácteos', precio: 4.2, stock: 96 },
  { id: 4, nombre: 'Detergente limón', sku: 'DET-090', categoria: 'Limpieza', precio: 12.8, stock: 0 },
  { id: 5, nombre: 'Galletas surtidas', sku: 'GAL-120', categoria: 'Snacks', precio: 6.5, stock: 45 },
  { id: 6, nombre: 'Café molido 250 g', sku: 'CAF-250', categoria: 'Bebidas', precio: 18.0, stock: 12 },
]

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getProductos() {
  await esperar(300)
  return [...productos]
}

export async function crearProducto(nuevo) {
  await esperar(400)

  const repetido = productos.some(
    (p) => p.sku.toLowerCase() === nuevo.sku.toLowerCase()
  )
  if (repetido) throw new Error('Ya existe un producto con ese SKU.')

  const producto = { id: Date.now(), ...nuevo }
  productos = [...productos, producto]
  return producto
}
export async function ajustarStock(nombre, delta) {
  const producto = productos.find((p) => p.nombre === nombre)
  if (!producto) throw new Error('Producto no encontrado.')

  if (producto.stock + delta < 0) {
    throw new Error(`Stock insuficiente. Disponible: ${producto.stock}.`)
  }

  productos = productos.map((p) =>
    p.nombre === nombre ? { ...p, stock: p.stock + delta } : p
  )
}