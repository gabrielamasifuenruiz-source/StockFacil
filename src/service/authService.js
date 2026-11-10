const CLAVE = 'stockfacil_sesion'

const USUARIOS_DEMO = [
  { correo: 'demo@stockfacil.com', password: 'stockfacil-2026', nombre: 'Admin', rol: 'Administrador' },
  { correo: 'maria@stockfacil.com', password: 'almacen-2026-ok', nombre: 'María P.', rol: 'Almacén' },
  { correo: 'carlos@stockfacil.com', password: 'ventas-2026-ok', nombre: 'Carlos R.', rol: 'Ventas' },
]

export async function login(correo, password) {
  await new Promise((r) => setTimeout(r, 600))

  const u = USUARIOS_DEMO.find(
    (x) => x.correo === correo.toLowerCase() && x.password === password
  )
  if (!u) return null
  return { nombre: u.nombre, correo: u.correo, rol: u.rol }
}

export function guardarSesion(usuario) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(usuario))
  } catch {
    // si el navegador bloquea el almacenamiento, la sesión dura hasta recargar
  }
}

export function leerSesion() {
  try {
    const texto = localStorage.getItem(CLAVE)
    return texto ? JSON.parse(texto) : null
  } catch {
    return null
  }
}

export function borrarSesion() {
  try {
    localStorage.removeItem(CLAVE)
  } catch {
    // nada que hacer
  }
}