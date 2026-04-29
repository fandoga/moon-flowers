const fs = require('fs');
const path = 'C:/Frontend/moon-flovers/moon-flowers/src/components/ui/logo.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace('if (burst && !prevMaxed.current)', 'if (isMaxed && !prevMaxed.current)');
fs.writeFileSync(path, content, 'utf8');
console.log('FIXED');
