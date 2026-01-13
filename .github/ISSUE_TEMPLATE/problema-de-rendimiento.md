---
name: Problema de Rendimiento
about: Reportar lentitud, alto consumo de recursos o problemas de performance
title: "\U0001F50B [PERFORMANCE] - "
labels: performance
assignees: ''

---

## 🐌 Descripción del Problema de Rendimiento
<!-- Explica qué está lento o consumiendo demasiados recursos -->

### Para Usuarios
¿Qué notas que va lento?
- [ ] La aplicación tarda mucho en cargar
- [ ] Al hacer [acción], se congela o va lento
- [ ] El navegador/app consume mucha memoria/batería
- [ ] Los videos/imágenes tardan en cargar
- [ ] Otro: _________________

### Para Desarrolladores
**Síntoma técnico:**
[ej. El endpoint /api/usuarios tarda 8 segundos en responder]

**Métrica actual:**
[ej. Tiempo de respuesta: 8000ms, Uso de CPU: 95%, Memoria: 2GB]

---

## ⏱️ Comportamiento Actual vs Esperado

### Comportamiento Actual
- **Tiempo de carga:** [ej. 10 segundos]
- **Uso de memoria:** [ej. 500MB]
- **Uso de CPU:** [ej. 80%]
- **Tamaño de datos:** [ej. 50MB de JSON]
- **Otro:** _________________

### Comportamiento Esperado
- **Tiempo de carga:** [ej. Menos de 2 segundos]
- **Uso de memoria:** [ej. Menos de 100MB]
- **Uso de CPU:** [ej. Menos de 30%]
- **Tamaño de datos:** [ej. Optimizado a menos de 5MB]

---

## 🔄 Pasos para Reproducir el Problema
<!-- Cómo recrear el problema de rendimiento -->
1. Ve a [página/sección]
2. Haz [acción que causa lentitud]
3. Observa [problema de rendimiento]

**Frecuencia:**
- [ ] Siempre ocurre
- [ ] Ocurre a veces
- [ ] Solo con muchos datos/usuarios
- [ ] Solo en ciertos dispositivos

---

## 💻 Información del Entorno

### Para Usuarios
- **Dispositivo:** [ej. iPhone 12, PC de escritorio]
- **Navegador:** [ej. Chrome, Safari]
- **Conexión:** [ej. WiFi, 4G]
- **¿Cuántos datos tienes?** [ej. 1000 productos, 500 contactos]

### Para Desarrolladores
```
- OS: [ej. Ubuntu 22.04, Windows 11]
- Navegador/Runtime: [ej. Chrome 120, Node 18.17]
- Hardware: [ej. Intel i5 8GB RAM, M1 16GB]
- Versión: [ej. v2.1.0]
- Tamaño del dataset: [ej. 10,000 registros]
- Tráfico concurrente: [ej. 100 usuarios simultáneos]
```

---

## 📊 Métricas de Rendimiento
<!-- Si tienes datos específicos, compártelos -->

### Métricas Observadas
```
- Tiempo de carga inicial: [ej. 8.5s]
- Time to First Byte (TTFB): [ej. 2.1s]
- First Contentful Paint (FCP): [ej. 3.2s]
- Largest Contentful Paint (LCP): [ej. 6.8s]
- Total Blocking Time (TBT): [ej. 1200ms]
- Cumulative Layout Shift (CLS): [ej. 0.25]
```

### Datos de Profiling
<!-- Si ejecutaste un profiler, pega los resultados -->
```
Pega aquí los resultados del profiler
```

---

## 📸 Capturas/Videos
<!-- Graba la pantalla mostrando la lentitud o agrega screenshots de las herramientas de desarrollo -->
- **Video del problema:** [arrastra aquí o pega URL]
- **Screenshot del Network tab:** [imagen]
- **Screenshot del Performance tab:** [imagen]

---

## 🔍 Análisis Técnico (Para Desarrolladores)

### Posible Causa Raíz
<!-- Si tienes idea de qué puede estar causando el problema -->
- [ ] Consulta a base de datos sin optimizar
- [ ] Bucles ineficientes (O(n²) o peor)
- [ ] Falta de paginación/lazy loading
- [ ] Archivos muy pesados sin comprimir
- [ ] Muchas llamadas a API
- [ ] Renderizado innecesario
- [ ] Memory leaks
- [ ] Falta de caché
- [ ] No sé, necesito ayuda para identificarlo
- [ ] Otro: _________________

### Archivos/Componentes Sospechosos
<!-- ¿Qué partes del código podrían estar causando el problema? -->
```
- Frontend: [ej. components/ProductList.jsx]
- Backend: [ej. routes/api/products.js]
- Database: [ej. query en tabla 'products']
- Otro: [ej. assets/images/]
```

### Consultas/Código Problemático
<!-- Si identificaste código lento, pégalo aquí -->
```javascript
// Código que puede estar causando el problema
```

---

## 💡 Soluciones Propuestas
<!-- ¿Tienes ideas de cómo optimizar? -->

### Para Usuarios
¿Qué te ayudaría?
- [ ] Que cargue más rápido
- [ ] Que consuma menos batería/datos
- [ ] Que funcione mejor en mi dispositivo
- [ ] Otro: _________________

### Para Desarrolladores
**Optimizaciones sugeridas:**
1. [ej. Agregar índice a columna 'email' en DB]
2. [ej. Implementar paginación en endpoint /api/products]
3. [ej. Usar lazy loading para imágenes]
4. [ej. Implementar caché en Redis]

**Técnicas a considerar:**
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Debouncing/Throttling
- [ ] Virtualización de listas
- [ ] Optimización de queries
- [ ] Compresión de assets
- [ ] CDN para archivos estáticos
- [ ] Memoization
- [ ] Web Workers
- [ ] Otro: _________________

---

## ✅ Criterios de Aceptación
<!-- ¿Cómo sabremos que el problema está resuelto? -->

**Métricas objetivo:**
- [ ] Tiempo de carga < [valor objetivo]
- [ ] Uso de CPU < [valor objetivo]
- [ ] Uso de memoria < [valor objetivo]
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse score > 90

**Comportamiento esperado:**
- [ ] La acción [X] se completa en menos de [tiempo]
- [ ] No hay congelamiento o lag visible
- [ ] Funciona fluido en dispositivos de gama baja
- [ ] Otro: _________________

---

## 🎯 Prioridad
<!-- ¿Qué tan urgente es optimizar esto? -->
- [ ] 🔴 Crítica - La app es casi inutilizable
- [ ] 🟠 Alta - Afecta significativamente la experiencia
- [ ] 🟡 Media - Notable pero tolerable
- [ ] 🟢 Baja - Optimización preventiva

---

## 🔧 Instrucciones para Jules (Agente IA)

### Alcance de la Optimización
- [ ] Solo frontend
- [ ] Solo backend
- [ ] Base de datos
- [ ] Full-stack (todas las capas)
- [ ] Infrastructure/Deployment

### Tests de Performance
- [ ] Crear benchmarks antes/después
- [ ] Agregar tests de carga
- [ ] Documentar las mejoras obtenidas
- [ ] Validar en diferentes dispositivos

### Consideraciones Importantes
<!-- Aspectos que Jules debe cuidar al optimizar -->
1. No sacrificar funcionalidad por performance
2. Mantener la legibilidad del código
3. Documentar las optimizaciones realizadas
4. [Otra consideración específica]
