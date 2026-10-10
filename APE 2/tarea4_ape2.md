# Tarea 4: Análisis Matemático de Rendimiento (ABI)

Basado en los resultados empíricos, los estudiantes investigarán el diseño del bus de datos y el *Thread Pool* interno (`libuv`) que gestiona estas llamadas.

* Demuestre teóricamente (utilizando notación de orden asintótico) por qué la función bloqueante impone $S(n) = O(n)$ frente al enfoque *Stream* $S(n) = O(1)$.

---

### Demostración Teórica Asintótica de Complejidad Espacial ($S(n)$)

#### Lectura Síncrona ($S(n) = O(n)$):
En cuanto a la función de `fs.readFileSync`, esta carga el archivo en un búfer continuo en el *heap*, y `split('\n')` genera un arreglo el cual contiene $n$ referencias de texto simultáneas.

$$\text{Memoria requerida: } S(n) \approx c \cdot n$$

Es por eso que al momento la memoria crece de forma directamente proporcional a la cantidad de datos, existe una constante $c > 0$ tal que $S(n) \le c \cdot n$, demostrando que $S(n) \in O(n)$.

#### Lectura por Streams ($S(n) = O(1)$):
En cuanto a la función de `fs.createReadStream`, la biblioteca interna `libuv` gestiona la transferencia en pequeños fragmentos acotados (*chunks* de $64\text{ KB}$ por defecto) mediante su *Thread Pool*, por lo que un solo fragmento reside en memoria a la vez; se procesa y se descarta.

$$\text{Memoria requerida: } S(n) \le K \quad (\text{donde } K = 64\text{ KB} \text{ es constante})$$

Por lo que dado el uso de RAM no varía con el número de registros $n$, se demuestra que $S(n) \in O(1)$.

---

* Estructure su respuesta relacionándola con el uso energético del servidor (menos RAM implica menor recolección de basura y menor gasto térmico del procesador).

**Impacto en el Procesador:** En cuanto a la lectura síncrona, esta satura la memoria *Heap*, por lo que fuerza ciclos continuos del *Garbage Collector*, los cuales suspenden la ejecución del hilo principal. Estos ciclos adicionales elevan el uso de la CPU al 100%, aumentando la disipación térmica por efecto Joule y el consumo de energía en vatios.

**Eficiencia Energética:** En cuanto al enfoque de *Streams*, este mantiene un consumo plano de RAM, por lo que, al reciclar fragmentos efímeros de manera casi inmediata, el recolector de basura apenas interviene. Esto evita el sobrecalentamiento del procesador y reduce la huella de carbono del servidor bajo principios de *Green Computing*.