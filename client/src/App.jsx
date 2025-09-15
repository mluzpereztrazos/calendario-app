import { Routes, Route, Link } from 'react-router-dom';
import HomePublic from "./pages/HomePublic.jsx";
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'; 
import PrivateRoute from './components/privateroute.jsx'; 
import Events from './pages/Events.jsx';

export default function App() {
  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Inicio</Link>
        <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
        <Link to="/register">Registro</Link>
      </nav>

      <Routes>
        {}
        <Route path="/" element={<HomePublic />} />

        {}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Events /> {}
            </PrivateRoute>
          }
        />

        {}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}