// Tarea 2 y 3: Simulación de Estrés Térmico y Prueba de Recorrido
const { performance } = require('perf_hooks');
const { ListaSatelital } = require('./lab04_lista_simple');

const N = 100000; 
console.log(`[Benchmark] Iniciando inserción de ${N} elementos al INICIO...`);


let arregloHistorial = [];
const startArray = performance.now();
for (let i = 0; i < N; i++) {
    
    arregloHistorial.unshift({ id: i, lat: 10.5, lng: -79.2 }); 
}
const endArray = performance.now();
const timeArray = (endArray - startArray).toFixed(2);
console.log(`[Energía Alta] Arreglo nativo (unshift): ${timeArray} ms`);


let listaHistorial = new ListaSatelital();
const startList = performance.now();
for (let i = 0; i < N; i++) {
  
    listaHistorial.prepend({ id: i, lat: 10.5, lng: -79.2 });
}
const endList = performance.now();
const timeList = (endList - startList).toFixed(2);
console.log(`[Energía Baja] Lista Enlazada (prepend): ${timeList} ms`);

const multiplicador = (timeArray / timeList).toFixed(1);
console.log(`\n[Auditoría Verde] La lista enlazada es ${multiplicador} veces más rápida.`);
console.log(`Ahorro directo de ciclos de CPU y consumo eléctrico en el servidor.`);

console.log(`\n[Prueba de Recorrido] Primeros elementos de la lista enlazada:`);
listaHistorial.imprimirPrimeros(5);