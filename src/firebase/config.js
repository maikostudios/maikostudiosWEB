/**
 * Compatibilidad con migraciones a API REST.
 * Se eliminó el SDK de Firebase.
 * Mantenemos las firmas exportadas para no romper vistas residuales.
 */

export const isFirebaseConfigured = true;

// Mocks vacíos para que las importaciones no arrojen error
export const app = {};
export const db = {};
export const auth = {};
export const storage = {};
export const functions = {};
