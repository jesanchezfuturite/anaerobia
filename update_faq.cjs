const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/soluciones/pintura-en-polvo.astro');
let code = fs.readFileSync(filePath, 'utf8');

const faqStart = code.indexOf('    <!-- 10. PREGUNTAS FRECUENTES -->');
const normStart = code.indexOf('    <!-- 11. NORMATIVIDAD -->');
let newFaq = code.substring(faqStart, normStart);

const oldFaqStart = code.indexOf('    <!-- 12. FAQ (PREGUNTAS FRECUENTES) -->');
const galeriaStart = code.indexOf('    <!-- 13. GALERÍA DE PROYECTOS -->');

// Modify the new FAQ block
newFaq = newFaq.replace('bg-white px-6 md:px-12', 'bg-industrial-gray px-6 md:px-12');
newFaq = newFaq.replaceAll('bg-industrial-gray rounded-xl', 'bg-white rounded-xl shadow-sm');
newFaq = newFaq.replace('<!-- 10. PREGUNTAS FRECUENTES -->', '<!-- 12. PREGUNTAS FRECUENTES -->');

// Ensure proper spacing before the new FAQ block
newFaq = '\n' + newFaq;

// Reconstruct the file
code = code.substring(0, faqStart) + code.substring(normStart, oldFaqStart) + newFaq + code.substring(galeriaStart);

fs.writeFileSync(filePath, code);
console.log('Successfully moved and updated the FAQ section.');
