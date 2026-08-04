/* Escaping — the search box is the one place a user's own text is echoed back
   into HTML, so it is the one place an injection could land.
   Run: node test/escaping.test.mjs */
import { esc } from '../js/dom.js';

let pass = 0; const problems = [];
const check = (n, ok, d) => ok ? pass++ : problems.push(n + (d ? ' — ' + d : ''));

const attacks = [
  '<script>alert(1)</script>',
  '"><img src=x onerror=alert(1)>',
  "'; alert(1); //",
  '<svg/onload=alert(1)>',
  '&lt;already escaped&gt;'
];
attacks.forEach((a) => {
  const out = esc(a);
  check('no raw < after esc: ' + a.slice(0, 24), out.indexOf('<') === -1, out);
  check('no raw > after esc: ' + a.slice(0, 24), out.indexOf('>') === -1, out);
  check('no raw " after esc: ' + a.slice(0, 24), out.indexOf('"') === -1, out);
});
check('esc handles null', esc(null) === '' || typeof esc(null) === 'string');
check('esc handles a number', typeof esc(42) === 'string');

console.log(`\nescaping: ${pass} passed, ${problems.length} failed`);
if (problems.length) { problems.forEach((p) => console.log('  FAIL ' + p)); process.exit(1); }
