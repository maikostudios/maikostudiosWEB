# 🚀 Script de Deployment a Producción - MaikoStudios Web (PowerShell)
# 
# Este script automatiza el proceso completo de deployment a producción
# incluyendo merge, configuración de entorno, build y deploy a Firebase.
#
# Uso: .\scripts\deploy-to-production.ps1
# 
# Requisitos:
# - Git configurado
# - Node.js y npm instalados
# - Firebase CLI instalado y autenticado
# - Permisos de escritura en el repositorio

param(
    [switch]$SkipConfirmation = $false
)

# Configuración de colores
$Host.UI.RawUI.ForegroundColor = "White"

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

# Función para verificar prerrequisitos
function Test-Prerequisites {
    Write-Log "Verificando prerrequisitos..."
    
    # Verificar Git
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "Git no está instalado"
        exit 1
    }
    
    # Verificar Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js no está instalado"
        exit 1
    }
    
    # Verificar npm
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Error "npm no está instalado"
        exit 1
    }
    
    # Verificar Firebase CLI
    if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
        Write-Error "Firebase CLI no está instalado. Instalar con: npm install -g firebase-tools"
        exit 1
    }
    
    Write-Success "Todos los prerrequisitos están instalados"
}

# Función para verificar estado del repositorio
function Test-GitStatus {
    Write-Log "Verificando estado del repositorio..."
    
    # Verificar que no hay cambios sin commit
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Error "Hay cambios sin commit. Por favor, commit o stash los cambios antes de continuar."
        git status
        exit 1
    }
    
    # Verificar rama actual
    $currentBranch = git branch --show-current
    Write-Log "Rama actual: $currentBranch"
    
    Write-Success "Repositorio limpio y listo"
}

# Función para hacer merge desde BETA a main
function Invoke-MergeToMain {
    Write-Log "Realizando merge desde BETA a main..."
    
    # Cambiar a rama main
    git checkout main
    Write-Log "Cambiado a rama main"
    
    # Pull latest changes
    git pull origin main
    Write-Log "Actualizando rama main desde remoto"
    
    # Merge desde BETA
    $mergeMessage = "Deploy: Merge BETA to main for production deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git merge BETA --no-ff -m $mergeMessage
    Write-Log "Merge desde BETA completado"
    
    Write-Success "Merge a main completado exitosamente"
}

# Función para configurar entorno de producción
function Set-ProductionEnvironment {
    Write-Log "Configurando variables de entorno para producción..."
    
    # Backup del .env actual
    if (Test-Path ".env") {
        Copy-Item ".env" ".env.backup"
        Write-Log "Backup de .env creado como .env.backup"
    }
    
    # Copiar configuración de producción
    if (Test-Path ".env.production") {
        Copy-Item ".env.production" ".env"
        Write-Success "Variables de entorno de producción configuradas"
    } else {
        Write-Error "Archivo .env.production no encontrado"
        exit 1
    }
}

# Función para instalar dependencias y hacer build
function Invoke-BuildProject {
    Write-Log "Instalando dependencias..."
    npm ci
    
    Write-Log "Ejecutando build para producción..."
    npm run build
    
    # Verificar que el build se generó correctamente
    if (-not (Test-Path "dist")) {
        Write-Error "El directorio dist no se generó. Build falló."
        exit 1
    }
    
    Write-Success "Build completado exitosamente"
}

# Función para hacer deploy a Firebase
function Invoke-FirebaseDeploy {
    Write-Log "Iniciando deployment a Firebase Hosting..."
    
    # Verificar que estamos en el proyecto correcto
    $firebaseProject = firebase use --current 2>$null
    if (-not $firebaseProject) {
        $firebaseProject = "No project set"
    }
    Write-Log "Proyecto Firebase actual: $firebaseProject"
    
    if ($firebaseProject -notlike "*maikostudios-a9162*") {
        Write-Warning "Configurando proyecto Firebase de producción..."
        firebase use maikostudios-a9162
    }
    
    # Deploy
    firebase deploy --only hosting
    
    Write-Success "Deployment a Firebase completado"
}

# Función para push a repositorio
function Invoke-PushToRepository {
    Write-Log "Enviando cambios al repositorio..."
    
    # Push main branch
    git push origin main
    
    Write-Success "Cambios enviados al repositorio"
}

# Función para restaurar entorno de desarrollo
function Restore-DevEnvironment {
    Write-Log "Restaurando configuración de desarrollo..."
    
    # Restaurar .env de desarrollo
    if (Test-Path ".env.development") {
        Copy-Item ".env.development" ".env"
        Write-Success "Variables de entorno de desarrollo restauradas"
    }
    
    # Volver a rama BETA
    git checkout BETA
    Write-Log "Regresado a rama BETA"
}

# Función para mostrar resumen final
function Show-Summary {
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT COMPLETADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Resumen del deployment:"
    Write-Host "  • Rama desplegada: main"
    Write-Host "  • Proyecto Firebase: maikostudios-a9162"
    Write-Host "  • URL de producción: https://maikostudios-a9162.web.app"
    Write-Host "  • Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Host ""
    Write-Host "📋 Próximos pasos recomendados:"
    Write-Host "  1. Verificar que el sitio funcione correctamente"
    Write-Host "  2. Probar funcionalidades críticas (contacto, CV, chatbot)"
    Write-Host "  3. Verificar métricas de rendimiento"
    Write-Host "  4. Notificar al equipo sobre el deployment"
    Write-Host ""
    Write-Host "🔗 Enlaces útiles:"
    Write-Host "  • Sitio web: https://maikostudios-a9162.web.app"
    Write-Host "  • Firebase Console: https://console.firebase.google.com/project/maikostudios-a9162"
    Write-Host "  • Repositorio: https://github.com/maikostudios/maikostudiosWEB"
    Write-Host ""
}

# Función principal
function Main {
    Write-Host ""
    Write-Host "🚀 INICIANDO DEPLOYMENT A PRODUCCIÓN" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Confirmación de seguridad
    if (-not $SkipConfirmation) {
        Write-Warning "Este proceso hará deployment a PRODUCCIÓN"
        Write-Warning "Se realizará merge de BETA a main y deploy a Firebase"
        $confirmation = Read-Host "¿Continuar? (y/N)"
        if ($confirmation -ne "y" -and $confirmation -ne "Y") {
            Write-Log "Deployment cancelado por el usuario"
            exit 0
        }
    }
    
    try {
        # Ejecutar pasos del deployment
        Test-Prerequisites
        Test-GitStatus
        Invoke-MergeToMain
        Set-ProductionEnvironment
        Invoke-BuildProject
        Invoke-FirebaseDeploy
        Invoke-PushToRepository
        Restore-DevEnvironment
        Show-Summary
        
        Write-Success "¡Deployment a producción completado exitosamente!"
    }
    catch {
        Write-Error "Error durante el deployment: $_"
        Write-Log "Restaurando configuración de desarrollo..."
        Restore-DevEnvironment
        exit 1
    }
}

# Ejecutar función principal
Main
