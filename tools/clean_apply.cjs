const fs = require('fs');
const p = 'c:\\Users\\roman\\Desktop\\BrandRiders\\src\\style.css';
let s = fs.readFileSync(p,'utf8');
let lines = s.split('\n');
let changed = 0;
for (let i=0;i<lines.length;i++){
  if (lines[i].includes('@apply') && lines[i].includes('!important')){
    const before = lines[i];
    // remove '!important' occurrences within this line
    lines[i] = lines[i].replace(/\s*!important/g, '');
    if (lines[i] !== before) changed++;
  }
}
if (changed>0){
  fs.writeFileSync(p, lines.join('\n'));
}
console.log('Processed', changed, 'lines');
