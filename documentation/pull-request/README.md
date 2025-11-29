# 📋 Guía de Pull Requests - Pawlig

## Propósito

Este documento establece los estándares y directrices para crear pull requests (PRs) consistentes y completos en el proyecto Pawlig. Cada PR debe incluir un archivo `.md` detallado que documente la tarea, implementación y cambios técnicos.

## 🎯 Objetivo Principal

A partir de ahora, **cada pull request debe incluir un archivo de documentación** (`.md`) que centralice toda la información relevante sobre la tarea implementada. Esto permite:

- ✅ Revisiones técnicas consistentes y congruentes
- ✅ Evitar redundancia de información entre el PR y la descripción de GitHub
- ✅ Mantener un registro histórico de decisiones técnicas
- ✅ Facilitar la incorporación de nuevos miembros al equipo
- ✅ Documentar información técnica profunda para referencia futura

## 📁 Estructura del Archivo de Documentación

El archivo de documentación debe seguir este formato y ubicarse en: `documentation/pull-request/[NOMBRE_RAMA].md`

### Secciones Requeridas

#### 1. **Información General**

```markdown
# [NOMBRE DE LA TAREA]

## Descripción

Breve descripción de qué hace la tarea y por qué es importante.

## Rama

- **Nombre de rama:** `feat/tarea-XXX-descripcion`
- **Estado:** En desarrollo / Listo para revisión / Completado
```

#### 2. **Archivos Modificados**

```markdown
## Archivos Cambiados

### Nuevos Archivos

- `app/components/NuevoComponente.tsx` - Componente para [descripción]
- `lib/services/nuevoServicio.ts` - Servicio que [descripción]

### Archivos Modificados

- `app/page.tsx` - Agregado hook X, modificada función Y
- `lib/auth/auth-options.ts` - Actualizada configuración de autenticación
- `prisma/schema.prisma` - Agregado modelo Z

### Archivos Eliminados

- `components/LegacyComponent.tsx` - Reemplazado por NuevoComponente
```

#### 3. **Funcionalidades Agregadas**

```markdown
## Funcionalidades Nuevas

### Funcionalidad 1: [Nombre]

- **Descripción:** Qué hace y por qué
- **Archivos relacionados:**
  - `app/components/ComponentA.tsx`
  - `lib/services/serviceA.ts`
- **Flujo de usuario:** Paso 1 → Paso 2 → Resultado

### Funcionalidad 2: [Nombre]

- **Descripción:** ...
```

#### 4. **Endpoints API**

````markdown
## Endpoints API

### POST /api/recurso

- **Propósito:** Crear un nuevo recurso
- **Autenticación:** Requerida (JWT)
- **Roles permitidos:** `admin`, `moderator`
- **Request Body:**
  ```json
  {
    "nombre": "string",
    "email": "string",
    "edad": "number"
  }
  ```
````

- **Response (200):**
  ```json
  {
    "id": "string",
    "nombre": "string",
    "createdAt": "timestamp"
  }
  ```
- **Errores posibles:**
  - `400` - Datos inválidos
  - `401` - No autorizado
  - `409` - Recurso duplicado

### GET /api/recurso/[id]

- **Propósito:** Obtener un recurso específico
- **Parámetros:** `id` (requerido)
- **Response (200):** Objeto del recurso

### PUT /api/recurso/[id]

- **Propósito:** Actualizar un recurso
- ...

### DELETE /api/recurso/[id]

- **Propósito:** Eliminar un recurso
- ...

````

#### 5. **Cambios en Base de Datos**
```markdown
## Migraciones y Cambios en BD

### Modelos Agregados
- **Modelo:** `NuevoModelo`
  - Campos: `id`, `nombre`, `email`, `fechaCreacion`
  - Relaciones: Tiene muchos `OtroModelo`

### Campos Agregados
- **Modelo:** `Usuario`
  - Campo nuevo: `telefonoVerificado` (Boolean, default: false)
  - Razón: Agregada verificación de teléfono

### Campos Eliminados
- **Modelo:** `Producto`
  - Campo eliminado: `stockAnterior`
  - Razón: Información redundante
````

#### 6. **Cambios en Autenticación/Autorización**

```markdown
## Seguridad y Permisos

- Nuevo rol: `moderator` con permisos limitados
- Modificada validación en `require-role.ts`
- Actualizado middleware en `middleware.ts` para validar X
- Cambios en sesión de NextAuth
```

#### 7. **Decisiones Técnicas**

```markdown
## Decisiones Técnicas

### ¿Por qué se eligió X?

Explicación de la decisión arquitectónica y alternativas consideradas.

### Patrones Implementados

- Usado patrón de composición en componentes
- Implementado custom hook para [funcionalidad]
- Validaciones con Zod schema

### Dependencias Agregadas/Actualizadas

- `libreria-x@1.2.3` - Razón de inclusión
```

#### 8. **Instrucciones para Revisar**

```markdown
## Cómo Revisar este PR

1. **Verificar cambios en BD:**

   - Confirmar migraciones se aplicaron correctamente
   - Validar relaciones entre modelos

2. **Probar funcionalidades nuevas:**

   - Scenario 1: [Descripción]
   - Scenario 2: [Descripción]

3. **Validar endpoints:**

   - Usar colección Postman: `documentation/postman/tarea-XXX.json`
   - O comando curl: `curl -X POST http://localhost:3000/api/recurso ...`

4. **Revisar cambios en seguridad:**

   - Confirmar validaciones de permiso
   - Verificar que roles están correctamente asignados

5. **Puntos críticos a validar:**
   - Manejo de errores en componente Y
   - Validación de inputs en endpoint Z
```

#### 9. **Testing**

````markdown
## Testing

### Casos de Prueba Implementados

- ✅ Test 1: [Descripción]
- ✅ Test 2: [Descripción]

### Cómo Ejecutar Tests

```bash
npm run test -- --testNamePattern="tarea-017"
```
````

### Cobertura

- Cobertura actual: X%
- Archivos con cobertura: [listar archivos]

````

#### 10. **Notas Adicionales**
```markdown
## Notas Importantes

- ⚠️ **Atención:** [Algo importante a considerar]
- 📌 **Dependencia:** Esta tarea requiere completar tarea-016
- 🔄 **Cambios futuros:** Se planea refactorizar X en la próxima tarea

## Preguntas sin Resolver
- ¿Debería la validación ser más estricta?
- ¿Necesitamos agregar caché para este endpoint?
````

---

## 📋 Checklist para Pull Request

Antes de crear el PR, asegúrate de:

- [ ] Crear archivo de documentación en `documentation/pull-request/[nombre-rama].md`
- [ ] Incluir todas las secciones requeridas
- [ ] Verificar que los endpoints funcionan correctamente
- [ ] Actualizar `prisma/schema.prisma` si hay cambios de BD
- [ ] Ejecutar tests localmente
- [ ] Revisar que no hay conflictos de merge
- [ ] Agregar ejemplos de código cuando sea relevante
- [ ] Documentar cualquier variable de entorno nueva
- [ ] Validar TypeScript (sin errores)
- [ ] Ejecutar linter (sin advertencias críticas)

## 🔗 Estructura de Carpetas para Documentación

```
documentation/
├── pull-request/
│   ├── README.md (este archivo)
│   ├── instrucciones.md (instructivo original)
│   ├── tarea-001-autenticacion.md
│   ├── tarea-017-actualizacion-perfil.md
│   └── [nombre-rama].md (nuevo para cada tarea)
└── postman/
    ├── tarea-001.json
    └── [nombre-rama].json
```

## 🎓 Ejemplo Completo

Ver: `documentation/pull-request/tarea-017-actualizacion-perfil.md` para un ejemplo de implementación siguiendo estas directrices.

## 📞 Preguntas Frecuentes

**P: ¿Necesito documentar cada línea de código?**
R: No, documenta decisiones importantes, flujos complejos y cambios significativos.

**P: ¿Qué pasa si la tarea es muy pequeña?**
R: Aún así requiere el archivo `.md` con las secciones aplicables. La brevedad no es excusa para falta de documentación.

**P: ¿Puedo actualizarlo después de abrir el PR?**
R: Sí, actualiza el archivo según feedback de las revisiones.

**P: ¿Debo incluir screenshots?**
R: Sí, para cambios en UI, incluye screenshots antes/después.

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0
