/**
 * Wrapper de compatibilidad para evitar romper componentes previos que dependían
 * de `firestoreService.js`. Internamente rutea a nuestra API REST en PostgreSQL.
 */
import apiClient from '@/api/apiClient';

export function generateTrackingCode(id) {
  // Aseguramos al menos 4 dígitos
  return `MAIKO-${String(id).padStart(4, '0')}`;
}

/**
 * Guarda un formulario en el Backend y devuelve un código de seguimiento emulado.
 */
export async function guardarFormulario(data) {
  try {
    const payload = {
      name: data.nombre || data.name || 'Sin nombre',
      email: data.email || 'sin@correo.com',
      phone: data.telefono || data.phone || null,
      message: data.mensaje || data.message || '(Sin mensaje explícito)',
      subject: data.servicio || data.asunto || data.subject || 'Solicitud de Contacto Web',
      source: data.formulario || data.fuente || 'web_form'
    };

    const response = await apiClient.post('/contact', payload);
    const id = response.data.id;
    const codigo = generateTrackingCode(id);

    return { success: true, codigo, id };
  } catch (err) {
    console.error('Error guardando formulario vía API:', err);
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

/**
 * Busca las solicitudes usando el endpoint de admin de contactos
 */
export async function listarSolicitudes(filtros = {}) {
  try {
    const response = await apiClient.get('/contact?limit=100');
    const messages = response.data.data || [];

    // Mapear la data de Postgres al formato que espera el frontend (estado, fecha, codigoSeguimiento)
    return messages.map(msg => {
      let estado = 'pendiente';
      if (msg.responded) estado = 'respondido';
      else if (msg.read) estado = 'en progreso';

      return {
        id: msg.id,
        codigoSeguimiento: generateTrackingCode(msg.id),
        nombre: msg.name,
        email: msg.email,
        servicio: msg.subject || 'Contacto',
        estado: estado,
        fuente: msg.source || 'Home',
        fecha: new Date(msg.createdAt),
        mensaje: msg.message
      };
    });
  } catch (err) {
    console.error('Error listando solicitudes vía API:', err);
    return [];
  }
}

/**
 * Emula la actualización de estado del frontend mapeándolo a read / responded
 */
export async function actualizarEstadoSolicitud(id, nuevoEstado) {
  try {
    if (nuevoEstado === 'en progreso') {
      await apiClient.patch(`/contact/${id}/read`);
    } else if (nuevoEstado === 'respondido') {
      await apiClient.patch(`/contact/${id}/responded`, { notes: 'Actualizado desde tracking panel' });
    }
    return true;
  } catch (err) {
    console.error('Error actualizando estado vía API:', err);
    return false;
  }
}

/**
 * Busca una solicitud por código de seguimiento.
 * Dado que el código es MAIKO-XXXX donde XXXX es la ID, podemos extraer la ID.
 */
export async function buscarSolicitud(codigo) {
  try {
    const parts = codigo.split('-');
    if (parts.length !== 2) throw new Error('Código inválido');
    const id = parseInt(parts[1], 10);
    if (isNaN(id)) throw new Error('Código inválido');

    const response = await apiClient.get(`/contact/${id}`);
    const msg = response.data.data;

    let estado = 'pendiente';
    if (msg.responded) estado = 'respondido';
    else if (msg.read) estado = 'en progreso';

    return { 
      success: true, 
      data: {
        id: msg.id,
        codigoSeguimiento: codigo,
        nombre: msg.name,
        email: msg.email,
        servicio: msg.subject || 'Contacto',
        estado: estado,
        fuente: msg.source || 'Home',
        fecha: new Date(msg.createdAt),
        mensaje: msg.message
      } 
    };
  } catch (err) {
    console.error('Error buscando solicitud vía API:', err);
    return { success: false, error: err.response?.data?.error || err.message };
  }
}
