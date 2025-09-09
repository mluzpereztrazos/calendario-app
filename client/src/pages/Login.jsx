import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);
      console.log("Usuario logueado:", user);
      navigate("/app");
    } catch (err) {
      console.error(err.message);
      setError("Email o contraseña incorrectos");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const user = await loginWithGoogle();
      console.log("Usuario logueado con Google:", user);
      navigate("/app");
    } catch (err) {
      console.error(err.message);
      setError("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <button className="google" onClick={handleGoogleLogin}>
        Iniciar sesión con Google
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}