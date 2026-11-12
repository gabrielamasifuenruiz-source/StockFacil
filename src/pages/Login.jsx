import { useState } from "react";
import "../css/login.css";
import { login } from "../service/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD = 12;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};

    if (!email.trim()) {
      next.email = "Ingresa tu email.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Ingresa un email válido.";
    }

    if (!password) {
      next.password = "Ingresa tu contraseña.";
    } else if (password.length < MIN_PASSWORD) {
      next.password = `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`;
    }

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
      const usuario = await login(email.trim(), password);

      if (!usuario) {
        setFormError("Email o contraseña incorrectos.");
      } else {
        onLogin?.(usuario);
      }
    } catch {
      setFormError("No pudimos conectar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <p className="login-brand">SF StockFácil</p>
        <h1 className="login-title">Ingresar a:</h1>
        <p className="login-subtitle">
          Usa tu cuenta personal para continuar.
        </p>

        <label className="login-label" htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="username"
          className={`login-input ${errors.email ? "has-error" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {errors.email && (
          <p className="login-error">{errors.email}</p>
        )}

        <label className="login-label" htmlFor="password">
          Contraseña
        </label>

        <div className="login-password">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={`login-input ${
              errors.password ? "has-error" : ""
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            ◉
          </button>
        </div>

        {errors.password && (
          <p className="login-error">{errors.password}</p>
        )}

        {formError && (
          <p className="login-error" role="alert">
            {formError}
          </p>
        )}

        <button
          type="submit"
          className="login-btn"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="login-footer">
          Controla tu negocio de forma simple
        </p>
      </form>
    </div>
  );
}
