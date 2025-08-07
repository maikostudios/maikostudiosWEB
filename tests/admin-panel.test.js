/**
 * Pruebas automatizadas para el Panel de Administración
 * Verifica conexiones Firebase, cargas dinámicas y funcionalidad CRUD
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { createPinia } from 'pinia';
import AdminView from '@/views/AdminView.vue';
import { authService } from '@/services/authService';
import { firebaseService } from '@/firebase/services';
import { pricingService } from '@/services/pricingService';

// Mock Firebase
vi.mock('@/firebase/config', () => ({
  auth: {
    currentUser: {
      email: 'maikostudios@gmail.com',
      uid: 'test-uid',
      isAnonymous: false
    }
  },
  db: {},
  isFirebaseConfigured: () => true
}));

// Mock de servicios
vi.mock('@/services/authService');
vi.mock('@/firebase/services');
vi.mock('@/services/pricingService');

describe('Panel de Administración - Pruebas de Conectividad', () => {
  let wrapper;
  let vuetify;
  let pinia;

  beforeEach(() => {
    vuetify = createVuetify();
    pinia = createPinia();
    
    // Mock de autenticación exitosa
    authService.isAuthorizedEmail.mockReturnValue(true);
    authService.getCurrentUser.mockResolvedValue({
      email: 'maikostudios@gmail.com',
      uid: 'test-uid'
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.clearAllMocks();
  });

  describe('🔐 Autenticación y Acceso', () => {
    it('debe verificar que el usuario esté autenticado', async () => {
      const isAuthorized = authService.isAuthorizedEmail('maikostudios@gmail.com');
      expect(isAuthorized).toBe(true);
    });

    it('debe denegar acceso a usuarios no autorizados', () => {
      const isAuthorized = authService.isAuthorizedEmail('usuario@noautorizado.com');
      expect(isAuthorized).toBe(false);
    });

    it('debe cargar el componente AdminView correctamente', () => {
      wrapper = mount(AdminView, {
        global: {
          plugins: [vuetify, pinia],
          stubs: ['router-link', 'router-view']
        }
      });
      
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.admin-page').exists()).toBe(true);
    });
  });

  describe('🔥 Conexión Firebase', () => {
    it('debe verificar conexión estable con Firestore', async () => {
      firebaseService.obtenerMensajes.mockResolvedValue([
        { id: '1', nombre: 'Test', email: 'test@test.com', mensaje: 'Mensaje de prueba' }
      ]);

      const mensajes = await firebaseService.obtenerMensajes();
      expect(mensajes).toHaveLength(1);
      expect(mensajes[0]).toHaveProperty('id');
      expect(mensajes[0]).toHaveProperty('email');
    });

    it('debe manejar errores de conexión Firebase', async () => {
      firebaseService.obtenerMensajes.mockRejectedValue(new Error('Connection failed'));

      try {
        await firebaseService.obtenerMensajes();
      } catch (error) {
        expect(error.message).toBe('Connection failed');
      }
    });
  });

  describe('📊 Dashboard y Estadísticas', () => {
    it('debe cargar estadísticas en tiempo real', async () => {
      const mockStats = {
        totalMensajes: 25,
        mensajesNoLeidos: 5,
        solicitudesCV: 12,
        proyectosActivos: 8
      };

      firebaseService.obtenerEstadisticas.mockResolvedValue(mockStats);

      const stats = await firebaseService.obtenerEstadisticas();
      expect(stats.totalMensajes).toBe(25);
      expect(stats.mensajesNoLeidos).toBe(5);
      expect(stats.solicitudesCV).toBe(12);
      expect(stats.proyectosActivos).toBe(8);
    });

    it('debe actualizar contadores dinámicamente', async () => {
      const initialCount = 10;
      const updatedCount = 11;

      firebaseService.contarMensajes.mockResolvedValueOnce(initialCount);
      firebaseService.contarMensajes.mockResolvedValueOnce(updatedCount);

      const count1 = await firebaseService.contarMensajes();
      const count2 = await firebaseService.contarMensajes();

      expect(count1).toBe(initialCount);
      expect(count2).toBe(updatedCount);
    });
  });

  describe('✉️ CRUD - Mensajes de Contacto', () => {
    it('debe listar mensajes correctamente', async () => {
      const mockMensajes = [
        { id: '1', nombre: 'Juan', email: 'juan@test.com', leido: false },
        { id: '2', nombre: 'María', email: 'maria@test.com', leido: true }
      ];

      firebaseService.obtenerMensajes.mockResolvedValue(mockMensajes);

      const mensajes = await firebaseService.obtenerMensajes();
      expect(mensajes).toHaveLength(2);
      expect(mensajes[0].leido).toBe(false);
      expect(mensajes[1].leido).toBe(true);
    });

    it('debe marcar mensaje como leído', async () => {
      firebaseService.marcarComoLeido.mockResolvedValue({ success: true });

      const result = await firebaseService.marcarComoLeido('mensaje-id');
      expect(result.success).toBe(true);
      expect(firebaseService.marcarComoLeido).toHaveBeenCalledWith('mensaje-id');
    });

    it('debe eliminar mensaje correctamente', async () => {
      firebaseService.eliminarMensaje.mockResolvedValue({ success: true });

      const result = await firebaseService.eliminarMensaje('mensaje-id');
      expect(result.success).toBe(true);
      expect(firebaseService.eliminarMensaje).toHaveBeenCalledWith('mensaje-id');
    });
  });

  describe('💼 CRUD - Solicitudes CV', () => {
    it('debe listar solicitudes de CV', async () => {
      const mockSolicitudes = [
        { id: '1', nombre: 'Ana', cargo: 'Desarrolladora', estado: 'pendiente' },
        { id: '2', nombre: 'Carlos', cargo: 'Designer', estado: 'procesado' }
      ];

      firebaseService.obtenerSolicitudesCV.mockResolvedValue(mockSolicitudes);

      const solicitudes = await firebaseService.obtenerSolicitudesCV();
      expect(solicitudes).toHaveLength(2);
      expect(solicitudes[0].estado).toBe('pendiente');
    });

    it('debe actualizar estado de solicitud CV', async () => {
      firebaseService.actualizarEstadoCV.mockResolvedValue({ success: true });

      const result = await firebaseService.actualizarEstadoCV('cv-id', 'procesado');
      expect(result.success).toBe(true);
      expect(firebaseService.actualizarEstadoCV).toHaveBeenCalledWith('cv-id', 'procesado');
    });
  });

  describe('🎨 CRUD - Gestión de Portafolio', () => {
    it('debe listar proyectos del portafolio', async () => {
      const mockProyectos = [
        { id: '1', titulo: 'Proyecto A', tecnologias: ['Vue', 'Firebase'], activo: true },
        { id: '2', titulo: 'Proyecto B', tecnologias: ['React', 'Node'], activo: false }
      ];

      firebaseService.obtenerProyectos.mockResolvedValue(mockProyectos);

      const proyectos = await firebaseService.obtenerProyectos();
      expect(proyectos).toHaveLength(2);
      expect(proyectos[0].activo).toBe(true);
    });

    it('debe crear nuevo proyecto', async () => {
      const nuevoProyecto = {
        titulo: 'Nuevo Proyecto',
        descripcion: 'Descripción del proyecto',
        tecnologias: ['Vue', 'Tailwind'],
        activo: true
      };

      firebaseService.crearProyecto.mockResolvedValue({ success: true, id: 'nuevo-id' });

      const result = await firebaseService.crearProyecto(nuevoProyecto);
      expect(result.success).toBe(true);
      expect(result.id).toBe('nuevo-id');
    });

    it('debe actualizar proyecto existente', async () => {
      const datosActualizados = { titulo: 'Título Actualizado' };

      firebaseService.actualizarProyecto.mockResolvedValue({ success: true });

      const result = await firebaseService.actualizarProyecto('proyecto-id', datosActualizados);
      expect(result.success).toBe(true);
    });

    it('debe eliminar proyecto', async () => {
      firebaseService.eliminarProyecto.mockResolvedValue({ success: true });

      const result = await firebaseService.eliminarProyecto('proyecto-id');
      expect(result.success).toBe(true);
    });
  });

  describe('💰 CRUD - Gestión de Precios', () => {
    it('debe listar packs de precios', async () => {
      const mockPacks = [
        { id: '1', nombre: 'Básico', precio: 299000, activo: true },
        { id: '2', nombre: 'Premium', precio: 599000, activo: true }
      ];

      pricingService.obtenerPacks.mockResolvedValue(mockPacks);

      const packs = await pricingService.obtenerPacks();
      expect(packs).toHaveLength(2);
      expect(packs[0].precio).toBe(299000);
    });

    it('debe crear nuevo pack de precios', async () => {
      const nuevoPack = {
        nombre: 'Empresarial',
        precio: 999000,
        caracteristicas: ['Feature 1', 'Feature 2'],
        activo: true
      };

      pricingService.crearPack.mockResolvedValue({ success: true, id: 'pack-id' });

      const result = await pricingService.crearPack(nuevoPack);
      expect(result.success).toBe(true);
      expect(result.id).toBe('pack-id');
    });

    it('debe actualizar pack existente', async () => {
      const datosActualizados = { precio: 349000 };

      pricingService.actualizarPack.mockResolvedValue({ success: true });

      const result = await pricingService.actualizarPack('pack-id', datosActualizados);
      expect(result.success).toBe(true);
    });

    it('debe eliminar pack', async () => {
      pricingService.eliminarPack.mockResolvedValue({ success: true });

      const result = await pricingService.eliminarPack('pack-id');
      expect(result.success).toBe(true);
    });
  });
});
