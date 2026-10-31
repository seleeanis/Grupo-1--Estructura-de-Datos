const { ListaDoblementeEnlazada } = require("./ListaDoble");
const PilaTransaccional = require("./PilaTransaccional");

console.log("=== PRUEBA DE LISTA DOBLE ===");
const historial = new ListaDoblementeEnlazada();
const nodoA = historial.insertarFinal("Evento A");
historial.insertarFinal("Evento B");
const nodoC = historial.insertarFinal("Evento C");

console.log("Siguiente de Evento A:", historial.next(nodoA)?.datos);
console.log("Anterior de Evento C:", historial.prev(nodoC)?.datos);
console.log("Longitud:", historial.longitud);
console.log("Eliminado:", historial.eliminarFinal());
console.log("Longitud después de eliminar:", historial.longitud);

console.log("\n=== PRUEBA DE PILA LIFO ===");
const pila = new PilaTransaccional();
pila.push("Comando 1");
pila.push("Comando 2");
pila.push("Comando 3");

console.log("Tamaño:", pila.obtenerTamano());
console.log("Undo:", pila.pop());
console.log("Undo:", pila.pop());
console.log("Tamaño final:", pila.obtenerTamano());
