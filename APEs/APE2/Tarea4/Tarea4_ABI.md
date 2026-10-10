# Tarea 4: Análisis matemático de rendimiento (ABI)

## 1. Cómo trabaja Node.js con el disco

Node.js ejecuta JavaScript en un solo hilo (V8), con un Event Loop gestionado por **libuv**. Las operaciones sobre archivos pasan por el **Thread Pool** de libuv (4 hilos por defecto), que ejecuta las llamadas al sistema operativo (`open`, `fstat`, `read`).

- **`readFileSync` (bloqueante):** el hilo principal hace la llamada al sistema y se queda detenido hasta que termina. Mientras tanto no se ejecuta nada más.
- **`createReadStream` (flujo):** el Event Loop envía cada `read` a un hilo del pool y sigue libre. Cuando el kernel copia los bytes al buffer, libuv avisa y se dispara el evento `data` con ese fragmento. El tamaño por defecto de cada fragmento (chunk) es de 64 KiB.

## 2. Complejidad espacial

### Lectura síncrona: $S(n) = O(n)$

El archivo completo se guarda como un solo string, y luego `split('\n')` crea un string por cada línea. Si cada línea ocupa $b$ bytes y cada string tiene un costo extra de $c$ bytes (cabecera, puntero), todo queda vivo a la vez:

$$S_{sync}(n) = n \cdot b + n \cdot c \;\Rightarrow\; S_{sync}(n) \in O(n)$$

En este laboratorio $b \approx 28{,}2$ bytes por línea, y el consumo medido fue de unos **64,8 MB** para $n = 10^6$.

### Streams: $S(n) = O(1)$

En cada momento solo existe el fragmento actual, de tamaño fijo $B$, sin importar cuántas líneas tenga el archivo:

$$S_{stream}(n) = B = 64\ \text{KiB} \;\Rightarrow\; S_{stream}(n) \in O(1)$$

El consumo medido fue de entre **0,2 y 2,8 MB**, porque incluye los buffers, objetos temporales y el propio runtime. Pero ese valor no crece con $n$.

### Comparación

$$\frac{S_{sync}}{S_{stream}} \geq \frac{64{,}8\ \text{MB}}{2{,}8\ \text{MB}} \approx 23$$

Y la diferencia crece con $n$: con $10^8$ registros, la lectura síncrona necesitaría unos 6,5 GB y probablemente fallaría por falta de memoria, mientras que el Stream seguiría usando unos pocos MB.

## 3. Complejidad temporal

$$T_{sync}(n) \in O(n), \qquad T_{stream}(n) \in O(n)$$

Ambos enfoques deben recorrer los $n$ registros, así que el orden asintótico del tiempo es igual. La mejora observada (0,07 s frente a 0,18 s) viene de las constantes: el Stream no reserva ni particiona un millón de strings, y cada fragmento cabe en la memoria caché.

## 4. Relación con el uso energético del servidor

| Métrica | Síncrona | Stream |
|---|---|---|
| RAM neta (heapUsed) | ≈ 64,8 MB | 0,2 – 2,8 MB |
| Tiempo | 0,17 – 0,19 s | 0,07 s |
| Pico de RSS | ≈ 149 MB | ≈ 51 MB |
| Pausas del GC | 9 (≈ 84–106 ms en total) | 41 (≈ 8 ms en total) |

- **Menos RAM ocupada:** hay menos memoria que mantener activa y menos objetos que el recolector de basura debe marcar y barrer.
- **Menos pausas largas del GC:** con Streams el GC se activa más veces, pero con limpiezas muy cortas de la generación joven (scavenge). La lectura síncrona acumula pausas largas porque debe limpiar un heap grande.
- **Menos tiempo de CPU a alta carga:** esto se traduce en menos calor y menor gasto térmico del procesador.
- **Acceso secuencial:** es el patrón más eficiente tanto en HDD (sin movimientos del cabezal) como en SSD (lectura por bloques contiguos).
