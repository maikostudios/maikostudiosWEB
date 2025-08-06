/**
 * Script simple para crear usuario administrador en producción
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Configuración de Firebase (producción)
const firebaseConfig = {
  apiKey: "AIzaSyBqK3gpZUzjUYulGE6yu6GwGyRavUFOKAo",
  authDomain: "maikostudios-a9162.firebaseapp.com",
  projectId: "maikostudios-a9162",
  storageBucket: "maikostudios-a9162.firebasestorage.app",
  messagingSenderId: "798896348759",
  appId: "1:798896348759:web:a4c6bf6911bc107aa38d12"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function crearAdmin() {
  try {
    console.log('Creando usuario administrador...');
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'maikostudios@gmail.com',
      '123456'
    );

    console.log('Usuario creado exitosamente:', userCredential.user.email);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('El usuario ya existe');
    } else {
      console.error('Error:', error.message);
    }
  }
}

crearAdmin();
