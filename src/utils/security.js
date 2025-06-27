// Utilidades de seguridad para MaikoStudios Web
// Funciones para sanitización, validación y protección contra ataques

/**
 * Sanitiza una cadena de texto eliminando caracteres peligrosos
 * @param {string} input - Texto a sanitizar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {string} - Texto sanitizado
 */
export function sanitizeString(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Eliminar scripts
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .replace(/on\w+\s*=/gi, '') // Eliminar event handlers
    .replace(/data:/gi, ''); // Eliminar data URLs
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valida un teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si es válido
 */
export function validatePhone(phone) {
  if (!phone) return true; // Opcional
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Valida que una cadena no contenga contenido malicioso
 * @param {string} input - Texto a validar
 * @returns {boolean} - True si es seguro
 */
export function validateSafeContent(input) {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Limita la frecuencia de solicitudes (rate limiting básico)
 * @param {string} key - Clave única para el rate limiting
 * @param {number} maxRequests - Máximo número de solicitudes
 * @param {number} windowMs - Ventana de tiempo en milisegundos
 * @returns {boolean} - True si la solicitud está permitida
 */
export function rateLimit(key, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  
  // Filtrar solicitudes dentro de la ventana de tiempo
  const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  // Agregar nueva solicitud
  recentRequests.push(now);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentRequests));
  
  return true;
}

/**
 * Valida que una API key tenga el formato correcto
 * @param {string} apiKey - API key a validar
 * @param {string} provider - Proveedor (gemini, openai, etc.)
 * @returns {boolean} - True si es válida
 */
export function validateApiKey(apiKey, provider = 'gemini') {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  const patterns = {
    gemini: /^AIza[0-9A-Za-z_-]{35}$/,
    openai: /^sk-[a-zA-Z0-9]{48}$/,
    deepseek: /^sk-[a-zA-Z0-9]{32}$/
  };
  
  return patterns[provider] ? patterns[provider].test(apiKey) : apiKey.length >= 20;
}

/**
 * Sanitiza datos de formulario de contacto
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Datos sanitizados
 */
export function sanitizeContactForm(formData) {
  return {
    nombre: sanitizeString(formData.nombre, 100),
    email: sanitizeString(formData.email, 254).toLowerCase(),
    telefono: formData.telefono ? sanitizeString(formData.telefono, 20) : null,
    asunto: sanitizeString(formData.asunto, 200),
    mensaje: sanitizeString(formData.mensaje, 5000),
    origen: 'formulario_web'
  };
}

/**
 * Valida datos de formulario de contacto
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Resultado de validación
 */
export function validateContactForm(formData) {
  const errors = [];
  
  if (!formData.nombre || formData.nombre.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }
  
  if (!validateEmail(formData.email)) {
    errors.push('Email inválido');
  }
  
  if (formData.telefono && !validatePhone(formData.telefono)) {
    errors.push('Teléfono inválido');
  }
  
  if (!formData.asunto || formData.asunto.length < 3) {
    errors.push('El asunto debe tener al menos 3 caracteres');
  }
  
  if (!formData.mensaje || formData.mensaje.length < 10) {
    errors.push('El mensaje debe tener al menos 10 caracteres');
  }
  
  if (!validateSafeContent(formData.nombre) || 
      !validateSafeContent(formData.mensaje) || 
      !validateSafeContent(formData.asunto)) {
    errors.push('Contenido no permitido detectado');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Configuración de seguridad para headers HTTP
 */
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://api.deepseek.com;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

/**
 * Lista de dominios permitidos para enlaces externos
 */
export const allowedDomains = [
  'github.com',
  'linkedin.com',
  'wa.me',
  'deliciastiajovy.cl',
  'maikostudios.com'
];

/**
 * Valida si un enlace externo es seguro
 * @param {string} url - URL a validar
 * @returns {boolean} - True si es seguro
 */
export function validateExternalLink(url) {
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
  } catch {
    return false;
  }
}
