// Servicio de autenticación para Maiko Studios
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/firebase/config";

// Lista de emails autorizados para acceder al panel de administración
const ADMIN_EMAILS = [
  "maikostudios@gmail.com",
  "m.esteban.saez@gmail.com",
  "admin@maikostudios.com",
];

export const authService = {
  // Autenticación anónima para nuevos visitantes
  async autenticarAnonimo() {
    try {
      if (!auth || !isFirebaseConfigured()) {
        console.warn(
          "Firebase no configurado, omitiendo autenticación anónima."
        );
        return { success: false, error: "Firebase not configured" };
      }

      // Si ya hay un usuario (incluso anónimo), no hacer nada
      if (auth.currentUser) {
        return { success: true, user: auth.currentUser };
      }

      const userCredential = await signInAnonymously(auth);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Error en la autenticación anónima:", error);
      return { success: false, error };
    }
  },
  // Iniciar sesión (correo/contraseña)
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!ADMIN_EMAILS.includes(user.email)) {
        await signOut(auth);
        throw new Error(
          "Usuario no autorizado para acceder al panel de administración"
        );
      }

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Michael Sáez",
      };

      return { success: true, user: userData };
    } catch (error) {
      console.error("Error en signIn:", error);

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

  // Escuchar cambios de sesión (para panel de admin)
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

  // Verifica si el email está autorizado para el panel
  isAuthorizedEmail(email) {
    return ADMIN_EMAILS.includes(email);
  },

  // Restablecer contraseña
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

  // ✅ Nueva función: Autenticación anónima para usuarios normales (chatbot u otros)
  async autenticarAnonimo() {
    try {
      const result = await signInAnonymously(auth);
      console.log("✅ Usuario anónimo autenticado:", result.user.uid);
      return { success: true, user: result.user };
    } catch (error) {
      console.error(
        "❌ Error al autenticar anónimamente:",
        error.code,
        error.message
      );
      return { success: false, error: error.message };
    }
  },
};

export default authService;
