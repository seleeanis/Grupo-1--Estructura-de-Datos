// Tarea 1 y Tarea 3: Implementación del TDA Lista Enlazada y Recorrido
class Nodo {
    constructor(dato) {
        this.dato = dato; 
        this.siguiente = null; 
    }
}

class ListaSatelital {
    constructor() {
        this.cabeza = null; 
        this.tamaño = 0;    
    }

    prepend(dato) {
        const nuevoNodo = new Nodo(dato);
        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
        } else {
            nuevoNodo.siguiente = this.cabeza;
            this.cabeza = nuevoNodo;
        }
        this.tamaño++;
    }

    // Tarea 3: Método para imprimir la lista 
    imprimirPrimeros(limite) {
        let actual = this.cabeza;
        let contador = 0;
        let salida = "";
        while (actual && contador < limite) {
            salida += `[ID: ${actual.dato.id}] -> `;
            actual = actual.siguiente;
            contador++;
        }
        console.log(salida + "NULL");
    }
}

module.exports = { ListaSatelital };