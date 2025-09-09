import React from "react";
import { useAuth } from "../context/authcontext.jsx";
import "../styles/Home.css";

export default function Home() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h1>Calendario Social 🗓️</h1>
      <p>Bienvenido, {user.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
      {/* Aquí irían todas las funcionalidades del calendario */}
    </div>
  );
}