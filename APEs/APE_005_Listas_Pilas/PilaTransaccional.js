const { ListaDoblementeEnlazada } = require("./ListaDoble");

/**
 * Pila LIFO de comandos satelitales.
 * push() y pop() trabajan en O(1).
 */
class PilaTransaccional {
    constructor() {
        this.lista = new ListaDoblementeEnlazada();
    }

    push(comando) {
        return this.lista.insertarFinal(comando);
    }

    pop() {
        return this.lista.eliminarFinal();
    }

    obtenerTamano() {
        return this.lista.longitud;
    }
}

module.exports = PilaTransaccional;
