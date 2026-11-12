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
const contarAdmins = () => usuarios.filter((u) => u.rol === 'Administrador').length

export async function actualizarUsuario(id, { nombre, correo, rol }) {
  await esperar(400)

  const actual = usuarios.find((u) => u.id === id)
  if (!actual) throw new Error('Usuario no encontrado.')

  const repetido = usuarios.some(
    (u) => u.id !== id && u.correo.toLowerCase() === correo.toLowerCase()
  )
  if (repetido) throw new Error('Ya existe un usuario con ese correo.')

  if (actual.rol === 'Administrador' && rol !== 'Administrador' && contarAdmins() === 1) {
    throw new Error('Debe quedar al menos un administrador.')
  }

  usuarios = usuarios.map((u) =>
    u.id === id ? { ...u, nombre, correo: correo.toLowerCase(), rol } : u
  )
  return usuarios.find((u) => u.id === id)
}

export async function eliminarUsuario(id) {
  await esperar(300)

  const usuario = usuarios.find((u) => u.id === id)
  if (usuario?.rol === 'Administrador' && contarAdmins() === 1) {
    throw new Error('Debe quedar al menos un administrador.')
  }
  usuarios = usuarios.filter((u) => u.id !== id)
}