
import { useState } from 'react';

const ROLES = ['Administrador', 'Almacén', 'Ventas'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function UsuarioModal({ usuario, onCerrar, onGuardar }) {
  const [form, setForm] = useState({
  nombre: usuario?.nombre ?? '',
  correo: usuario?.correo ?? '',
  rol: usuario?.rol ?? '',
})

  const [errores, setErrores] = useState({});
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cambiar = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validar = () => {
    const nuevos = {};

    if (!form.nombre.trim()) {
      nuevos.nombre = 'Ingresá el nombre.';
    }

    if (!form.correo.trim()) {
      nuevos.correo = 'Ingresá el correo.';
    } else if (!EMAIL_REGEX.test(form.correo.trim())) {
      nuevos.correo = 'Ingresá un correo válido.';
    }

    if (!form.rol) {
      nuevos.rol = 'Elegí un rol.';
    }

    return nuevos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');

    const nuevos = validar();
    setErrores(nuevos);

    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);

    try {
      await onGuardar({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        rol: form.rol
      });

    } catch (err) {
      setErrorForm(err.message || 'Ocurrió un error.');
      setGuardando(false);
    }
  };

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2>{usuario ? 'Editar usuario' : 'Nuevo usuario'}</h2>

        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={cambiar}
        />
        {errores.nombre && (
          <p className="modal-error">{errores.nombre}</p>
        )}

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={form.correo}
          onChange={cambiar}
        />
        {errores.correo && (
          <p className="modal-error">{errores.correo}</p>
        )}

        <label htmlFor="rol">Rol</label>
        <select
          id="rol"
          name="rol"
          value={form.rol}
          onChange={cambiar}
        >
          <option value="">Seleccionar</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {errores.rol && (
          <p className="modal-error">{errores.rol}</p>
        )}

        {errorForm && (
          <p className="modal-error">{errorForm}</p>
        )}

        <div className="modal-botones">
          <button
            type="button"
            className="btn-secundario"
            onClick={onCerrar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-primario"
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
