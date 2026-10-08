const { getMemoryUsage } = require('./profiler');
const N = 1000000;
const memoriaInicial = getMemoryUsage();

let lat = new Float64Array(N);
let lng = new Float64Array(N);

for (let i = 0; i < N; i++) {
    lat[i] = i * 0.1;
    lng[i] = i * -0.1;
}

const memoriaFinal = getMemoryUsage();
console.log(`[Enfoque Primitivos] Memoria inicial: ${memoriaInicial} MB`);
console.log(`[Enfoque Primitivos] Memoria final: ${memoriaFinal} MB`);
console.log(`[Enfoque Primitivos] Consumo Neto: ${(memoriaFinal - memoriaInicial).toFixed(2)} MB`);