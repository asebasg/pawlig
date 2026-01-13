---
name: Refactorización
about: Proponer mejoras al código existente sin cambiar su funcionalidad
title: "\U0001F527 [REFACTOR] - "
labels: ''
assignees: ''

---

## 🔨 ¿Qué Código Necesita Refactorización?
<!-- Especifica los archivos, funciones o módulos que necesitan mejora -->
**Archivos afectados:**
- `ruta/al/archivo1.js`
- `ruta/al/archivo2.py`
- `ruta/al/archivo3.tsx`

**Funciones/Componentes específicos:**
- Función: `nombreFuncion()` en `archivo.js:línea`
- Componente: `<NombreComponente />` en `archivo.jsx`


## ❓ ¿Por Qué Necesita Refactorización?
<!-- Marca todas las que apliquen -->
- [ ] 📋 Código duplicado (DRY violation)
- [ ] 😵 Difícil de entender/mantener
- [ ] 🐢 Problemas de rendimiento
- [ ] 📦 Acoplamiento alto
- [ ] 🔀 Lógica compleja y enredada
- [ ] 🏗️ Violación de principios SOLID
- [ ] 📏 Funciones/archivos muy largos
- [ ] ⚠️ Code smells (malas prácticas)
- [ ] 🧪 Difícil de testear
- [ ] 📚 Uso de patrones desactualizados
- [ ] 🔧 Deuda técnica acumulada
- [ ] Otro: _________________


## 📝 Implementación Actual
<!-- Muestra cómo está el código ahora -->

### Descripción del Problema
El código actual [describe el problema específico].

### Código Actual
```javascript
// Ejemplo del código que necesita refactorización
function procesarDatos(datos) {
  // Código actual complejo o problemático
  let resultado = [];
  for (let i = 0; i < datos.length; i++) {
    if (datos[i].activo) {
      for (let j = 0; j < datos[i].items.length; j++) {
        if (datos[i].items[j].valido) {
          resultado.push({
            id: datos[i].id,
            nombre: datos[i].nombre,
            item: datos[i].items[j]
          });
        }
      }
    }
  }
  return resultado;
}
```

### Problemas Específicos
1. **Complejidad ciclomática alta:** [Explicación]
2. **Difícil de testear:** [Explicación]
3. **Violación de SRP:** [Explicación]

---

## ✨ Refactorización Propuesta
<!-- Muestra cómo debería quedar el código -->

### Descripción de la Mejora
El código refactorizado [describe cómo mejorará].

### Código Propuesto
```javascript
// Ejemplo de código refactorizado
const filtrarDatosActivos = (datos) => 
  datos.filter(dato => dato.activo);

const obtenerItemsValidos = (dato) =>
  dato.items
    .filter(item => item.valido)
    .map(item => ({
      id: dato.id,
      nombre: dato.nombre,
      item
    }));

const procesarDatos = (datos) =>
  filtrarDatosActivos(datos)
    .flatMap(obtenerItemsValidos);
```

### Cambios Clave
1. **Separación de responsabilidades:** Cada función hace una cosa
2. **Más legible:** Usa métodos de array modernos
3. **Más testeable:** Funciones puras independientes
4. **Menos complejo:** Complejidad ciclomática reducida

---

## 🎯 Beneficios de la Refactorización
<!-- ¿Qué mejoras traerá? -->

### Mejoras de Código
- [ ] 📖 Mayor legibilidad
- [ ] 🧪 Más fácil de testear
- [ ] ⚡ Mejor rendimiento
- [ ] 🔧 Más fácil de mantener
- [ ] 🔄 Más reutilizable
- [ ] 🎯 Sigue mejores prácticas
- [ ] 📉 Reduce complejidad
- [ ] 🐛 Menos propenso a bugs

### Impacto en el Equipo
- [ ] Facilita agregar nuevas features
- [ ] Reduce tiempo de onboarding
- [ ] Mejora la productividad
- [ ] Reduce bugs futuros

---

## ⚠️ Breaking Changes
<!-- ¿Esta refactorización rompe compatibilidad? -->
- [ ] ✅ No introduce breaking changes
- [ ] ⚠️ Sí introduce breaking changes (describir abajo)

**Si hay breaking changes, describe:**
1. ¿Qué cambia en la interfaz pública?
2. ¿Cómo migrar el código existente?
3. ¿Hay deprecation warnings necesarios?

---

## 🧪 Estrategia de Testing
<!-- ¿Cómo validaremos que la refactorización funciona? -->

### Tests Existentes
- [ ] Los tests actuales deben seguir pasando
- [ ] No hay tests actuales (crear primero)

### Tests Nuevos Requeridos
- [ ] Unit tests para nuevas funciones
- [ ] Integration tests
- [ ] Tests de regresión
- [ ] Tests de performance

### Casos de Prueba Críticos
```
1. [Caso 1]: Dado [entrada] → Debe retornar [salida esperada]
2. [Caso 2]: Cuando [condición] → Debe comportarse [comportamiento]
3. [Caso 3]: Edge case [descripción]
```

---

## 📋 Plan de Refactorización
<!-- Pasos sugeridos para hacer la refactorización -->

### Fase 1: Preparación
- [ ] Agregar tests para comportamiento actual
- [ ] Documentar casos edge conocidos
- [ ] Revisar dependencias

### Fase 2: Refactorización
- [ ] Extraer funciones pequeñas
- [ ] Simplificar lógica compleja
- [ ] Mejorar nombres de variables/funciones
- [ ] Eliminar código duplicado
- [ ] Aplicar patrones de diseño

### Fase 3: Validación
- [ ] Ejecutar todos los tests
- [ ] Validar performance
- [ ] Code review
- [ ] Actualizar documentación

---

## 🔧 Patrones y Principios a Aplicar
<!-- ¿Qué patrones o principios se seguirán? -->
- [ ] SOLID Principles
- [ ] DRY (Don't Repeat Yourself)
- [ ] KISS (Keep It Simple, Stupid)
- [ ] YAGNI (You Aren't Gonna Need It)
- [ ] Design Patterns: [ej. Strategy, Factory, Observer]
- [ ] Functional Programming principles
- [ ] Otro: _________________

---

## 📊 Métricas de Mejora
<!-- ¿Cómo mediremos el éxito? -->

### Antes
```
- Complejidad ciclomática: [ej. 15]
- Líneas de código: [ej. 150]
- Test coverage: [ej. 40%]
- Tiempo de ejecución: [ej. 200ms]
```

### Después (objetivo)
```
- Complejidad ciclomática: [ej. < 5]
- Líneas de código: [ej. < 80]
- Test coverage: [ej. > 80%]
- Tiempo de ejecución: [ej. < 100ms]
```

---

## 🔄 Migración y Compatibilidad
<!-- Si es necesario migrar código existente -->

### ¿Quién usa este código?
- [ ] Solo interno (fácil de cambiar)
- [ ] Usado por otros módulos internos
- [ ] API pública (requiere deprecation)
- [ ] Usado por clientes externos

### Estrategia de Migración
```
1. [Paso 1]: [Acción]
2. [Paso 2]: [Acción]
3. [Paso 3]: [Acción]
```

---

## ✅ Criterios de Aceptación
<!-- ¿Cuándo estará completa la refactorización? -->
- [ ] El código refactorizado hace exactamente lo mismo que antes
- [ ] Todos los tests existentes pasan
- [ ] Se agregaron tests para casos nuevos
- [ ] La complejidad se redujo en [métrica]
- [ ] El código sigue las convenciones del proyecto
- [ ] Está documentado si es necesario
- [ ] No introduce bugs nuevos
- [ ] Performance igual o mejor

---

## 🎯 Prioridad
<!-- ¿Qué tan urgente es esta refactorización? -->
- [ ] 🔴 Alta - Está causando bugs o bloquea desarrollo
- [ ] 🟠 Media - Deuda técnica significativa
- [ ] 🟡 Baja - Mejora preventiva
- [ ] 🟢 Nice to have - Cuando haya tiempo

---

## 🔧 Instrucciones para Jules (Agente IA)

### Alcance de la Refactorización
- [ ] Solo los archivos especificados
- [ ] Incluir archivos relacionados/dependientes
- [ ] Refactorización completa del módulo

### Precauciones
<!-- Aspectos críticos que Jules debe considerar -->
1. ⚠️ NO cambiar la funcionalidad externa
2. ⚠️ Mantener retrocompatibilidad (o documentar breaking changes)
3. ⚠️ Validar que todos los tests pasen
4. [Otra precaución específica]

### Archivos de Referencia
<!-- Si hay ejemplos de buen código en el proyecto -->
- `ruta/ejemplo/buen-codigo.js` - [Seguir este patrón]
