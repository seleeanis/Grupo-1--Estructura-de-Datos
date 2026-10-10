# Análisis matemático de rendimiento

Notación: $n$ es el número de registros, $L \approx 28$ bytes es el tamaño promedio de un registro, $B$ es el buffer del Stream (64 KiB por defecto, constante) y $S(n)$ es la memoria que necesita el programa.

Definición usada: $f(n) = O(g(n))$ si existen constantes $c > 0$ y $n_0$ tales que $f(n) \leq c \cdot g(n)$ para todo $n \geq n_0$.

## Lectura síncrona: $S(n) = O(n)$

`readFileSync` carga el archivo completo y `split('\n')` crea una cadena por línea. En memoria conviven el texto de $n \cdot L$ bytes, un arreglo de $n$ referencias y $n$ objetos de cadena. Cada término es lineal en $n$, por lo que:

$$S_{\text{sync}}(n) = c_1 \cdot n + c_0, \qquad c_1 > 0$$

Para $n \geq 1$ se cumple:

$$S_{\text{sync}}(n) \leq (c_1 + c_0) \cdot n$$

Tomando $c = c_1 + c_0$ y $n_0 = 1$, queda demostrado que $S_{\text{sync}}(n) = O(n)$.

Además $S_{\text{sync}}(n) \geq c_1 \cdot n$, así que también es $\Omega(n)$ y por tanto $\Theta(n)$. Esto significa que ninguna constante la acota. Si existiera $k$ tal que $S_{\text{sync}}(n) \leq k$ para todo $n$ grande, se tendría:

$$c_1 \cdot n \leq k \;\Rightarrow\; n \leq \frac{k}{c_1}$$

lo cual es falso para $n > k / c_1$. Por eso $S_{\text{sync}}(n) \neq O(1)$.

## Lectura por Stream: $S(n) = O(1)$

El archivo se procesa en chunks de $B$ bytes y cada chunk se descarta al terminar el callback `data`. En cualquier instante hay un solo chunk en memoria, sin importar el tamaño del archivo:

$$S_{\text{stream}}(n) = c_2 \cdot B + c_3$$

Esta expresión no depende de $n$. Tomando $c = c_2 \cdot B + c_3$ y $n_0 = 1$, se cumple $S_{\text{stream}}(n) \leq c \cdot 1$ para todo $n \geq n_0$, así que $S_{\text{stream}}(n) = O(1)$.

## Conclusión

$S_{\text{sync}}(n) = \Theta(n)$ y $S_{\text{stream}}(n) = \Theta(1)$ pertenecen a clases de crecimiento distintas. La función bloqueante impone $O(n)$ en espacio frente al $O(1)$ del Stream. Los datos medidos concuerdan: 64.78 MB frente a 1.04 MB. El tiempo es $\Theta(n)$ en los dos enfoques porque ambos recorren cada byte una vez, así que la diferencia está en el espacio.

## Relación con el uso energético del servidor

En la lectura síncrona, el texto y el millón de cadenas siguen vivos hasta el final. V8 los promueve a la generación vieja del heap y el recolector Mark-Sweep debe recorrer ese conjunto en cada ciclo, con un costo que crece con $n$. En el Stream, cada chunk y su arreglo temporal mueren en la generación joven, donde el Scavenger casi no encuentra objetos vivos que recorrer.

Menos RAM ocupada significa menos recolección de basura. Menos recolección significa menos ciclos de CPU, y con ellos menor consumo y menor calentamiento del procesador. En la práctica no se midió consumo eléctrico; lo medido fue la RAM.