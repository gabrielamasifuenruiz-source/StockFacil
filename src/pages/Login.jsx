import { useState } from "react";
import "../css/login.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD = 12;

// TODO: reemplazar por la llamada real al backend (carpeta service)
async function loginRequest(email, password) {
  await new Promise((r) => setTdemo@stockfacil.comimeout(r, 600));
  return email === "demo@stockfacil.com" && password === "stockfacil-2026";
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Ingresá tu email.";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "Ingresá un email válido.";

    if (!password) next.password = "Ingresá tu contraseña.";
    else if (password.length < MIN_PASSWORD)
      next.password = `La contraseña tiene al menos ${MIN_PASSWORD} caracteres.`;
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const ok = await loginRequest(email.trim(), password);
      if (!ok) {
        setFormError("Email o contraseña incorrectos.");
      } else {
        onLogin();
    }
    } catch {
      setFormError("No pudimos conectar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <p className="login-brand">SF StockFácil</p>
        <h1 className="login-title">Ingresar a:</h1>
        <p className="login-subtitle">Usá tu cuenta personal para continuar.</p>

        <label className="login-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={`login-input ${errors.email ? "has-error" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="login-error">{errors.email}</p>}

        <label className="login-label" htmlFor="password">Contraseña</label>
        <div className="login-password">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className={`login-input ${errors.password ? "has-error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Mostrar u ocultar contraseña"
          >
            ◉
          </button>
        </div>
        {errors.password && <p className="login-error">{errors.password}</p>}

        {formError && <p className="login-error">{formError}</p>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="login-footer">Controlá tu negocio de forma simple</p>
      </form>
    </div>
  );
}