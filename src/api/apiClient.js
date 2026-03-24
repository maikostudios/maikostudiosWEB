import axios from 'axios';

// La URL base del backend Node.js. Por defecto local, en producci\u00f3n usa la variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Instancia centralizada de Axios para comunicarse con el backend REST.
 * Se encarga de inyectar el token JWT en las cabeceras autom\u00e1ticamente.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});

// Interceptor para inyectar Token en cada request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente (ej: 401 expulsa al usuario)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expir\u00f3 o es inv\u00e1lido
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o inválida. Debes iniciar sesión nuevamente.');
      // Opcional: podr\u00edamos hacer logout o redirigir aqu\u00ed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
