# Tarea 4: Análisis matemático de rendimiento

Notación: n es el número de registros, L ≈ 28 bytes es el tamaño promedio de un registro, B es el buffer del Stream (64 KiB por defecto, constante) y S(n) es la memoria que necesita el programa.

Definición usada: f(n) = O(g(n)) si existen constantes c > 0 y n₀ tales que f(n) ≤ c · g(n) para todo n ≥ n₀.

## Lectura síncrona: S(n) = O(n)

`readFileSync` carga el archivo completo y `split('\n')` crea una cadena por línea. En memoria conviven el texto de n · L bytes, un arreglo de n referencias y n objetos de cadena. Cada término es lineal en n, por lo que:

S_sync(n) = c₁ · n + c₀, con c₁ > 0.

Para n ≥ 1 se cumple S_sync(n) ≤ (c₁ + c₀) · n. Tomando c = c₁ + c₀ y n₀ = 1, queda demostrado que S_sync(n) = O(n).

Además S_sync(n) ≥ c₁ · n, así que también es Ω(n) y por tanto Θ(n). Esto significa que ninguna constante la acota. Si existiera k tal que S_sync(n) ≤ k para todo n grande, se tendría c₁ · n ≤ k, es decir n ≤ k / c₁, lo cual es falso para n > k / c₁. Por eso S_sync(n) ≠ O(1).

## Lectura por Stream: S(n) = O(1)

El archivo se procesa en chunks de B bytes y cada chunk se descarta al terminar el callback `data`. En cualquier instante hay un solo chunk en memoria, sin importar el tamaño del archivo:

S_stream(n) = c₂ · B + c₃.

Esta expresión no depende de n. Tomando c = c₂ · B + c₃ y n₀ = 1, se cumple S_stream(n) ≤ c · 1 para todo n ≥ n₀, así que S_stream(n) = O(1).

## Conclusión

S_sync(n) = Θ(n) y S_stream(n) = Θ(1) pertenecen a clases de crecimiento distintas. La función bloqueante impone O(n) en espacio frente al O(1) del Stream. Los datos medidos concuerdan: 64.78 MB frente a 1.04 MB. El tiempo es Θ(n) en los dos enfoques porque ambos recorren cada byte una vez, así que la diferencia está en el espacio.

## Relación con el uso energético del servidor

En la lectura síncrona, el texto y el millón de cadenas siguen vivos hasta el final. V8 los promueve a la generación vieja del heap y el recolector Mark-Sweep debe recorrer ese conjunto en cada ciclo, con un costo que crece con n. En el Stream, cada chunk y su arreglo temporal mueren en la generación joven, donde el Scavenger casi no encuentra objetos vivos que recorrer.

Menos RAM ocupada significa menos recolección de basura. Menos recolección significa menos ciclos de CPU, y con ellos menor consumo y menor calentamiento del procesador. En la práctica no se midió consumo eléctrico; lo medido fue la RAM.