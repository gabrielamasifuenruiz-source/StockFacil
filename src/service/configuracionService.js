let usuarios = [
  { id: 1, nombre: 'Administrador', correo: 'admin@stockfacil.com', rol: 'Administrador', ultimoAcceso: 'Hoy, 07:42', estado: 'Activo' },
  { id: 2, nombre: 'María P.', correo: 'maria@stockfacil.com', rol: 'Almacén', ultimoAcceso: 'Hoy, 09:42', estado: 'Activo' },
  { id: 3, nombre: 'Carlos R.', correo: 'carlos@stockfacil.com', rol: 'Ventas', ultimoAcceso: 'Hoy, 09:18', estado: 'Activo' },
]

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getUsuarios() {
  await esperar(300)
  return [...usuarios]
}

export async function crearUsuario({ nombre, correo, rol }) {
  await esperar(400)

  const repetido = usuarios.some(
    (u) => u.correo.toLowerCase() === correo.toLowerCase()
  )
  if (repetido) throw new Error('Ya existe un usuario con ese correo.')

  const nuevo = {
    id: Date.now(),
    nombre,
    correo: correo.toLowerCase(),
    rol,
    ultimoAcceso: 'Nunca',
    estado: 'Activo',
  }
  usuarios = [...usuarios, nuevo]
  return nuevo
}