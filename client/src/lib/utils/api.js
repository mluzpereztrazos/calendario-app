
import { auth } from "../firebase";  // importa Firebase Auth
import { getAllData } from "../lib/utils/api"; 


const URL_BASE = 'https://complete-crud-react-node-back.onrender.com';
const URL_API = '/api/users/';

// Función para obtener headers con token
const getHeaders = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); // obtiene el ID token de Firebase
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  return { 'Content-Type': 'application/json' };
};

export const getAllData = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(URL_BASE + URL_API, { headers });
    if (response.ok) return await response.json();
    return [];
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getDataById = async id => {
  try {
    const headers = await getHeaders();
    const response = await fetch(URL_BASE + URL_API + id, { headers });
    if (response.ok) return await response.json();
    return [];
  } catch (error) {
    console.log(error);
  }
};

export const updateDataById = async (id, body) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(URL_BASE + URL_API + id, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const deleteDataById = async id => {
  try {
    const headers = await getHeaders();
    const response = await fetch(URL_BASE + URL_API + id, {
      method: 'DELETE',
      headers
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};