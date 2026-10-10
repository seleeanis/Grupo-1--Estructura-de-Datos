// Medición complementaria: pico de memoria (RSS y heap) y número de pausas del GC.
// Uso: node extra_medicion_gc.js sync | stream
const fs = require('fs');
const { performance, PerformanceObserver } = require('perf_hooks');
const FILE_NAME = 'coordenadas_masivas.csv';
const modo = process.argv[2];
let pausas = 0, msGC = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) { pausas++; msGC += e.duration; } }).observe({ entryTypes: ['gc'] });
let pico = 0;
const muestreo = setInterval(() => { pico = Math.max(pico, process.memoryUsage().rss); }, 5);
const mb = (b) => (b / 1024 / 1024).toFixed(2);
const t0 = performance.now();
function fin(total) {
  clearInterval(muestreo);
  pico = Math.max(pico, process.memoryUsage().rss);
  setTimeout(() => console.log(`[${modo}] registros: ${total} | tiempo: ${((performance.now() - t0) / 1000).toFixed(2)} s | pico RSS: ${mb(pico)} MB | pausas GC: ${pausas} (${msGC.toFixed(1)} ms)`), 50);
}
if (modo === 'sync') {
  const lineas = fs.readFileSync(FILE_NAME, 'utf-8').split('\n');
  fin(lineas.length - 1);
} else {
  let total = 0;
  fs.createReadStream(FILE_NAME, { encoding: 'utf-8' })
    .on('data', (c) => { total += (c.match(/\n/g) || []).length; })
    .on('end', () => fin(total));
}
