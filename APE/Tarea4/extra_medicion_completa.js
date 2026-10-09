// Medición complementaria: heapUsed + memoria externa (ArrayBuffers).
// Los Typed Arrays guardan sus bytes FUERA del heap de V8 (memoria "external"),
// por eso heapUsed casi no cambia en el Enfoque 2.
function snap() {
  const m = process.memoryUsage();
  const mb = (b) => Math.round(b / 1024 / 1024 * 100) / 100;
  return { heap: mb(m.heapUsed), externa: mb(m.external + 0), buffers: mb(m.arrayBuffers) };
}
const N = 1000000;
const modo = process.argv[2];
if (global.gc) global.gc();
const a = snap();
let datos;
if (modo === 'objetos') {
  class CoordenadaObj { constructor(lat, lng) { this.lat = lat; this.lng = lng; } }
  datos = [];
  for (let i = 0; i < N; i++) datos.push(new CoordenadaObj(i * 0.1, i * -0.1));
} else {
  const lat = new Float64Array(N), lng = new Float64Array(N);
  for (let i = 0; i < N; i++) { lat[i] = i * 0.1; lng[i] = i * -0.1; }
  datos = [lat, lng];
}
if (global.gc) global.gc();
const b = snap();
const vivo = datos.length; // mantiene la referencia viva
const r = (x) => Math.round(x * 100) / 100;
console.log(`[${modo}] Heap neto: ${r(b.heap - a.heap)} MB | ArrayBuffers: ${r(b.buffers - a.buffers)} MB | Total real: ${r((b.heap - a.heap) + (b.buffers - a.buffers))} MB (${vivo} elem.)`);
