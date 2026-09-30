// Builds a single self-contained index.html from src/index.html by bundling
// the module script (and three.js) inline. Run: npm install && npm run build
import { readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const src = readFileSync('src/index.html', 'utf8');
const moduleRe = /<script type="module">([\s\S]*?)<\/script>/;
const code = src.match(moduleRe)[1];

const out = await build({
  stdin: { contents: code, resolveDir: '.', loader: 'js' },
  bundle: true, minify: true, format: 'esm', write: false, target: 'es2020', legalComments: 'none',
  alias: { 'three/addons': './node_modules/three/examples/jsm' },
});
const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

const html = src
  .replace(/\s*<script type="importmap">[\s\S]*?<\/script>/, '')
  .replace(moduleRe, () => `<script type="module">${js}</script>`);
writeFileSync('index.html', html);
console.log(`index.html written (${(html.length / 1024).toFixed(0)} KB)`);
