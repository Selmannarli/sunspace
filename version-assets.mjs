import fs from 'node:fs';
const version='20260915-map2';
let html=fs.readFileSync('index.html','utf8');
html=html.replace(/href="modern\.css(?:\?[^\"]*)?"/,`href="modern.css?v=${version}"`).replace(/src="app\.js(?:\?[^\"]*)?"/,`src="app.js?v=${version}"`);
fs.writeFileSync('index.html',html);
let app=fs.readFileSync('app.js','utf8').replace(/from '\.\/area-map\.js(?:\?[^']*)?'/,`from './area-map.js?v=${version}'`).replace(/from '\.\/model\.js(?:\?[^']*)?'/,`from './model.js?v=${version}'`);
fs.writeFileSync('app.js',app);
