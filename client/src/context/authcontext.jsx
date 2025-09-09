import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

const AuthContext = createContext();

// Hook para usar AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escucha cambios en la autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Función para login
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential.user;
  };

  // Función para registro
  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    return userCredential.user;
  };

  // 🔹 Función para login con Google
  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    return result.user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loginWithGoogle }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};