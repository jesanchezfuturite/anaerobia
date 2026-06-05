const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/nosotros.astro',
  'src/pages/soluciones/pintura-liquida.astro',
  'src/pages/soluciones/pintura-en-polvo.astro'
];

for (const relPath of files) {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const query = 'Explora otras Especialidades de Ingeniería';
  const queryIdx = content.indexOf(query);
  
  if (queryIdx === -1) {
    console.log(`Not found in ${relPath}`);
    continue;
  }
  
  // Find the opening <section tag before the query
  const sectionStart = content.lastIndexOf('<section', queryIdx);
  // See if there's a comment right above the section like <!-- ... -->
  const commentStart = content.lastIndexOf('<!--', sectionStart);
  
  let removeStart = sectionStart;
  if (commentStart !== -1 && sectionStart - commentStart < 150) {
      removeStart = commentStart;
  }
  
  // expand backwards to start of line
  while(removeStart > 0 && content[removeStart-1] !== '\n') {
      removeStart--;
  }

  // Find closing </section> after query
  const sectionEnd = content.indexOf('</section>', queryIdx);
  let removeEnd = sectionEnd + '</section>'.length;
  
  // remove trailing newline if any
  if (content[removeEnd] === '\n') {
      removeEnd++;
  }
  
  content = content.substring(0, removeStart) + content.substring(removeEnd);
  fs.writeFileSync(filePath, content);
  console.log(`Removed section from ${relPath}`);
}
