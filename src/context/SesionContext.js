import { createContext, useContext } from 'react'

export const SesionContext = createContext({
  usuario: null,
  cerrarSesion: () => {},
})

export const useSesion = () => useContext(SesionContext)