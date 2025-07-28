// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage } from "firebase/storage"; // Added import for storage

// Verificar si las variables de entorno están configuradas
const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== "demo_api_key" && apiKey.trim() !== "";
};

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:123456789012:web:abcdefghijklmnop",
};

// Inicializar Firebase
let app = null;
let db = null;
let auth = null;
let functions = null;
let storage = null; // Added storage variable

try {
  app = initializeApp(firebaseConfig);

  if (isFirebaseConfigured()) {
    // Configuración real de Firebase
    db = getFirestore(app);
    auth = getAuth(app);
    functions = getFunctions(app);
    storage = getStorage(app); // Initialize storage
    console.log("✅ Firebase configurado correctamente");
  } else {
    // Modo demo - crear instancias pero sin funcionalidad real
    console.warn(
      "⚠️ Firebase en modo demo - configurar variables de entorno para funcionalidad completa"
    );
    db = null;
    auth = null;
    functions = null;
    storage = null; // Set storage to null in demo mode
  }
} catch (error) {
  console.error("❌ Error al inicializar Firebase:", error);
  db = null;
  auth = null;
  functions = null;
  storage = null; // Set storage to null on error
}

// Exportar servicios (pueden ser null en modo demo)
export { db, auth, functions, storage, isFirebaseConfigured };
export default app;
