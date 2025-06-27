// Servicio de autenticación para Maiko Studios
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/firebase/config";

// Lista de emails autorizados para acceder al panel de administración
const ADMIN_EMAILS = [
  "maikostudios@gmail.com",
  "m.esteban.saez@gmail.com",
  "admin@maikostudios.com",
];

export const authService = {
  // Iniciar sesión
  async signIn(email, password) {
    try {
      // Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Verificar que el usuario está autorizado
      if (!ADMIN_EMAILS.includes(user.email)) {
        await signOut(auth); // Cerrar sesión inmediatamente
        throw new Error(
          "Usuario no autorizado para acceder al panel de administración"
        );
      }

      // Usuario autenticado y autorizado
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Michael Sáez",
      };

      return { success: true, user: userData };
    } catch (error) {
      console.error("Error en signIn:", error);

      // Mapear errores de Firebase a mensajes amigables
      let message = "Error al iniciar sesión";

      switch (error.code) {
        case "auth/user-not-found":
          message = "Usuario no encontrado";
          break;
        case "auth/wrong-password":
          message = "Contraseña incorrecta";
          break;
        case "auth/invalid-email":
          message = "Email inválido";
          break;
        case "auth/too-many-requests":
          message = "Demasiados intentos fallidos. Intenta más tarde";
          break;
        case "auth/network-request-failed":
          message = "Error de conexión. Verifica tu internet";
          break;
        default:
          message = error.message || "Error desconocido";
      }

      return { success: false, error: message };
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      if (auth && isFirebaseConfigured()) {
        await signOut(auth);
      }

      return { success: true };
    } catch (error) {
      console.error("Error en signOut:", error);
      return { success: false, error: error.message };
    }
  },

  // Verificar si el usuario está autenticado (solo con Firebase Auth)
  onAuthStateChange(callback) {
    if (auth && isFirebaseConfigured()) {
      return onAuthStateChanged(auth, (user) => {
        if (user && this.isAuthorizedEmail(user.email)) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Michael Sáez",
          };
          callback(userData);
        } else {
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  },

  // Verificar si el email está autorizado
  isAuthorizedEmail(email) {
    return ADMIN_EMAILS.includes(email);
  },

  // Restablecer contraseña (solo para Firebase)
  async resetPassword(email) {
    try {
      if (!auth || !isFirebaseConfigured()) {
        throw new Error(
          "Restablecimiento de contraseña no disponible en modo local"
        );
      }

      if (!this.isAuthorizedEmail(email)) {
        throw new Error("Email no autorizado");
      }

      await sendPasswordResetEmail(auth, email);
      return { success: true, message: "Email de restablecimiento enviado" };
    } catch (error) {
      console.error("Error en resetPassword:", error);
      return { success: false, error: error.message };
    }
  },
};

export default authService;
