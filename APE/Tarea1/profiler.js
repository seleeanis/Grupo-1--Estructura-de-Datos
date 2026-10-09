/**
 * Tarea 1: Utilidad para medir la memoria Heap en Megabytes (MB).
 * El Heap es el espacio de memoria dinámico donde V8 almacena objetos y variables.
 */

//Emily Salas

function getMemoryUsage() {
  const memoryData = process.memoryUsage();
  // Convertimos de bytes a Megabytes (MB)
  const heapUsedMB = Math.round(memoryData.heapUsed / 1024 / 1024 * 100) / 100;
  return heapUsedMB;
}

module.exports = { getMemoryUsage };
