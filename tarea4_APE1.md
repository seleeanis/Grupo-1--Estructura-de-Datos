# Tarea 4: Investigación y cálculo de complejidad

## 1. Hidden Classes en V8

V8 no guarda los nombres de las propiedades dentro de cada objeto. Los guarda una sola vez en una **Hidden Class** (internamente un `Map`), y cada objeto solo almacena los valores. Todos los `CoordenadaObj` creados con el mismo constructor comparten el mismo `Map`: `{lat, lng}`, con offsets fijos para cada campo.

Un objeto en el heap de V8 (Node de 64 bits, sin pointer compression) se organiza así:

| Componente | Tamaño |
|---|---|
| Puntero al `Map` (Hidden Class) | 8 B |
| Puntero a `properties` (propiedades fuera del objeto) | 8 B |
| Puntero a `elements` (propiedades indexadas) | 8 B |
| Campo `lat` (in-object) | 8 B |
| Campo `lng` (in-object) | 8 B |
| **Total del objeto** | **40 B** |

**Punto clave:** en versiones recientes de V8, un campo de tipo `double` dentro de un objeto no guarda el número directamente. Guarda un **puntero a un `HeapNumber` mutable** (16 B: puntero a Map + 8 B del valor). Esto se debe a la representación de campos de los Hidden Classes y a que el "double field unboxing" se eliminó con pointer compression.

Fuentes recomendadas (verificar, porque los tamaños exactos dependen de la versión de V8):

- V8 blog: *"Fast properties in V8"* (v8.dev/blog/fast-properties)
- V8 blog: *"Pointer Compression in V8"* (v8.dev/blog/pointer-compression)
- V8 docs: *"Maps (Hidden Classes) in V8"* (v8.dev/docs/hidden-classes)

## 2. Cálculo teórico del espacio

### Enfoque 1 (Objetos)

Por cada coordenada:

$$
s_{obj} = \underbrace{24}_{\text{cabecera}} + \underbrace{2\cdot 8}_{\text{punteros a campos}} + \underbrace{2\cdot 16}_{\text{HeapNumbers}} + \underbrace{8}_{\text{slot en el Array}} = 80 \text{ bytes}
$$

$$
S_{1}(N) = 80N \text{ bytes}, \qquad N = 10^6 \;\Rightarrow\; S_1 = 80\times 10^6 \text{ B} \approx 76.3 \text{ MiB}
$$

El valor medido fue ≈ 91 MB. La diferencia (≈ 15 MB) se explica por el crecimiento dinámico del `Array` con `push` (copias y holgura de capacidad) y por la basura aún no recolectada.

### Enfoque 2 (Typed Arrays)

$$
S_{2}(N) = 2 \cdot N \cdot 8 = 16N \text{ bytes} \;\Rightarrow\; S_2 = 16\times 10^6 \text{ B} \approx 15.3 \text{ MiB}
$$

### Complejidad asintótica

Ambos son lineales:

$$
S_1(N) = 80N \in \Theta(N), \qquad S_2(N) = 16N \in \Theta(N)
$$

Lo que cambia es la **constante multiplicativa**, y por eso la notación asintótica oculta la diferencia:

$$
\frac{S_1(N)}{S_2(N)} = \frac{80N}{16N} = 5
$$

El overhead por registro es:

$$
\frac{80 - 16}{80} = 80\% \text{ de la memoria es metadato (punteros, cabeceras, boxing), no dato útil.}
$$

### Advertencia sobre el Resultado 2

El 0.38 MB medido **no es el costo real** del enfoque 2. `heapUsed` solo mide el heap gestionado por V8, y el `ArrayBuffer` de un `Float64Array` se reserva **fuera del heap** (memoria externa). Los ~16 MB reales no aparecen en la medición. Para que la evidencia sea rigurosa, se puede agregar al `profiler.js`:

```js
const { heapUsed, external, arrayBuffers } = process.memoryUsage();
// Usar (heapUsed + external) o arrayBuffers para el enfoque 2
```

Con eso se observan ≈ 16 MB para el enfoque 2 frente a ≈ 91 MB del enfoque 1, una diferencia real de unas 5.7 veces, que sigue siendo sustancial. También se puede ejecutar con `node --trace-gc` para ver la latencia del recolector.

### Relación con el recolector de basura (GC)

El enfoque 1 crea 3 millones de objetos vivos (1M objetos + 2M HeapNumbers) que el recolector debe recorrer, marcar y copiar (Scavenge, luego Mark-Sweep). El enfoque 2 son 2 objetos para el GC, y el contenido del buffer no se recorre.
