# Tarea 4: Análisis Matemático de Rendimiento (ABI)

## 1. Resultados empíricos

| Métrica | Lectura síncrona (`readFileSync`) | Lectura por Stream (`createReadStream`) |
|---|---|---|
| Registros leídos | 1 000 001 | 1 000 001 |
| Tiempo | 0.14 s | 0.07 s |
| Consumo neto de RAM (heap) | 64.75 MB | 0.74 MB |
| Tamaño del archivo | 26.86 MB | 26.86 MB |

**Comparación**

- El enfoque síncrono usa unas **87 veces más memoria** que el stream (64.75 MB frente a 0.74 MB).
- El consumo del síncrono es **mayor que el propio archivo** (64.75 MB frente a 26.86 MB), porque además del texto completo se crea el arreglo de 1 000 001 strings.
- El stream consume un valor casi nulo, que no depende del tamaño del archivo.
- En tiempo, el stream fue 2 veces más rápido (0.07 s frente a 0.14 s). Esta diferencia no es estrictamente comparable, porque el síncrono también ejecuta `split('\n')` y el stream solo cuenta saltos de línea.
- Los 1 000 001 registros incluyen la línea de cabecera (1 000 000 de coordenadas + 1 de cabecera).

> Nota: `process.memoryUsage().heapUsed` mide el heap de V8. Los *chunks* y el `Buffer` interno viven en memoria externa, por lo que el valor del stream refleja los objetos JS, no el buffer de 64 KB.

## 2. Demostración asintótica

Sea *n* el número de registros y *c* ≈ 28 bytes el tamaño promedio de cada uno. El archivo pesa B = c·n bytes.

### 2.1 Lectura bloqueante: S(n) = O(n)

1. `fs.readFileSync(FILE_NAME, 'utf-8')` detiene el hilo principal hasta cargar el archivo completo. Reserva un `Buffer` de c·n bytes y lo convierte en un string de c·n caracteres.
2. `data.split('\n')` crea un arreglo de n + 1 elementos, y cada elemento es un string con su cabecera de objeto en el heap, de tamaño constante c' > 0.
3. Mientras `data` y `lineas` sigan referenciados, todo permanece vivo a la vez:

   S(n) ≥ c·n y S(n) ≤ (c + c')·n + O(1)

4. Por definición de Θ, existen constantes positivas k₁ y k₂ tales que k₁·n ≤ S(n) ≤ k₂·n para todo n suficientemente grande. Por lo tanto:

   **S(n) = Θ(n) = O(n)**

### 2.2 Lectura por Stream: S(n) = O(1)

1. `createReadStream` lee el archivo en *chunks* de tamaño fijo k (`highWaterMark`, 64 KB por defecto en `fs`), sin importar el tamaño del archivo.
2. En cada instante solo existen en memoria:
   - un chunk actual (≤ k),
   - el arreglo temporal que genera `match` (acotado por k),
   - el contador `totalRegistros` (un número).
3. Como el código **no acumula** los chunks:

   S(n) ≤ k + O(1) = constante

4. Como k no depende de n:

   **S(n) = O(1)**

> Si el código hiciera `arreglo.push(chunk)`, los chunks quedarían referenciados y la complejidad volvería a ser O(n). El O(1) depende de **no retener** los datos procesados.

### 2.3 Complejidad temporal

Ambos enfoques deben leer los n registros, así que **T(n) = Θ(n)** en los dos. La diferencia real está en el espacio y en el bloqueo:

- El enfoque síncrono **bloquea el Event Loop** durante toda la lectura.
- El stream delega la lectura a un hilo del **Thread Pool de libuv** (4 hilos por defecto), que ejecuta la syscall `read()` en el sistema operativo. El Event Loop queda libre entre chunks y recibe una notificación cuando cada fragmento está listo.

| Aspecto | `readFileSync` | `createReadStream` |
|---|---|---|
| Espacio S(n) | O(n) | O(1) |
| Tiempo T(n) | Θ(n) | Θ(n) |
| Bloqueo del Event Loop | Sí | No |
| Riesgo de *out of memory* al crecer n | Alto | Nulo |

## 3. Relación con el uso energético (Green Computing)

1. **Menos recolección de basura.** Con O(n) de memoria viva, el heap crece y V8 ejecuta recolecciones *Mark-Sweep* costosas sobre millones de objetos. Con el stream, cada chunk queda sin referencias al terminar el callback y se libera en recolecciones menores (*Scavenge*), que son muy baratas.
2. **Menos CPU y menos calor.** Menos tiempo de GC implica menos ciclos de CPU activos, lo que reduce el consumo eléctrico y el gasto térmico del procesador. Esto a su vez reduce la demanda de enfriamiento del servidor.
3. **Menos RAM ocupada.** Una menor huella de memoria disminuye la energía de refresco de la DRAM y los fallos de caché y de página.
4. **Mejor aprovechamiento en la nube.** Un proceso con S(n) = O(1) cabe en contenedores pequeños y baratos. El enfoque O(n) obliga a sobredimensionar la memoria, o termina con *out of memory* cuando n crece.
5. **Acceso secuencial al disco.** La lectura secuencial por chunks aprovecha el *read-ahead* del sistema operativo y reduce los movimientos del cabezal en un HDD y las operaciones aleatorias en un SSD, con menos energía por byte leído.

**Conclusión:** el stream mantiene una huella de memoria plana, independiente de n. Eso reduce el trabajo del GC, el consumo de CPU y el gasto térmico, por lo que es la opción más sostenible desde el punto de vista del Green Computing.
