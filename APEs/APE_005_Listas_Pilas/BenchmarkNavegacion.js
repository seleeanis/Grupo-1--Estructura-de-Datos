const PilaTransaccional = require("./PilaTransaccional");

function obtenerMemoriaMB() {
    return (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
}

const N = 500000;
console.log(`=== BENCHMARK DE RENDIMIENTO (N = ${N}) ===\n`);

// 1. Arreglo nativo: unshift() y shift().
if (global.gc) global.gc();
const memInicialArray = process.memoryUsage().heapUsed;
console.time("Tiempo Array Nativo (unshift/shift)");

const arregloNativo = [];
for (let i = 0; i < N; i++) {
    arregloNativo.unshift({ id: i, log: "Evento Satelital" });
}
for (let i = 0; i < N; i++) {
    arregloNativo.shift();
}

console.timeEnd("Tiempo Array Nativo (unshift/shift)");
const memFinalArray = process.memoryUsage().heapUsed;
const deltaMemArray = ((memFinalArray - memInicialArray) / 1024 / 1024).toFixed(2);
console.log(`Impacto de Memoria Heap Array: ${deltaMemArray} MB\n`);

// 2. Pila enlazada: push() y pop().
if (global.gc) global.gc();
const memInicialPila = process.memoryUsage().heapUsed;
console.time("Tiempo Pila Transaccional O(1)");

const pilaSatelital = new PilaTransaccional();
for (let i = 0; i < N; i++) {
    pilaSatelital.push({ id: i, log: "Evento Satelital" });
}
for (let i = 0; i < N; i++) {
    pilaSatelital.pop();
}

console.timeEnd("Tiempo Pila Transaccional O(1)");
const memFinalPila = process.memoryUsage().heapUsed;
const deltaMemPila = ((memFinalPila - memInicialPila) / 1024 / 1024).toFixed(2);
console.log(`Impacto de Memoria Heap Pila: ${deltaMemPila} MB\n`);
console.log(`Memoria Heap actual: ${obtenerMemoriaMB()} MB`);
console.log("Nota: los resultados dependen del equipo y de la versión de Node.js.");
