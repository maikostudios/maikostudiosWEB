#!/bin/bash

# 🚀 Script de Deployment a Producción - MaikoStudios Web
# 
# Este script automatiza el proceso completo de deployment a producción
# incluyendo merge, configuración de entorno, build y deploy a Firebase.
#
# Uso: ./scripts/deploy-to-production.sh
# 
# Requisitos:
# - Git configurado
# - Node.js y npm instalados
# - Firebase CLI instalado y autenticado
# - Permisos de escritura en el repositorio

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para verificar prerrequisitos
check_prerequisites() {
    log "Verificando prerrequisitos..."
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        error "Git no está instalado"
        exit 1
    fi
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado"
        exit 1
    fi
    
    # Verificar Firebase CLI
    if ! command -v firebase &> /dev/null; then
        error "Firebase CLI no está instalado. Instalar con: npm install -g firebase-tools"
        exit 1
    fi
    
    success "Todos los prerrequisitos están instalados"
}

# Función para verificar estado del repositorio
check_git_status() {
    log "Verificando estado del repositorio..."
    
    # Verificar que no hay cambios sin commit
    if [[ -n $(git status --porcelain) ]]; then
        error "Hay cambios sin commit. Por favor, commit o stash los cambios antes de continuar."
        git status
        exit 1
    fi
    
    # Verificar rama actual
    CURRENT_BRANCH=$(git branch --show-current)
    log "Rama actual: $CURRENT_BRANCH"
    
    success "Repositorio limpio y listo"
}

# Función para hacer merge desde BETA a main
merge_to_main() {
    log "Realizando merge desde BETA a main..."
    
    # Cambiar a rama main
    git checkout main
    log "Cambiado a rama main"
    
    # Pull latest changes
    git pull origin main
    log "Actualizando rama main desde remoto"
    
    # Merge desde BETA
    git merge BETA --no-ff -m "Deploy: Merge BETA to main for production deployment $(date +'%Y-%m-%d %H:%M:%S')"
    log "Merge desde BETA completado"
    
    success "Merge a main completado exitosamente"
}

# Función para configurar entorno de producción
setup_production_env() {
    log "Configurando variables de entorno para producción..."
    
    # Backup del .env actual
    if [[ -f .env ]]; then
        cp .env .env.backup
        log "Backup de .env creado como .env.backup"
    fi
    
    # Copiar configuración de producción
    if [[ -f .env.production ]]; then
        cp .env.production .env
        success "Variables de entorno de producción configuradas"
    else
        error "Archivo .env.production no encontrado"
        exit 1
    fi
}

# Función para instalar dependencias y hacer build
build_project() {
    log "Instalando dependencias..."
    npm ci
    
    log "Ejecutando build para producción..."
    npm run build
    
    # Verificar que el build se generó correctamente
    if [[ ! -d "dist" ]]; then
        error "El directorio dist no se generó. Build falló."
        exit 1
    fi
    
    success "Build completado exitosamente"
}

# Función para hacer deploy a Firebase
deploy_to_firebase() {
    log "Iniciando deployment a Firebase Hosting..."
    
    # Verificar que estamos en el proyecto correcto
    FIREBASE_PROJECT=$(firebase use --current 2>/dev/null || echo "No project set")
    log "Proyecto Firebase actual: $FIREBASE_PROJECT"
    
    if [[ "$FIREBASE_PROJECT" != "maikostudios-a9162" ]]; then
        warning "Configurando proyecto Firebase de producción..."
        firebase use maikostudios-a9162
    fi
    
    # Deploy
    firebase deploy --only hosting
    
    success "Deployment a Firebase completado"
}

# Función para push a repositorio
push_to_repository() {
    log "Enviando cambios al repositorio..."
    
    # Push main branch
    git push origin main
    
    success "Cambios enviados al repositorio"
}

# Función para restaurar entorno de desarrollo
restore_dev_env() {
    log "Restaurando configuración de desarrollo..."
    
    # Restaurar .env de desarrollo
    if [[ -f .env.development ]]; then
        cp .env.development .env
        success "Variables de entorno de desarrollo restauradas"
    fi
    
    # Volver a rama BETA
    git checkout BETA
    log "Regresado a rama BETA"
}

# Función para mostrar resumen final
show_summary() {
    echo ""
    echo "🎉 DEPLOYMENT COMPLETADO EXITOSAMENTE"
    echo "====================================="
    echo ""
    echo "📊 Resumen del deployment:"
    echo "  • Rama desplegada: main"
    echo "  • Proyecto Firebase: maikostudios-a9162"
    echo "  • URL de producción: https://maikostudios-a9162.web.app"
    echo "  • Fecha: $(date +'%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "📋 Próximos pasos recomendados:"
    echo "  1. Verificar que el sitio funcione correctamente"
    echo "  2. Probar funcionalidades críticas (contacto, CV, chatbot)"
    echo "  3. Verificar métricas de rendimiento"
    echo "  4. Notificar al equipo sobre el deployment"
    echo ""
    echo "🔗 Enlaces útiles:"
    echo "  • Sitio web: https://maikostudios-a9162.web.app"
    echo "  • Firebase Console: https://console.firebase.google.com/project/maikostudios-a9162"
    echo "  • Repositorio: https://github.com/maikostudios/maikostudiosWEB"
    echo ""
}

# Función principal
main() {
    echo ""
    echo "🚀 INICIANDO DEPLOYMENT A PRODUCCIÓN"
    echo "===================================="
    echo ""
    
    # Ejecutar pasos del deployment
    check_prerequisites
    check_git_status
    merge_to_main
    setup_production_env
    build_project
    deploy_to_firebase
    push_to_repository
    restore_dev_env
    show_summary
    
    success "¡Deployment a producción completado exitosamente!"
}

# Ejecutar función principal
main "$@"
