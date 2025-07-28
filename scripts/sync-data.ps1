# 🔄 Script de Sincronización de Datos - MaikoStudios Web
# 
# Este script sincroniza datos de Firebase Development a Production
#
# Uso: .\scripts\sync-data.ps1
# 
# IMPORTANTE: Este script sobrescribirá los datos de producción

param(
    [switch]$SkipConfirmation = $false
)

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Main {
    Write-Host ""
    Write-Host "🔄 SINCRONIZACIÓN DE DATOS DEV → PROD" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Confirmación de seguridad
    if (-not $SkipConfirmation) {
        Write-Warning "Este proceso SOBRESCRIBIRÁ todos los datos de producción"
        Write-Warning "Se crearán backups automáticamente antes de la sincronización"
        Write-Host ""
        Write-Host "Colecciones que se sincronizarán:"
        Write-Host "  • proyectos"
        Write-Host "  • mensajes_contacto"
        Write-Host "  • reclutadores_interesados"
        Write-Host "  • cv_solicitudes"
        Write-Host "  • plantillas"
        Write-Host "  • perfil_candidato"
        Write-Host "  • conversaciones_chatbot"
        Write-Host ""
        $confirmation = Read-Host "¿Continuar con la sincronización? (y/N)"
        if ($confirmation -ne "y" -and $confirmation -ne "Y") {
            Write-Log "Sincronización cancelada por el usuario"
            exit 0
        }
    }
    
    Write-Log "Ejecutando script de sincronización..."
    
    try {
        # Verificar que Node.js esté disponible
        if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
            Write-Error "Node.js no está instalado"
            exit 1
        }
        
        # Ejecutar script de sincronización
        node scripts/sync-dev-to-prod.js
        
        Write-Success "Sincronización completada exitosamente"
        Write-Host ""
        Write-Host "📋 Próximos pasos recomendados:"
        Write-Host "  1. Verificar datos en Firebase Console de producción"
        Write-Host "  2. Probar funcionalidades en el sitio web"
        Write-Host "  3. Si hay problemas, usar los backups para restaurar"
        Write-Host ""
        Write-Host "🔗 Enlaces útiles:"
        Write-Host "  • Firebase Console Prod: https://console.firebase.google.com/project/maikostudios-a9162"
        Write-Host "  • Firebase Console Dev: https://console.firebase.google.com/project/maikostudios-dev"
        
    }
    catch {
        Write-Error "Error durante la sincronización: $_"
        exit 1
    }
}

# Ejecutar función principal
Main
