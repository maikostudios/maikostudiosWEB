// Servicio de autenticación REST con Axios para Maiko Studios
import apiClient from '@/api/apiClient';

export const authService = {
  // Autenticación anónima para nuevos visitantes (en backend propio puede simplemente no requerir token,
  // pero mantendremos un placeholder si es necesario para compatibilidad).
  async autenticarAnonimo() {
    try {
      // Por ahora para no romper el flujo del chatbot que pide un UID, 
      // generaremos un guest ID temporal
      const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
      console.log("✅ Usuario anónimo (local) pseudo-autenticado:", guestId);
      return { success: true, user: { uid: guestId, isAnonymous: true } };
    } catch (error) {
      console.error("❌ Error al autenticar anónimamente:", error);
      return { success: false, error: error.message };
    }
  },

  // Iniciar sesión (correo/contraseña) vía API REST
  async signIn(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Guardar el token en localStorage para el interceptor de Axios
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      console.error("Error en signIn (REST):", error);
      
      const message = error.response?.data?.error || "Error al iniciar sesión. Verifica tus credenciales.";
      return { success: false, error: message };
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      // Llamada opcional al backend si hay lógica de invalidación
      // await apiClient.post('/auth/logout');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error("Error en signOut:", error);
      return { success: false, error: error.message };
    }
  },

  // Obtener el usuario actual sincronamente desde localStorage
  getCurrentUserSync() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  // Obtener/Verificar usuario contra el backend
  async verifyAuth() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await apiClient.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      // Si el token falló, limpiar
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  // Compatibilidad: Escuchar cambios de sesión
  onAuthStateChange(callback) {
    // En JWT standard no hay un listener en tiempo real de conexión como en Firebase.
    // Simularemos la carga inicial verificando al backend.
    this.verifyAuth().then(user => {
      callback(user);
    });
    
    // Devolvemos una función vacía que emula el unsubscribe de onAuthStateChanged
    return () => {};
  },

  // Verifica si el rol en backend es admin
  isAuthorizedEmail(user) {
    if (!user) return false;
    // Si la info viene de backend propio, validamos por rol
    if (user.role === 'admin') return true;
    
    // Fallback de compatibilidad
    const ADMIN_EMAILS = [
      "maikostudios@gmail.com",
      "m.esteban.saez@gmail.com",
      "admin@maikostudios.com",
    ];
    return ADMIN_EMAILS.includes(user.email);
  },

  // Restablecer contraseña
  async resetPassword(email) {
    try {
      // Falta endpoint real de reset, pero devolvemos error manejable
      throw new Error("El restablecimiento de contraseñas vía backend aún no está implementado.");
    } catch (error) {
      console.error("Error en resetPassword:", error);
      return { success: false, error: error.message };
    }
  }
};

export default authService;
