export const RUTAS = [
  { nombre: 'Resumen', ruta: '/resumen', icono: '⌂' },
  { nombre: 'Productos', ruta: '/productos', icono: '▦' },
  { nombre: 'Inventario', ruta: '/inventario', icono: '▤' },
  { nombre: 'Categorías', ruta: '/categorias', icono: '▧' },
  { nombre: 'Proveedores', ruta: '/proveedores', icono: '☗' },
  { nombre: 'Ventas', ruta: '/ventas', icono: '↗' },
  { nombre: 'Compras', ruta: '/compras', icono: '↙' },
  { nombre: 'Reportes', ruta: '/reportes', icono: '▥' },
  { nombre: 'Configuración', ruta: '/configuracion', icono: '⚙' },
]

// Qué pantallas ve cada rol
export const PERMISOS = {
  Administrador: RUTAS.map((r) => r.nombre),
  'Almacén': ['Resumen', 'Productos', 'Inventario', 'Categorías', 'Proveedores', 'Compras'],
  Ventas: ['Resumen', 'Productos', 'Ventas', 'Reportes'],
}