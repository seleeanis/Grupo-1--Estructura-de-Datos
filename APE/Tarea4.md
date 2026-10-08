# Tarea 4: Investigación y Cálculo de Complejidad

## 1. Investigación sobre Hidden Classes en V8

El motor V8 no almacena los nombres de las propiedades (`lat`, `lng`) dentro de cada objeto[cite: 8]. Para ello utiliza las **Hidden Classes** (*Maps*), estructuras internas que describen la forma de un objeto: qué propiedades tiene, en qué orden y en qué posición de memoria se encuentra cada una[cite: 8]. Todos los objetos creados con el mismo constructor y con las propiedades en el mismo orden comparten el mismo *Map*, lo que acelera el acceso a sus propiedades[cite: 8].

Esta optimización tiene un costo en memoria[cite: 8]. Cada instancia requiere una cabecera propia (puntero al *Map* y punteros auxiliares), y los valores decimales `lat` y `lng` suelen almacenarse como objetos independientes (*HeapNumber*)[cite: 8]. Como resultado, un registro que teóricamente requiere 16 bytes ocupa cerca de 94 bytes en la práctica[cite: 8].

Por el contrario, un `Float64Array` reserva un único bloque contiguo en el que cada elemento ocupa exactamente 8 bytes, sin cabeceras ni punteros por elemento[cite: 8].

## 2. Cálculo del espacio asintótico

### Arreglo de primitivos (Typed Arrays)
Sabiendo que un número en coma flotante de 64 bits (`Float64`) ocupa exactamente 8 bytes, y se utilizan dos arreglos unidimensionales de tamaño `n` (`lat` y `lng`)[cite: 4]:

**S_primitivos(n) = 2 × n × 8 bytes**

Para `n = 10⁶` (1 millón), el consumo en la memoria contigua es exactamente 16,000,000 bytes, lo que equivale aproximadamente a 15.26 MB.

### Arreglo de objetos
Si cada registro ocupa `c_obj` bytes, el consumo neto medido (89.2 MB para `n = 10⁶`) permite estimar el costo por registro[cite: 8]:

**S_obj(n) = n × c_obj**

**c_obj ≈ (89.2 × 1,048,576) / 1,000,000 ≈ 93.5 Bytes**
