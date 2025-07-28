import { ref, reactive, computed } from 'vue'

// Tipos de validación
export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PHONE: 'phone',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern',
  CUSTOM: 'custom'
}

// Mensajes de error por defecto
const DEFAULT_MESSAGES = {
  required: 'Este campo es requerido',
  email: 'Ingresa un email válido',
  phone: 'Ingresa un teléfono válido',
  minLength: 'Mínimo {min} caracteres',
  maxLength: 'Máximo {max} caracteres',
  pattern: 'Formato inválido'
}

// Patrones de validación comunes
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z\s]+$/,
  numeric: /^\d+$/
}

export function useValidation() {
  
  // Crear regla de validación
  const createRule = (type, options = {}) => {
    return (value) => {
      const result = validateField(value, type, options)
      return result.isValid || result.message
    }
  }
  
  // Validar un campo individual
  const validateField = (value, type, options = {}) => {
    const { message, min, max, pattern, validator } = options
    
    switch (type) {
      case VALIDATION_TYPES.REQUIRED:
        const isValid = value !== null && value !== undefined && value !== ''
        return {
          isValid,
          message: isValid ? '' : (message || DEFAULT_MESSAGES.required)
        }
        
      case VALIDATION_TYPES.EMAIL:
        const emailValid = !value || VALIDATION_PATTERNS.email.test(value)
        return {
          isValid: emailValid,
          message: emailValid ? '' : (message || DEFAULT_MESSAGES.email)
        }
        
      case VALIDATION_TYPES.PHONE:
        const phoneValid = !value || VALIDATION_PATTERNS.phone.test(value.replace(/[\s\-\(\)]/g, ''))
        return {
          isValid: phoneValid,
          message: phoneValid ? '' : (message || DEFAULT_MESSAGES.phone)
        }
        
      case VALIDATION_TYPES.MIN_LENGTH:
        const minValid = !value || value.length >= min
        return {
          isValid: minValid,
          message: minValid ? '' : (message || DEFAULT_MESSAGES.minLength.replace('{min}', min))
        }
        
      case VALIDATION_TYPES.MAX_LENGTH:
        const maxValid = !value || value.length <= max
        return {
          isValid: maxValid,
          message: maxValid ? '' : (message || DEFAULT_MESSAGES.maxLength.replace('{max}', max))
        }
        
      case VALIDATION_TYPES.PATTERN:
        const patternValid = !value || pattern.test(value)
        return {
          isValid: patternValid,
          message: patternValid ? '' : (message || DEFAULT_MESSAGES.pattern)
        }
        
      case VALIDATION_TYPES.CUSTOM:
        if (validator && typeof validator === 'function') {
          const customResult = validator(value)
          return {
            isValid: customResult === true,
            message: customResult === true ? '' : (customResult || 'Valor inválido')
          }
        }
        return { isValid: true, message: '' }
        
      default:
        return { isValid: true, message: '' }
    }
  }
  
  // Crear formulario con validación
  const createForm = (fields = {}) => {
    const formData = reactive({ ...fields })
    const errors = reactive({})
    const touched = reactive({})
    const validationRules = reactive({})
    
    // Agregar reglas de validación
    const addRule = (fieldName, rules) => {
      validationRules[fieldName] = Array.isArray(rules) ? rules : [rules]
    }
    
    // Validar un campo específico
    const validateFieldInForm = (fieldName) => {
      const value = formData[fieldName]
      const rules = validationRules[fieldName] || []
      
      for (const rule of rules) {
        const result = rule(value)
        if (result !== true) {
          errors[fieldName] = result
          return false
        }
      }
      
      errors[fieldName] = ''
      return true
    }
    
    // Validar todo el formulario
    const validateForm = () => {
      let isValid = true
      
      for (const fieldName in validationRules) {
        const fieldValid = validateFieldInForm(fieldName)
        if (!fieldValid) {
          isValid = false
        }
        touched[fieldName] = true
      }
      
      return isValid
    }
    
    // Marcar campo como tocado
    const touchField = (fieldName) => {
      touched[fieldName] = true
    }
    
    // Resetear formulario
    const resetForm = () => {
      for (const key in formData) {
        formData[key] = fields[key] || ''
      }
      for (const key in errors) {
        errors[key] = ''
      }
      for (const key in touched) {
        touched[key] = false
      }
    }
    
    // Computed para verificar si el formulario es válido
    const isFormValid = computed(() => {
      for (const fieldName in validationRules) {
        if (errors[fieldName]) {
          return false
        }
        // Validar campos no tocados
        const value = formData[fieldName]
        const rules = validationRules[fieldName] || []
        for (const rule of rules) {
          if (rule(value) !== true) {
            return false
          }
        }
      }
      return true
    })
    
    // Computed para verificar si hay errores visibles
    const hasVisibleErrors = computed(() => {
      for (const fieldName in errors) {
        if (touched[fieldName] && errors[fieldName]) {
          return true
        }
      }
      return false
    })
    
    return {
      formData,
      errors,
      touched,
      addRule,
      validateField: validateFieldInForm,
      validateForm,
      touchField,
      resetForm,
      isFormValid,
      hasVisibleErrors
    }
  }
  
  // Reglas de validación comunes
  const rules = {
    required: (message) => createRule(VALIDATION_TYPES.REQUIRED, { message }),
    email: (message) => createRule(VALIDATION_TYPES.EMAIL, { message }),
    phone: (message) => createRule(VALIDATION_TYPES.PHONE, { message }),
    minLength: (min, message) => createRule(VALIDATION_TYPES.MIN_LENGTH, { min, message }),
    maxLength: (max, message) => createRule(VALIDATION_TYPES.MAX_LENGTH, { max, message }),
    pattern: (pattern, message) => createRule(VALIDATION_TYPES.PATTERN, { pattern, message }),
    custom: (validator, message) => createRule(VALIDATION_TYPES.CUSTOM, { validator, message })
  }
  
  return {
    createRule,
    validateField,
    createForm,
    rules,
    VALIDATION_TYPES,
    VALIDATION_PATTERNS
  }
}

// Instancia global para usar en toda la app
export const globalValidation = useValidation()
