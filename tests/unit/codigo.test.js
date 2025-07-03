import { expect, test } from 'vitest'
import { generateTrackingCode } from '@/services/firestoreService'

import { expect, test } from 'vitest'

test('genera código MAIKO-XXXX', () => {
  const codigo = generateTrackingCode()
  expect(codigo).toMatch(/MAIKO-\d{4}/)
})
