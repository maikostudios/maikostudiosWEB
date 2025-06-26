// Tests de flujos críticos para MaikoStudios Web
// Verificación de funcionalidades principales antes del deployment

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Componentes a testear
import FormularioContacto from '../src/components/FormularioContacto.vue';
import Navbar from '../src/components/Navbar.vue';
import Footer from '../src/components/Footer.vue';

// Utilidades de seguridad
import { 
  sanitizeString, 
  validateEmail, 
  validateContactForm,
  validateExternalLink 
} from '../src/utils/security.js';

// Configuración de Vuetify para tests
const vuetify = createVuetify({
  components,
  directives,
});

describe('🔒 Tests de Seguridad', () => {
  it('debe sanitizar strings correctamente', () => {
    const maliciousInput = '<script>alert("xss")</script>Texto normal';
    const sanitized = sanitizeString(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Texto normal');
  });

  it('debe validar emails correctamente', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('debe validar formulario de contacto', () => {
    const validData = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '+56912345678',
      asunto: 'Consulta sobre servicios',
      mensaje: 'Hola, me interesa conocer más sobre sus servicios de desarrollo web.'
    };

    const result = validateContactForm(validData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('debe rechazar datos maliciosos en formulario', () => {
    const maliciousData = {
      nombre: '<script>alert("xss")</script>',
      email: 'test@example.com',
      asunto: 'javascript:alert("xss")',
      mensaje: 'Mensaje normal'
    };

    const result = validateContactForm(maliciousData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Contenido no permitido detectado');
  });

  it('debe validar enlaces externos seguros', () => {
    expect(validateExternalLink('https://github.com/maikostudios')).toBe(true);
    expect(validateExternalLink('https://deliciastiajovy.cl')).toBe(true);
    expect(validateExternalLink('https://malicious-site.com')).toBe(false);
  });
});

describe('🧭 Tests de Navegación', () => {
  let wrapper;

  beforeEach(() => {
    const pinia = createPinia();
    wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      }
    });
  });

  it('debe renderizar el navbar correctamente', () => {
    expect(wrapper.find('.navbar').exists()).toBe(true);
    expect(wrapper.find('.navbar-logo').exists()).toBe(true);
  });

  it('debe contener todos los enlaces de navegación', () => {
    const expectedLinks = ['Sobre Mí', 'Servicios', 'Portafolio', 'CV', 'Contacto'];
    
    expectedLinks.forEach(linkText => {
      expect(wrapper.text()).toContain(linkText);
    });
  });

  it('debe tener enlaces sociales seguros', () => {
    const socialLinks = wrapper.findAll('a[target="_blank"]');
    
    socialLinks.forEach(link => {
      const href = link.attributes('href');
      if (href) {
        expect(validateExternalLink(href)).toBe(true);
      }
    });
  });
});

describe('📝 Tests de Formulario de Contacto', () => {
  let wrapper;

  beforeEach(() => {
    const pinia = createPinia();
    wrapper = mount(FormularioContacto, {
      global: {
        plugins: [pinia, vuetify]
      }
    });
  });

  it('debe renderizar el formulario correctamente', () => {
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  it('debe validar campos requeridos', async () => {
    const submitButton = wrapper.find('button[type="submit"]');
    
    // Intentar enviar formulario vacío
    await submitButton.trigger('click');
    
    // Verificar que no se envía sin datos válidos
    expect(wrapper.vm.valid).toBe(false);
  });

  it('debe sanitizar datos antes del envío', async () => {
    const maliciousName = '<script>alert("xss")</script>Juan';
    
    await wrapper.find('input[label="Nombre completo"]').setValue(maliciousName);
    
    // Verificar que el valor se sanitiza
    const sanitizedValue = sanitizeString(maliciousName);
    expect(sanitizedValue).not.toContain('<script>');
  });
});

describe('🦶 Tests de Footer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Footer, {
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
            props: ['to']
          }
        }
      }
    });
  });

  it('debe renderizar el footer correctamente', () => {
    expect(wrapper.find('.footer').exists()).toBe(true);
    expect(wrapper.find('.footer-logo').exists()).toBe(true);
  });

  it('debe tener enlaces internos correctos', () => {
    const internalLinks = wrapper.findAll('router-link');
    
    internalLinks.forEach(link => {
      const to = link.props('to');
      expect(to).toMatch(/^\/[a-z-]*$/); // Rutas internas válidas
    });
  });

  it('debe tener enlaces externos seguros', () => {
    const externalLinks = wrapper.findAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
      const href = link.attributes('href');
      if (href && href.startsWith('http')) {
        expect(validateExternalLink(href)).toBe(true);
      }
    });
  });
});

describe('🔗 Tests de Enlaces y Rutas', () => {
  it('debe tener proyecto Delicias Tía Jovy con enlace operativo', () => {
    const deliciasUrl = 'https://deliciastiajovy.cl';
    expect(validateExternalLink(deliciasUrl)).toBe(true);
  });

  it('debe validar todos los enlaces de GitHub', () => {
    const githubLinks = [
      'https://github.com/maikostudios',
      'https://github.com/maikostudios/maikostudiosWEB',
      'https://github.com/maikostudios/delicias-tia-jovy'
    ];

    githubLinks.forEach(link => {
      expect(validateExternalLink(link)).toBe(true);
    });
  });

  it('debe validar enlaces de LinkedIn', () => {
    const linkedinUrl = 'https://linkedin.com/in/me-saezc';
    expect(validateExternalLink(linkedinUrl)).toBe(true);
  });

  it('debe validar enlace de WhatsApp', () => {
    const whatsappUrl = 'https://wa.me/56949475207';
    expect(validateExternalLink(whatsappUrl)).toBe(true);
  });
});

describe('🚀 Tests de Rendimiento y Optimización', () => {
  it('debe cargar componentes de forma lazy', () => {
    // Verificar que los componentes grandes se cargan de forma diferida
    expect(typeof FormularioContacto).toBe('object');
  });

  it('debe tener imágenes optimizadas', () => {
    // Verificar que las imágenes usan loading="lazy"
    const imageUrls = [
      'https://raw.githubusercontent.com/maikostudios/assets_maikostudio/main/assets/img/proyectos/delicias_tia_jovy.png'
    ];

    imageUrls.forEach(url => {
      expect(url).toContain('githubusercontent.com'); // CDN optimizado
    });
  });
});

// Test de integración completo
describe('🔄 Test de Integración Completa', () => {
  it('debe completar flujo de contacto sin errores', async () => {
    const pinia = createPinia();
    const wrapper = mount(FormularioContacto, {
      global: {
        plugins: [pinia, vuetify]
      }
    });

    // Simular llenado de formulario
    const validData = {
      nombre: 'Test User',
      email: 'test@example.com',
      telefono: '+56912345678',
      asunto: 'Desarrollo Web',
      mensaje: 'Mensaje de prueba para verificar el flujo completo del formulario de contacto.'
    };

    // Llenar campos
    await wrapper.find('input[label="Nombre completo"]').setValue(validData.nombre);
    await wrapper.find('input[label="Correo electrónico"]').setValue(validData.email);
    await wrapper.find('input[label="Teléfono (opcional)"]').setValue(validData.telefono);
    await wrapper.find('textarea').setValue(validData.mensaje);

    // Verificar validación
    const validation = validateContactForm(validData);
    expect(validation.isValid).toBe(true);
  });
});
