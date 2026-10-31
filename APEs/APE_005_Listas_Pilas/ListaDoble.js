/**
 * Nodo de una lista doblemente enlazada.
 */
class NodoDoble {
    constructor(datos) {
        this.datos = datos;
        this.next = null;
        this.prev = null;
    }
}

/**
 * Lista doblemente enlazada para navegación bidireccional.
 */
class ListaDoblementeEnlazada {
    constructor() {
        this.head = null;
        this.tail = null;
        this.longitud = 0;
    }

    // Inserta al final en O(1).
    insertarFinal(datos) {
        const nuevoNodo = new NodoDoble(datos);

        if (!this.head) {
            this.head = nuevoNodo;
            this.tail = nuevoNodo;
        } else {
            this.tail.next = nuevoNodo;
            nuevoNodo.prev = this.tail;
            this.tail = nuevoNodo;
        }

        this.longitud++;
        return nuevoNodo;
    }

    // Elimina el último elemento en O(1).
    eliminarFinal() {
        if (!this.tail) return null;

        const eliminado = this.tail;

        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            this.tail = this.tail.prev;
            this.tail.next = null;
        }

        eliminado.prev = null;
        eliminado.next = null;
        this.longitud--;
        return eliminado.datos;
    }

    next(nodo) {
        return nodo ? nodo.next : null;
    }

    prev(nodo) {
        return nodo ? nodo.prev : null;
    }
}

module.exports = { NodoDoble, ListaDoblementeEnlazada };
