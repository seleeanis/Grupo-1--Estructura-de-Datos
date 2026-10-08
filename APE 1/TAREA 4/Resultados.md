# Hidden Classes en V8

El motor V8 no almacena los nombres de las propiedades (`lat`, `lng`) dentro de cada objeto. Para ello utiliza las **Hidden Classes** (*Maps*), estructuras internas que describen la forma de un objeto: qué propiedades tiene, en qué orden y en qué posición de memoria se encuentra cada una. Todos los objetos creados con el mismo constructor y con las propiedades en el mismo orden comparten el mismo *Map*, lo que acelera el acceso a sus propiedades.

Esta optimización tiene un costo en memoria. Cada instancia requiere una cabecera propia (puntero al *Map* y punteros auxiliares), y los valores decimales `lat` y `lng` suelen almacenarse como objetos independientes (*HeapNumber*). Como resultado, un registro que teóricamente requiere $16$ bytes ocupa cerca de $94$ bytes en la práctica.

Por el contrario, un `Float64Array` reserva un único bloque contiguo en el que cada elemento ocupa exactamente $8$ bytes, sin cabeceras ni punteros por elemento.

---

## Cálculo del espacio asintótico

### Arreglo de objetos

Si cada registro ocupa $c_{obj}$ bytes, el consumo neto medido ($89.2$ MB para $n = 10^6$) permite estimar el costo por registro:

$$S_{obj}(n) = n \cdot c_{obj}$$

$$c_{obj} \approx \frac{89.2 \cdot 1048576}{10^6} \approx 93.5 \text{ B}$$

### Arreglos tipados

Se emplean dos `Float64Array` de $n$ elementos, y cada elemento ocupa $8$ bytes ($64$ bits):

$$S_{prim}(n) = 2 \cdot n \cdot 8 = 16n \text{ B}$$

Para $n = 10^6$ se obtiene:

$$S_{prim}(10^6) = 16 \cdot 10^6 \text{ B} = 16 \text{ MB}$$

### Relación entre ambos enfoques

Al dividir el costo por registro de los objetos entre el de los arreglos tipados:

$$\frac{S_{obj}}{S_{prim}} = \frac{93.5}{16} \approx 5.8$$

### Complejidad asintótica

Ambos enfoques crecen de forma lineal con respecto a $n$:

$$S_{obj}(n) \in O(n), \qquad S_{prim}(n) \in O(n)$$

La diferencia entre ellos no está en el orden de crecimiento, sino en la **constante multiplicativa**, que la notación Big-O no refleja.

---

## Tabla comparativa de consumo de memoria

| Enfoque | Memoria inicial (MB) | Memoria final (MB) | Consumo neto (MB) | Bytes por registro |
|---|---|---|---|---|
| Arreglo de objetos (`CoordenadaObj`) | $3.04$ | $92.24$ | $89.20$ | $93.5\text{ B}$ |
| `Float64Array` paralelos (`lat`, `lng`) | $3.04$ | $3.56$ | $0.52$ | $16\text{ B}$ |
| **Relación objetos / primitivos** | | | $\approx 148\times$ | $\approx 5.8\times$ |