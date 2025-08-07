/**
 * Monitor de Estabilidad y Tiempo Real - Panel de Administración
 * Verifica conexiones estables, actualizaciones en tiempo real y rendimiento
 * 
 * Uso:
 * 1. Ir a /admin
 * 2. Abrir consola del navegador
 * 3. Ejecutar: startRealtimeMonitoring()
 */

// Configuración del monitor
const MONITOR_CONFIG = {
  checkInterval: 5000, // 5 segundos
  maxRetries: 3,
  timeoutThreshold: 10000, // 10 segundos
  connectionCheckInterval: 30000, // 30 segundos
  performanceMetrics: true
};

// Estado del monitor
let monitorState = {
  isRunning: false,
  startTime: null,
  checks: 0,
  failures: 0,
  lastUpdate: null,
  connectionStatus: 'unknown',
  listeners: new Map(),
  metrics: {
    responseTime: [],
    memoryUsage: [],
    errorRate: 0
  }
};

// Utilidades del monitor
const MonitorUtils = {
  log: (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: '📊',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      monitor: '🔍'
    }[type] || '📊';
    
    console.log(`${emoji} [MONITOR ${timestamp}] ${message}`);
  },

  formatDuration: (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },

  measurePerformance: async (fn, label) => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      monitorState.metrics.responseTime.push({ label, duration, timestamp: Date.now() });
      return { success: true, result, duration };
    } catch (error) {
      const duration = performance.now() - start;
      MonitorUtils.log(`Error en ${label}: ${error.message}`, 'error');
      return { success: false, error, duration };
    }
  },

  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }
};

// Monitor de conexión Firebase
const FirebaseMonitor = {
  async checkConnection() {
    return await MonitorUtils.measurePerformance(async () => {
      if (!window.db) throw new Error('Firebase no disponible');
      
      // Prueba de lectura rápida
      const testRef = window.db.collection('mensajes_contacto').limit(1);
      const snapshot = await testRef.get();
      
      return {
        connected: true,
        docsAvailable: snapshot.size,
        latency: performance.now()
      };
    }, 'Firebase Connection');
  },

  setupRealtimeListeners() {
    MonitorUtils.log('Configurando listeners de tiempo real...', 'monitor');
    
    // Listener para mensajes
    const mensajesListener = window.db.collection('mensajes_contacto')
      .orderBy('fecha_creacion', 'desc')
      .limit(5)
      .onSnapshot(
        (snapshot) => {
          monitorState.lastUpdate = Date.now();
          MonitorUtils.log(`Actualización mensajes: ${snapshot.size} documentos`, 'success');
        },
        (error) => {
          MonitorUtils.log(`Error listener mensajes: ${error.message}`, 'error');
          monitorState.failures++;
        }
      );

    // Listener para solicitudes CV
    const cvListener = window.db.collection('solicitudes_cv')
      .orderBy('fecha_creacion', 'desc')
      .limit(5)
      .onSnapshot(
        (snapshot) => {
          monitorState.lastUpdate = Date.now();
          MonitorUtils.log(`Actualización CV: ${snapshot.size} documentos`, 'success');
        },
        (error) => {
          MonitorUtils.log(`Error listener CV: ${error.message}`, 'error');
          monitorState.failures++;
        }
      );

    // Guardar listeners para cleanup
    monitorState.listeners.set('mensajes', mensajesListener);
    monitorState.listeners.set('cv', cvListener);
  },

  cleanupListeners() {
    MonitorUtils.log('Limpiando listeners...', 'monitor');
    monitorState.listeners.forEach((unsubscribe, name) => {
      unsubscribe();
      MonitorUtils.log(`Listener ${name} desconectado`, 'info');
    });
    monitorState.listeners.clear();
  }
};

// Monitor de rendimiento
const PerformanceMonitor = {
  async checkDashboardLoad() {
    return await MonitorUtils.measurePerformance(async () => {
      // Simular carga de dashboard
      const promises = [];
      
      if (window.firebaseService?.obtenerMensajes) {
        promises.push(window.firebaseService.obtenerMensajes());
      }
      
      if (window.firebaseService?.obtenerSolicitudesCV) {
        promises.push(window.firebaseService.obtenerSolicitudesCV());
      }
      
      if (window.pricingService?.obtenerPacks) {
        promises.push(window.pricingService.obtenerPacks());
      }

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      return {
        totalRequests: promises.length,
        successful,
        failed: promises.length - successful
      };
    }, 'Dashboard Load');
  },

  recordMemoryUsage() {
    const memory = MonitorUtils.getMemoryUsage();
    if (memory) {
      monitorState.metrics.memoryUsage.push({
        ...memory,
        timestamp: Date.now()
      });
      
      // Mantener solo últimas 20 mediciones
      if (monitorState.metrics.memoryUsage.length > 20) {
        monitorState.metrics.memoryUsage.shift();
      }
    }
  },

  generateReport() {
    const uptime = Date.now() - monitorState.startTime;
    const errorRate = monitorState.failures / monitorState.checks * 100;
    
    const avgResponseTime = monitorState.metrics.responseTime.length > 0
      ? monitorState.metrics.responseTime.reduce((sum, m) => sum + m.duration, 0) / monitorState.metrics.responseTime.length
      : 0;

    const lastMemory = monitorState.metrics.memoryUsage[monitorState.metrics.memoryUsage.length - 1];

    return {
      uptime: MonitorUtils.formatDuration(uptime),
      totalChecks: monitorState.checks,
      failures: monitorState.failures,
      errorRate: errorRate.toFixed(2) + '%',
      avgResponseTime: avgResponseTime.toFixed(2) + 'ms',
      connectionStatus: monitorState.connectionStatus,
      lastUpdate: monitorState.lastUpdate ? new Date(monitorState.lastUpdate).toLocaleTimeString() : 'Nunca',
      memoryUsage: lastMemory ? `${lastMemory.used}MB / ${lastMemory.total}MB` : 'No disponible'
    };
  }
};

// Función principal de monitoreo
async function runMonitoringCycle() {
  if (!monitorState.isRunning) return;

  monitorState.checks++;
  MonitorUtils.log(`Ejecutando ciclo de monitoreo #${monitorState.checks}`, 'monitor');

  try {
    // Verificar conexión Firebase
    const connectionResult = await FirebaseMonitor.checkConnection();
    monitorState.connectionStatus = connectionResult.success ? 'connected' : 'disconnected';

    // Verificar rendimiento del dashboard
    const dashboardResult = await PerformanceMonitor.checkDashboardLoad();
    
    // Registrar uso de memoria
    PerformanceMonitor.recordMemoryUsage();

    // Mostrar estado cada 5 ciclos
    if (monitorState.checks % 5 === 0) {
      const report = PerformanceMonitor.generateReport();
      MonitorUtils.log('\n📊 REPORTE DE ESTABILIDAD:', 'info');
      Object.entries(report).forEach(([key, value]) => {
        MonitorUtils.log(`${key}: ${value}`, 'info');
      });
    }

  } catch (error) {
    monitorState.failures++;
    MonitorUtils.log(`Error en ciclo de monitoreo: ${error.message}`, 'error');
  }

  // Programar siguiente ciclo
  setTimeout(runMonitoringCycle, MONITOR_CONFIG.checkInterval);
}

// Funciones de control del monitor
function startRealtimeMonitoring() {
  if (monitorState.isRunning) {
    MonitorUtils.log('El monitor ya está ejecutándose', 'warning');
    return;
  }

  MonitorUtils.log('🚀 Iniciando monitor de tiempo real y estabilidad', 'monitor');
  
  monitorState.isRunning = true;
  monitorState.startTime = Date.now();
  monitorState.checks = 0;
  monitorState.failures = 0;
  monitorState.lastUpdate = null;

  // Configurar listeners de tiempo real
  if (window.db) {
    FirebaseMonitor.setupRealtimeListeners();
  } else {
    MonitorUtils.log('Firebase no disponible, saltando listeners', 'warning');
  }

  // Iniciar ciclo de monitoreo
  runMonitoringCycle();

  MonitorUtils.log('Monitor iniciado exitosamente', 'success');
  MonitorUtils.log('Usa stopRealtimeMonitoring() para detener', 'info');
}

function stopRealtimeMonitoring() {
  if (!monitorState.isRunning) {
    MonitorUtils.log('El monitor no está ejecutándose', 'warning');
    return;
  }

  MonitorUtils.log('🛑 Deteniendo monitor...', 'monitor');
  
  monitorState.isRunning = false;
  FirebaseMonitor.cleanupListeners();

  // Generar reporte final
  const finalReport = PerformanceMonitor.generateReport();
  MonitorUtils.log('\n📋 REPORTE FINAL:', 'info');
  Object.entries(finalReport).forEach(([key, value]) => {
    MonitorUtils.log(`${key}: ${value}`, 'info');
  });

  MonitorUtils.log('Monitor detenido', 'success');
}

function getMonitorStatus() {
  return {
    ...monitorState,
    report: PerformanceMonitor.generateReport()
  };
}

// Exponer funciones globalmente
window.startRealtimeMonitoring = startRealtimeMonitoring;
window.stopRealtimeMonitoring = stopRealtimeMonitoring;
window.getMonitorStatus = getMonitorStatus;
window.monitorState = monitorState;

// Auto-configurar si estamos en admin
if (window.location.pathname === '/admin') {
  MonitorUtils.log('🎯 Monitor de estabilidad cargado. Usa startRealtimeMonitoring() para comenzar', 'info');
}

export { startRealtimeMonitoring, stopRealtimeMonitoring, getMonitorStatus };
