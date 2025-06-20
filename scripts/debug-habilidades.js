// Script para debuggear las habilidades duplicadas
const habilidadesPredefinidas = {
  tecnologias: [
    'HTML', 'CSS', 'JavaScript', 'Vue.js', 'React', 'Angular',
    'Node.js', 'Python', 'Java', 'Spring Boot', 'Express.js',
    'TypeScript', 'PHP', 'Laravel', 'Django', 'Flask',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'
  ],
  ia: [
    'LangChain', 'Genkit', 'Prompt Engineering', 'OpenAI API',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Hugging Face',
    'Computer Vision', 'NLP', 'GPT Integration', 'AI Automation'
  ],
  diseno: [
    'Figma', 'Adobe XD', 'Canva', 'Photoshop', 'Illustrator',
    'Sketch', 'InVision', 'Principle', 'Framer', 'UI/UX Design'
  ],
  metodologias: [
    'Scrum', 'Kanban', 'Agile', 'DevOps', 'CI/CD', 'Git',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud'
  ],
  servicios: [
    'Formateo de equipos', 'Cursos de Computación', 'Asesoría Pymes',
    'Desarrollo Web', 'Automatizaciones IA', 'Creación de empresas',
    'Ventas de equipos y seguridad', 'Consultoría tecnológica',
    'Mentorías técnicas', 'Transformación digital'
  ]
}

console.log('🔍 DEBUGGING HABILIDADES DUPLICADAS\n')
console.log('=' .repeat(60))

// Verificar duplicados en cada categoría
Object.entries(habilidadesPredefinidas).forEach(([categoria, skills]) => {
  console.log(`\n📂 Categoría: ${categoria}`)
  console.log(`📊 Total habilidades: ${skills.length}`)
  
  // Buscar duplicados dentro de la categoría
  const duplicados = skills.filter((skill, index) => skills.indexOf(skill) !== index)
  if (duplicados.length > 0) {
    console.log(`❌ Duplicados encontrados: ${duplicados.join(', ')}`)
  } else {
    console.log(`✅ Sin duplicados internos`)
  }
  
  // Mostrar todas las habilidades
  skills.forEach((skill, index) => {
    console.log(`  ${index + 1}. ${skill}`)
  })
})

// Verificar duplicados entre categorías
console.log('\n🔄 VERIFICANDO DUPLICADOS ENTRE CATEGORÍAS')
console.log('=' .repeat(60))

const todasLasHabilidades = []
const skillsVistos = new Map()

Object.entries(habilidadesPredefinidas).forEach(([categoria, skills]) => {
  skills.forEach(skill => {
    if (skillsVistos.has(skill)) {
      console.log(`❌ DUPLICADO ENCONTRADO: "${skill}"`)
      console.log(`   Primera aparición: ${skillsVistos.get(skill)}`)
      console.log(`   Segunda aparición: ${categoria}`)
    } else {
      skillsVistos.set(skill, categoria)
    }
    
    todasLasHabilidades.push({
      title: skill,
      value: skill,
      categoria: categoria
    })
  })
})

console.log(`\n📊 RESUMEN:`)
console.log(`Total habilidades generadas: ${todasLasHabilidades.length}`)
console.log(`Habilidades únicas: ${skillsVistos.size}`)

if (todasLasHabilidades.length === skillsVistos.size) {
  console.log('✅ No hay duplicados entre categorías')
} else {
  console.log('❌ HAY DUPLICADOS ENTRE CATEGORÍAS')
}

// Verificar habilidades específicas que aparecen duplicadas
const habilidadesProblematicas = ['HTML', 'CSS', 'JavaScript', 'Vue.js', 'React', 'Angular']

console.log('\n🎯 VERIFICANDO HABILIDADES PROBLEMÁTICAS:')
console.log('=' .repeat(60))

habilidadesProblematicas.forEach(skill => {
  const apariciones = todasLasHabilidades.filter(h => h.title === skill)
  console.log(`\n🔍 "${skill}":`)
  console.log(`   Apariciones: ${apariciones.length}`)
  apariciones.forEach((aparicion, index) => {
    console.log(`   ${index + 1}. Categoría: ${aparicion.categoria}`)
  })
})

console.log('\n🔧 SIMULANDO COMPUTED PROPERTY:')
console.log('=' .repeat(60))

// Simular la computed property actual
const todasLasHabilidadesComputed = []

Object.entries(habilidadesPredefinidas).forEach(([categoria, skills]) => {
  skills.forEach(skill => {
    todasLasHabilidadesComputed.push({
      title: skill,
      value: skill,
      categoria: categoria
    })
  })
})

console.log(`Resultado computed: ${todasLasHabilidadesComputed.length} habilidades`)

// Contar apariciones de cada habilidad
const conteoHabilidades = {}
todasLasHabilidadesComputed.forEach(h => {
  conteoHabilidades[h.title] = (conteoHabilidades[h.title] || 0) + 1
})

console.log('\n📊 CONTEO DE APARICIONES:')
Object.entries(conteoHabilidades).forEach(([skill, count]) => {
  if (count > 1) {
    console.log(`❌ "${skill}": ${count} veces`)
  }
})

const duplicadosEncontrados = Object.entries(conteoHabilidades).filter(([skill, count]) => count > 1)

if (duplicadosEncontrados.length === 0) {
  console.log('✅ No se encontraron duplicados en la computed property')
} else {
  console.log(`❌ Se encontraron ${duplicadosEncontrados.length} habilidades duplicadas`)
}
