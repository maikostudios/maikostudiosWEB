import { db } from '@/firebase/config'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore'

const collectionName = 'contactRequests'

export function generateTrackingCode () {
  return `MAIKO-${Math.floor(Math.random() * 9000 + 1000)}`
}

/**
 * Guarda un formulario en Firestore y devuelve el código de seguimiento.
 * @param {object} data - Datos a almacenar
 * @returns {Promise<{success:boolean, codigo?:string, error?:string}>}
 */
export async function guardarFormulario (data) {
  try {
    const codigo = generateTrackingCode()

    const payload = {
      ...data,
      fecha: serverTimestamp(),
      estado: 'pendiente',
      codigoSeguimiento: codigo,
      formulario: data.formulario || 'interactivo'
    }

    await addDoc(collection(db, collectionName), payload)
    return { success: true, codigo }
  } catch (err) {
    console.error('🔥 Error guardando formulario', err)
    return { success: false, error: err.message }
  }
}

/**
 * Busca una solicitud por código de seguimiento.
 * @param {string} codigo - Código MAIKO-XXXX
 * @returns {Promise<{success:boolean, data?:object, error?:string}>}
 */
export async function listarSolicitudes (filtros = {}) {
  try {
    let q = collection(db, collectionName)
    const clauses = []
    if (filtros.estado) clauses.push(where('estado', '==', filtros.estado))
    if (filtros.fuente) clauses.push(where('fuente', '==', filtros.fuente))
    if (filtros.formulario) clauses.push(where('formulario', '==', filtros.formulario))
    if (clauses.length) q = query(q, ...clauses)

    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('🔥 Error listando solicitudes', err)
    return []
  }
}

export async function actualizarEstadoSolicitud (id, nuevoEstado) {
  try {
    const ref = doc(db, collectionName, id)
    await updateDoc(ref, { estado: nuevoEstado })
    return true
  } catch (err) {
    console.error('🔥 Error actualizando estado', err)
    return false
  }
}

export async function buscarSolicitud (codigo) {
  try {
    const q = query(
      collection(db, collectionName),
      where('codigoSeguimiento', '==', codigo)
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return { success: false, error: 'No se encontró la solicitud' }
    }
    const doc = snapshot.docs[0]
    return { success: true, data: { id: doc.id, ...doc.data() } }
  } catch (err) {
    console.error('🔥 Error buscando solicitud', err)
    return { success: false, error: err.message }
  }
}
