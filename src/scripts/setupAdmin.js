// Script para configurar usuario admin en Firebase Auth
// Ejecutar en la consola del navegador en /login

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/config";

// Configuración del usuario admin
const ADMIN_CONFIG = {
  email: "maikostudios@gmail.com",
  password: "123456",
  displayName: "Michael Sáez - MaikoStudios",
};

// Función para crear usuario admin
export const crearUsuarioAdmin = async () => {
  try {
    console.log("🔧 Creando usuario admin en Firebase Auth...");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      ADMIN_CONFIG.email,
      ADMIN_CONFIG.password
    );

    console.log(
      "✅ Usuario admin creado exitosamente:",
      userCredential.user.email
    );
    console.log("📧 Email:", ADMIN_CONFIG.email);
    console.log("🔑 Contraseña:", ADMIN_CONFIG.password);

    return { success: true, user: userCredential.user };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ El usuario admin ya existe. Intentando login...");
      return await probarLoginAdmin();
    } else {
      console.error(
        "❌ Error creando usuario admin:",
        error.code,
        error.message
      );
      return { success: false, error };
    }
  }
};

// Función para probar login del admin
export const probarLoginAdmin = async () => {
  try {
    console.log("🔐 Probando login con credenciales admin...");

    const userCredential = await signInWithEmailAndPassword(
      auth,
      ADMIN_CONFIG.email,
      ADMIN_CONFIG.password
    );

    console.log("✅ Login admin exitoso:", userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("❌ Error en login admin:", error.code, error.message);
    return { success: false, error };
  }
};

// Función para verificar configuración actual
export const verificarConfiguracion = () => {
  console.log("🔍 Verificando configuración Firebase...");
  console.log("📍 Proyecto ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log("🌐 Auth Domain:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  console.log(
    "👤 Usuario actual:",
    auth.currentUser?.email || "No autenticado"
  );
  console.log("🔧 Credenciales admin:", ADMIN_CONFIG.email);
};

// Verificar configuración al cargar
if (import.meta.env.DEV) {
  console.log("🔧 Setup Admin cargado correctamente");
  verificarConfiguracion();
}
