const fs = require('fs');
const path = 'c:\\Users\\roman\\Desktop\\BrandRiders\\src\\style.css';
let s = fs.readFileSync(path, 'utf8');
let opens = (s.match(/\{/g)||[]).length;
let closes = (s.match(/\}/g)||[]).length;
let issues = [];
let stack = [];
let line = 1;
for (let i=0;i<s.length;i++){
  const ch = s[i];
  if (ch === '\n') { line++; continue; }
  if (ch === '{') stack.push({pos:i+1,line});
  else if (ch === '}'){
    if (stack.length === 0) issues.push({type:'extra_closing',line,pos:i+1});
    else stack.pop();
  }
}
stack.forEach(x=>issues.push({type:'unclosed',line:x.line,pos:x.pos}));
console.log('opens',opens,'closes',closes,'issues',issues.length);
issues.slice(0,200).forEach((it,idx)=>console.log(idx+1, it.type, 'line', it.line, 'pos', it.pos));
if (issues.length===0) console.log('All braces matched.');
