/// <reference types="cypress" />

// Simple E2E test: lead capture flow generates code and shows success

describe('Lead capture wizard', () => {
  it('fills steps and receives code', () => {
    cy.visit('/form-interactivo')

    // Paso 1
    cy.get('input[label="Nombre completo"]').type('Juan Pérez')
    cy.contains('button', 'Siguiente').click()

    // Paso 2 (select first option)
    cy.get('.v-select').first().click()
    cy.get('.v-list-item').first().click()
    cy.contains('button', 'Siguiente').click()

    // Paso 3
    cy.get('input[label="Correo electrónico"]').type('juan@example.com')
    cy.get('input[label="Teléfono"]').type('+56987654321')
    cy.contains('button', 'Siguiente').click()

    // Paso 4
    cy.get('textarea').type('Necesito un sitio web.')
    cy.contains('button', 'Enviar').click()

    // Resultado
    cy.contains('Código de seguimiento').should('exist')
  })
})
