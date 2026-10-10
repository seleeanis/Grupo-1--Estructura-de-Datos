const fs = require('fs');
const { performance } = require('perf_hooks');
const FILE_NAME = 'coordenadas_masivas.csv';
console.log(`[Lectura por Stream] Iniciando procesamiento...`);
const memoryBefore = process.memoryUsage().heapUsed;
const start = performance.now();
let totalRegistros = 0;
// Creamos un flujo de lectura secuencial no bloqueante
const readableStream = fs.createReadStream(FILE_NAME, { encoding: 'utf-8' });
readableStream.on('data', (chunk) => {
/*
CRITERIO DE SUSTENTABILIDAD COMPUTACIONAL / GARBAGE COLLECTOR:
Se coloca el comentario en este apartado debido a que aquí es donde se ahorran
los ciclos del Garbage Collector. Dado que el búfer "chunk" (por defecto de 64 KB)
tiene un ciclo de vida acotado al alcance de esta función, al finalizar este bloque
"chunk" pierde su referencia en el scope local y queda marcado inmediatamente 
como recolectable en el New Space del motor V8. Esto evita que se acumulen datos 
en el Heap dentro del Old Space, eliminando pausas globales de tipo "Stop-the-World" 
y reduciendo la carga térmica y el consumo energético de la CPU.
*/
// Procesamos el chunk de datos actual sin almacenarlo completo
// Contamos cuántos saltos de línea hay en este fragmento
let lineBreakCount = (chunk.match(/\n/g) || []).length;
totalRegistros += lineBreakCount;
});
readableStream.on('end', () => {
const end = performance.now();
const memoryAfter = process.memoryUsage().heapUsed;
console.log(`[Lectura por Stream] Total registros procesados: ${totalRegistros}
`);
console.log(`[Lectura por Stream] Tiempo de I/O parcializado: ${((end - start) / 
1000).toFixed(2)} segundos.`);
console.log(`[Lectura por Stream] Consumo Neto de RAM: ${((memoryAfter - 
memoryBefore) / 1024 / 1024).toFixed(2)} MB`);
});

/*
Resultados de la ejecución:
[Lectura por Stream] Iniciando procesamiento... 
[Lectura por Stream] Total registros procesados: 1000001
[Lectura por Stream] Tiempo de I/O parcializado: 0.05 segundos.
[Lectura por Stream] Consumo Neto de RAM: 0.75 MB
*/