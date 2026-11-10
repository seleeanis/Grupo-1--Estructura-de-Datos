const PilaTransaccional = require('./PilaTransaccional');

function obtenerMemoriaMB() {
  return (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
}

const N = 500000;
console.log(`=== BENCHMARK DE RENDIMIENTO (N = ${N}) ===\n`);

// 1. EVALUACIÓN CON ARREGLO TRADICIONAL (unshift / shift)
if (global.gc) global.gc();
const memInicialArray = process.memoryUsage().heapUsed;
console.time('Tiempo Array Nativo (unshift/shift)');

const arregloNativo = [];
for (let i = 0; i < N; i++) {
  arregloNativo.unshift({ id: i, log: 'Evento Satelital' }); // O(n)
}
for (let i = 0; i < N; i++) {
  arregloNativo.shift(); // O(n)
}

console.timeEnd('Tiempo Array Nativo (unshift/shift)');
const memFinalArray = process.memoryUsage().heapUsed;
const deltaMemArray = ((memFinalArray - memInicialArray) / 1024 / 1024).toFixed(2);
console.log(`Impacto de Memoria Heap Array: ${deltaMemArray} MB\n`);

// 2. EVALUACIÓN CON PILA DE PUNTEROS DINÁMICOS
if (global.gc) global.gc();
const memInicialPila = process.memoryUsage().heapUsed;
console.time('Tiempo Pila Transaccional O(1)');

const pilaSatelital = new PilaTransaccional();
for (let i = 0; i < N; i++) {
  pilaSatelital.push({ id: i, log: 'Evento Satelital' }); // O(1)
}
for (let i = 0; i < N; i++) {
  pilaSatelital.pop(); // O(1)
}

console.timeEnd('Tiempo Pila Transaccional O(1)');
const memFinalPila = process.memoryUsage().heapUsed;
const deltaMemPila = ((memFinalPila - memInicialPila) / 1024 / 1024).toFixed(2);
console.log(`Impacto de Memoria Heap Pila: ${deltaMemPila} MB\n`);

// Resultados finales
/*
=== BENCHMARK DE RENDIMIENTO (N = 500000) ===

Tiempo Array Nativo (unshift/shift): 6:21.082 (m:ss.mmm)
Impacto de Memoria Heap Array: 30.11 MB

Tiempo Pila Transaccional O(1): 84.152ms
Impacto de Memoria Heap Pila: 12.37 MB

*/