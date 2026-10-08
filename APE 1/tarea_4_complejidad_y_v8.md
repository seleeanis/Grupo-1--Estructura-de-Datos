### Tarea 4: Investigación y Cálculo de Complejidad

Basado en los resultados, el estudiante debe aplicar ABI para investigar el porqué de la diferencia matemática.

#### 1. Busque en la documentación oficial de V8 cómo se empaquetan las propiedades en los *Hidden Classes* de JavaScript.

**Respuesta:**

Según la información oficial de la documentación del motor V8, por lo leído las propiedades no se almacenan como tablas hash por instancia, sino que va dividiendo la estructura de los valores:

* **Las estructuras principales son:**
  * **Map:** viene a ser la clase oculta y es el primer valor del puntero en un objeto lo cual hace que se facilite la comparación para ver si dos objetos tienen la misma clase.
  * **DescriptorArray:** es una lista completa de las propiedades que llega a tener la clase junto con la información de ellas, por lo que también hay casos en los que el valor de la propiedad está uniforme dentro de este conjunto (quiere decir que todos los objetos que comparten la clase oculta tienen exactamente el mismo valor constante para esa propiedad).
  * **TransitionArray:** es un array de "transiciones" desde este Map a otros Maps relacionados. Cada transición es un nombre de propiedad y debería considerarse como "si agregara una propiedad con este nombre a la clase actual, ¿a qué clase haría la transición?".

---

#### 2. Calcule teóricamente en LaTeX el espacio asintótico. Sabiendo que un `Float64` pesa 8 bytes, demuestre por qué.

*Demostración Asintótica.*

##### a) Cálculo de Espacio Teórico:
Cada valor de tipo punto flotante de doble precisión según la norma IEEE 754 ocupa $64\text{ bits} = 8\text{ bytes}$. Dado que cada coordenada requiere latitud y longitud:

$$\text{Espacio Base} = 2 \times 10^6 \times 8\text{ bytes} = 16\,000\,000\text{ bytes} \approx 15{,}26\text{ MiB}.$$

El arreglo tipado `Float64Array` almacena el bloque contiguo con una dispersión casi nula respecto al límite teórico.

##### b) Complejidad Asintótica $S(n)$ y Constantes Multiplicativas:
Formalmente, ambos enfoques pertenecen a la misma clase de complejidad espacial asintótica:

$$S_{\text{objetos}}(n) \in \mathcal{O}(n) \quad\text{y}\quad S_{\text{primitivos}}(n) \in \mathcal{O}(n).$$

Sin embargo, sus constantes ocultas difieren por un orden de magnitud:

$$S_{\text{objetos}}(n) = c_1 \cdot n + k_1, \qquad S_{\text{primitivos}}(n) = c_2 \cdot n + k_2, \qquad \text{donde } c_1 \gg c_2.$$

La disparidad surge porque cada instancia de objeto en el motor V8 reserva un encabezado de objeto (*Map/Hidden Class pointer*), una tabla de propiedades en línea y punteros en el arreglo dinámico principal, cuadruplicando la huella de memoria física en el Heap.