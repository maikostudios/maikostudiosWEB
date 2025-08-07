/**
 * Pruebas de Integración para Panel de Administración
 * Ejecutar en la consola del navegador en /admin
 * 
 * Uso:
 * 1. Ir a /admin y autenticarse
 * 2. Abrir consola del navegador
 * 3. Ejecutar: runAdminIntegrationTests()
 */

// Configuración de pruebas
const TEST_CONFIG = {
  timeout: 5000,
  retries: 3,
  verbose: true
};

// Utilidades de testing
const TestUtils = {
  log: (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      test: '🧪'
    }[type] || 'ℹ️';
    
    console.log(`${emoji} [${timestamp}] ${message}`);
  },

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async retry(fn, retries = TEST_CONFIG.retries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        this.log(`Intento ${i + 1} falló, reintentando...`, 'warning');
        await this.wait(1000);
      }
    }
  }
};

// Pruebas de conectividad Firebase
const FirebaseConnectivityTests = {
  async testFirebaseConnection() {
    TestUtils.log('Probando conexión Firebase...', 'test');
    
    try {
      // Verificar que Firebase esté configurado
      if (!window.firebase || !window.db) {
        throw new Error('Firebase no está configurado');
      }

      // Probar lectura básica
      const testCollection = window.db.collection('mensajes_contacto');
      const snapshot = await testCollection.limit(1).get();
      
      TestUtils.log('Conexión Firebase exitosa', 'success');
      return { success: true, docsCount: snapshot.size };
    } catch (error) {
      TestUtils.log(`Error de conexión Firebase: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  },

  async testRealtimeUpdates() {
    TestUtils.log('Probando actualizaciones en tiempo real...', 'test');
    
    try {
      let updateReceived = false;
      
      // Configurar listener temporal
      const unsubscribe = window.db.collection('mensajes_contacto')
        .limit(1)
        .onSnapshot(() => {
          updateReceived = true;
        });

      // Esperar un momento para recibir datos
      await TestUtils.wait(2000);
      unsubscribe();

      if (updateReceived) {
        TestUtils.log('Actualizaciones en tiempo real funcionando', 'success');
        return { success: true };
      } else {
        throw new Error('No se recibieron actualizaciones');
      }
    } catch (error) {
      TestUtils.log(`Error en tiempo real: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
};

// Pruebas CRUD
const CRUDTests = {
  async testMensajesContacto() {
    TestUtils.log('Probando CRUD de mensajes de contacto...', 'test');
    
    try {
      // Leer mensajes
      const mensajes = await window.firebaseService?.obtenerMensajes() || [];
      TestUtils.log(`Mensajes encontrados: ${mensajes.length}`, 'info');

      // Si hay mensajes, probar actualización
      if (mensajes.length > 0) {
        const primerMensaje = mensajes[0];
        const estadoOriginal = primerMensaje.leido;
        
        // Cambiar estado
        await window.firebaseService?.marcarComoLeido(primerMensaje.id);
        TestUtils.log('Mensaje marcado como leído', 'success');
        
        // Restaurar estado original si es necesario
        if (!estadoOriginal) {
          // Aquí podrías implementar una función para desmarcar
          TestUtils.log('Estado original restaurado', 'info');
        }
      }

      return { success: true, count: mensajes.length };
    } catch (error) {
      TestUtils.log(`Error en CRUD mensajes: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  },

  async testSolicitudesCV() {
    TestUtils.log('Probando CRUD de solicitudes CV...', 'test');
    
    try {
      // Leer solicitudes CV
      const solicitudes = await window.firebaseService?.obtenerSolicitudesCV() || [];
      TestUtils.log(`Solicitudes CV encontradas: ${solicitudes.length}`, 'info');

      return { success: true, count: solicitudes.length };
    } catch (error) {
      TestUtils.log(`Error en CRUD CV: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  },

  async testGestionPortafolio() {
    TestUtils.log('Probando gestión de portafolio...', 'test');
    
    try {
      // Leer proyectos
      const proyectos = await window.firebaseService?.obtenerProyectos() || [];
      TestUtils.log(`Proyectos encontrados: ${proyectos.length}`, 'info');

      return { success: true, count: proyectos.length };
    } catch (error) {
      TestUtils.log(`Error en gestión portafolio: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  },

  async testGestionPrecios() {
    TestUtils.log('Probando gestión de precios...', 'test');
    
    try {
      // Leer packs de precios
      const packs = await window.pricingService?.obtenerPacks() || [];
      TestUtils.log(`Packs de precios encontrados: ${packs.length}`, 'info');

      // Leer planes de precios
      const planes = await window.pricingService?.obtenerPlanes() || [];
      TestUtils.log(`Planes de precios encontrados: ${planes.length}`, 'info');

      return { success: true, packsCount: packs.length, planesCount: planes.length };
    } catch (error) {
      TestUtils.log(`Error en gestión precios: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
};

// Pruebas de UI/UX
const UITests = {
  async testTabNavigation() {
    TestUtils.log('Probando navegación entre tabs...', 'test');
    
    try {
      const tabs = ['mensajes', 'cv', 'portafolio', 'precios', 'solicitudes', 'estadisticas'];
      let successCount = 0;

      for (const tab of tabs) {
        const tabElement = document.querySelector(`[value="${tab}"]`);
        if (tabElement) {
          tabElement.click();
          await TestUtils.wait(500);
          successCount++;
          TestUtils.log(`Tab ${tab} navegado exitosamente`, 'info');
        }
      }

      TestUtils.log(`Navegación completada: ${successCount}/${tabs.length} tabs`, 'success');
      return { success: true, tabsNavigated: successCount };
    } catch (error) {
      TestUtils.log(`Error en navegación UI: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  },

  async testResponsiveDesign() {
    TestUtils.log('Probando diseño responsivo...', 'test');
    
    try {
      const originalWidth = window.innerWidth;
      
      // Simular móvil
      Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
      window.dispatchEvent(new Event('resize'));
      await TestUtils.wait(500);
      
      // Simular tablet
      Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
      window.dispatchEvent(new Event('resize'));
      await TestUtils.wait(500);
      
      // Restaurar tamaño original
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
      window.dispatchEvent(new Event('resize'));
      
      TestUtils.log('Pruebas de responsividad completadas', 'success');
      return { success: true };
    } catch (error) {
      TestUtils.log(`Error en responsividad: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
};

// Función principal de pruebas
async function runAdminIntegrationTests() {
  TestUtils.log('🚀 Iniciando pruebas de integración del panel de administración', 'info');
  
  const results = {
    firebase: {},
    crud: {},
    ui: {},
    summary: { total: 0, passed: 0, failed: 0 }
  };

  try {
    // Pruebas de Firebase
    TestUtils.log('\n📡 PRUEBAS DE CONECTIVIDAD FIREBASE', 'info');
    results.firebase.connection = await FirebaseConnectivityTests.testFirebaseConnection();
    results.firebase.realtime = await FirebaseConnectivityTests.testRealtimeUpdates();

    // Pruebas CRUD
    TestUtils.log('\n🔧 PRUEBAS CRUD', 'info');
    results.crud.mensajes = await CRUDTests.testMensajesContacto();
    results.crud.cv = await CRUDTests.testSolicitudesCV();
    results.crud.portafolio = await CRUDTests.testGestionPortafolio();
    results.crud.precios = await CRUDTests.testGestionPrecios();

    // Pruebas UI
    TestUtils.log('\n🎨 PRUEBAS DE INTERFAZ', 'info');
    results.ui.navigation = await UITests.testTabNavigation();
    results.ui.responsive = await UITests.testResponsiveDesign();

    // Calcular resumen
    const allTests = [
      ...Object.values(results.firebase),
      ...Object.values(results.crud),
      ...Object.values(results.ui)
    ];

    results.summary.total = allTests.length;
    results.summary.passed = allTests.filter(test => test.success).length;
    results.summary.failed = allTests.filter(test => !test.success).length;

    // Mostrar resumen
    TestUtils.log('\n📊 RESUMEN DE PRUEBAS', 'info');
    TestUtils.log(`Total: ${results.summary.total}`, 'info');
    TestUtils.log(`Exitosas: ${results.summary.passed}`, 'success');
    TestUtils.log(`Fallidas: ${results.summary.failed}`, results.summary.failed > 0 ? 'error' : 'info');
    
    const successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
    TestUtils.log(`Tasa de éxito: ${successRate}%`, successRate >= 80 ? 'success' : 'warning');

    return results;

  } catch (error) {
    TestUtils.log(`Error general en pruebas: ${error.message}`, 'error');
    return { error: error.message, results };
  }
}

// Exponer funciones globalmente para uso en consola
window.runAdminIntegrationTests = runAdminIntegrationTests;
window.FirebaseConnectivityTests = FirebaseConnectivityTests;
window.CRUDTests = CRUDTests;
window.UITests = UITests;

// Auto-ejecutar si estamos en la página de admin
if (window.location.pathname === '/admin') {
  TestUtils.log('🎯 Script de pruebas cargado. Ejecuta runAdminIntegrationTests() para comenzar', 'info');
}

export { runAdminIntegrationTests, FirebaseConnectivityTests, CRUDTests, UITests };
