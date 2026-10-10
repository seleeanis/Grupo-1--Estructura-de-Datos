# Tabla comparativa

Archivo: `coordenadas_masivas.csv`, 1.000.000 de registros, 26.86 MB (generado en 0.69 s).

| Métrica | Síncrona (`readFileSync`) | Stream (`createReadStream`) |
|---|---|---|
| Líneas contadas | 1.000.001 | 1.000.001 |
| Tiempo | 0.10 s | 0.04 s |
| RAM neta (`heapUsed`) | 64.78 MB | 1.04 MB |
| Complejidad espacial | O(n) | O(1) |
| Complejidad temporal | O(n) | O(n) |
| Hilo principal | Bloqueado | Libre entre chunks |

El Stream usó 62 veces menos RAM (98.4 % de reducción). Las 1.000.001 líneas incluyen la cabecera. Los tiempos vienen de una sola ejecución, por lo que la diferencia de 0.06 s es poco concluyente; la de RAM sí es clara.