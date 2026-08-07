# PawLig: Estándar de Oro para Documentación Técnica, PRs y Trazabilidad

Este documento es la autoridad máxima sobre cómo se documenta, revisa y aprueba cualquier cambio en PawLig. Complementa a `.rules.md` (que rige el código) y a la Guía de Notion (que rige la concepción de la idea). Este archivo rige el ciclo de vida completo: Notion → GitHub Issue → Implementación → PR → Merge → Documentación final.

**No reemplaza `.rules.md`.** Donde haya conflicto de convenciones de código, `.rules.md` gana. Este documento gobierna proceso, no sintaxis.

---

## 0. Principio Rector

> **Ningún cambio se fusiona a `main` si no puede ser rastreado, en menos de 60 segundos, desde el commit hasta la decisión de negocio que lo originó.**

Toda contribución debe responder, sin ambigüedad, a tres preguntas:
1. ¿Por qué existe este cambio? (Notion + Issue)
2. ¿Qué se tocó y por qué de esa forma? (PR + código)
3. ¿Cómo se sabe que funciona y no rompió nada? (Testing + evidencia)

Si una de las tres no tiene respuesta verificable, el cambio se **rechaza**, sin excepción.

---

## 1. Cadena de Trazabilidad Obligatoria

```
Notion (idea/problema) → GitHub Issue (#N) → Rama (tipo/ISSUE-N-slug)
→ Commits semánticos → PR (Closes #N) → CHANGELOG.md + CONTEXT.md + DEV_NOTES.md
→ Merge → monthly-updates.md (cierre de mes)
```

**Regla de oro de nomenclatura de ramas:**
`<tipo>/ISSUE-<N>-<slug-kebab-case>` — ej. `feat/ISSUE-174-crear-usuario`, `fix/BUG-2026-06-20-001-orphan-cloudinary`.

**Regla de IDs:**
- Features/Refactors: `ISSUE-<N>` (número de GitHub Issue).
- Bugs: `BUG-<YYYY-MM-DD>-<NNN>` asignado en el momento del reporte en Notion, y referenciado también como Issue de GitHub. El ID de bug **nunca cambia**, aunque el issue de GitHub se cierre y reabra.

Todo commit, rama, PR, entrada de CHANGELOG y página de Notion relacionados a un mismo trabajo deben citar el mismo identificador. Un identificador sin al menos estas cinco apariciones se considera **huérfano** y bloquea el merge.

---

## 2. Estandarización en Notion

### 2.1 Estructura de página (obligatoria, sin excepciones)

| Sección | Features | Bugs | Ideas/Refactor |
|---|---|---|---|
| Título | `Feature — ISSUE-N: Título` | `Bug — BUG-YYYY-MM-DD-NNN: Título` | `Refactor — ISSUE-N: Título` / `Idea — Título` |
| ¿Qué? | Sí | Sí (qué se rompe) | Sí |
| ¿Por qué? | Sí | **Causa raíz** (obligatorio, no opcional) | Sí (justificación técnica) |
| ¿Cómo funciona? | Sí (comportamiento esperado) | Sí (solución propuesta) | Sí (patrón/principio aplicado) |
| Diseño | Sí | Opcional si el fix es trivial (< 1h) | Sí |
| Implementación | Sí | Sí | Sí |
| Testing | Sí | Sí (incluye caso de regresión) | Sí |
| Finalización | Sí | Sí | Sí |

### 2.2 Reglas adicionales de rigor para Bugs (extensión sobre la guía existente)

La guía de Notion ya define ¿Qué?/¿Por qué?/¿Cómo funciona? como núcleo. Para bugs, esto se refina así:

- **¿Qué?** → Descripción del síntoma observable, no de la causa. ("El usuario X no puede Y" — no "el endpoint falla porque Z", eso va en ¿Por qué?).
- **¿Por qué?** → Causa raíz técnica exacta, con referencia a archivo/línea/función si aplica. Prohibido cerrar esta sección con "no se sabe" o "posiblemente". Si la causa raíz no está confirmada, el bug permanece en estado `🔄 En Investigación` y no puede pasar a implementación.
- **¿Cómo funciona?** → La solución, no el síntoma. Debe incluir por qué esa solución y no una alternativa (ej. BUG-2026-06-20-001: por qué validación pre-upload y no post-upload).

### 2.3 Estados de página en Notion (alineados 1:1 con el estado del Issue en GitHub)

`📋 Todo` → `🔄 En Progreso` → `👀 En Revisión` → `✅ Finalizado`

El estado en Notion y el estado declarado del Issue/PR de GitHub (label, campo de proyecto o texto explícito) **deben coincidir siempre**. Una discrepancia detectada en revisión es motivo de bloqueo inmediato del PR.

### 2.4 Estructura de espacio de trabajo en Notion

```
📁 PawLig
 ├── 📋 Backlog (Features / Bugs / Ideas — sin desarrollar)
 ├── 🔄 En Curso (vinculado 1:1 a un Issue abierto en GitHub)
 ├── 👀 En Revisión (vinculado a un PR abierto)
 ├── ✅ Archivo Histórico (vinculado a entrada de CHANGELOG.md)
 └── 🗺️ Roadmap (agrupación temática, sin detalle de implementación)
```

Ninguna página pasa de `En Curso` a `En Revisión` sin que exista ya el PR abierto con el link en la página de Notion.

---

## 3. Estandarización en GitHub

### 3.1 Issues

Las plantillas existentes (`feature-request.md`, `bug-report.md`, `refactor.md`, `performance.md`, `documentation.md`, `question.md`) se mantienen como base estructural válida. Se añaden las siguientes **reglas de mejora obligatorias**:

1. **Ningún Issue se abre sin antes tener su página en Notion.** El campo de referencias del Issue debe incluir el link a Notion desde su creación, no después.
2. **El bloque "Para Jules" al final de cada plantilla se trata como instrucción de ejecución, no como sugerencia.** Si Jules reporta trabajo completo, el reviewer humano **debe auditar el contenido real del archivo antes de declarar el ítem como cerrado en Notion o GitHub**. Nunca se confía en lo reportado por el agente sin verificación de código (ver §4.3).
3. **Un Issue de Bug sin sección "Esperado vs Actual" completamente diligenciada se rechaza en el momento de apertura.**
4. **Todo Issue de tipo Feature/Refactor con Size ≥ L debe descomponerse** en sub-issues (`ISSUE-N.1`, `ISSUE-N.2`, ...) antes de iniciar implementación. Ejemplo de referencia: extracción de hard-delete a `ISSUE-174.1` fuera del alcance de `ISSUE-174`.
5. **Decisiones abiertas se documentan explícitamente en el Issue** bajo un subtítulo `## 🔓 Decisiones Pendientes`, listando la pregunta, las opciones evaluadas y quién debe resolverla. Un Issue no puede pasar a `🔄 En Progreso` con decisiones pendientes que bloqueen esa parte del alcance.

### 3.2 Pull Requests — Plantilla mejorada

La plantilla existente (`pull_request_template.md`) es sólida en estructura pero permite ambigüedad de diligenciamiento. Se refuerza así:

| Sección de la plantilla actual | Regla de rigor añadida |
|---|---|
| `Closes #` | **Obligatorio.** Un PR sin issue vinculado se rechaza automáticamente, sin excepción, incluso para cambios triviales. |
| Checklist Code/Tests/Docs/QA | Todo ítem declarado como cumplido sin evidencia verificable en la sección correspondiente (Screenshots, Casos probados) se considera **falso positivo** y es motivo de rechazo directo, sin negociación. |
| Cambios → Archivos principales | Debe listar cada archivo tocado con una frase de una línea sobre el motivo del cambio en ese archivo específico, no solo el nombre. |
| Testing → Casos probados | Prohibido dejar checkmarks genéricos (`✅`) sin texto descriptivo del caso. Mínimo 3 casos: happy path, edge case, caso de fallo/regresión. |
| Screenshots/Logs (Antes/Después) | Obligatorio para todo cambio con superficie visual o de API response. Ausencia de evidencia = PR no revisable, se retorna a Draft. |
| Deploy | Si se declara `Requiere migración` o `Requiere config`, debe listar exactamente las variables de entorno o comandos de migración — no basta con nombrar la sección. |

### 3.3 Categorización estricta por tipo de PR

**Features:**
- Debe enlazar la sección "Diseño" de Notion en el cuerpo del PR.
- Debe declarar explícitamente qué Acceptance Criteria del Issue quedan cubiertos, uno por uno.

**Bugs:**
- El PR debe contener, en su descripción, la causa raíz copiada textualmente desde Notion (no un resumen distinto — deben ser idénticas para evitar divergencia de narrativa).
- Debe incluir el caso de prueba de regresión que reproduce el bug original y demuestra que ahora falla en `main` (pre-fix) y pasa en la rama (post-fix).
- Prohibido mezclar un fix de bug con refactors no relacionados en el mismo PR.

**Ideas/Refactor:**
- Debe declarar explícitamente "Breaking changes: No/Sí" con justificación técnica, no basta con nombrar la opción.
- Debe incluir sección de métricas antes/después (ya presente en `refactor.md`) diligenciada con números reales, no estimaciones cualitativas ("mejoró la legibilidad" no es una métrica válida).

---

## 4. Checklist de Validación Milimétrica

Criterios de validación únicos que reemplazan cualquier revisión informal. **Todos los criterios son bloqueantes.** Esta lista es información estática de referencia para el revisor — no se marca ni se diligencia dentro del Issue, PR o página de Notion; el revisor la usa como pauta de auditoría y deja constancia del resultado en comentarios de texto, no en casillas.

### 4.1 Trazabilidad
- Existe página de Notion previa al Issue, y el Issue la referencia.
- El Issue de GitHub está vinculado en el PR (`Closes #N`).
- El identificador (`ISSUE-N` o `BUG-...`) aparece de forma idéntica en: Notion, título del Issue, nombre de rama, commits, PR y (tras merge) CHANGELOG.md.
- Si el trabajo derivó en sub-issues o decisiones diferidas, éstos existen como Issues propios, no como comentarios sueltos.

### 4.2 Código y Estilo
- Cumple íntegramente `.rules.md` (nomenclatura, estructura, tipado fuerte, capas).
- Cero `any`, cero `as any`, cero `console.log` de depuración.
- JSDoc de cabecera y Notas de Implementación presentes en todo archivo de lógica nuevo o modificado significativamente.
- Componentes de UI no acceden directamente a Prisma (respetan la capa de servicios).

### 4.3 Verificación Anti-Jules (obligatoria cuando Jules participó)
- Cada ítem que Jules reporta como completo fue verificado leyendo el contenido real del archivo, no solo el diff resumido.
- Si Jules reporta "Tests agregados" o "Tests pasan", el reviewer ejecutó los tests localmente o confirmó el log de CI, no solo la afirmación del agente.
- Cualquier discrepancia entre lo reportado por Jules y el contenido real del archivo se documenta en el PR como comentario antes de aprobar.

### 4.4 Testing
- Unit/Integration tests cubren happy path, edge case y caso de fallo.
- Para bugs: existe test de regresión que falla en pre-fix y pasa en post-fix.
- `npm run test` y `npm run lint` pasan sin warnings.
- Polyfills de Vitest (`PointerEvent`, `ResizeObserver`, métodos `HTMLElement`) confirmados si el cambio toca componentes Radix UI.

### 4.5 Seguridad y Datos
- Validación Zod en toda entrada de usuario nueva, usando `ZodError.issues`.
- Si el cambio toca `SystemAuditLog`, el registro incluye `category`, `action`, `resourceType/Id`, `reason` no vacío.
- Si el cambio toca borrado o modificación de datos con relaciones, se evaluó explícitamente el impacto en integridad referencial, GDPR y auditoría (no se asume "es solo un delete").
- Si el cambio toca `NEXTAUTH_SECRET` u otras variables sensibles, se documentó el impacto en sesiones activas.

### 4.6 Documentación de Cierre
- `CHANGELOG.md` actualizado con entrada siguiendo el formato existente (fecha, commit, tipo, scope, descripción, archivos).
- `CONTEXT.md` actualizado si hubo cambios de schema, estructura de carpetas o dependencias.
- `DEV_NOTES.md` actualizado si hubo una decisión técnica no evidente en el código (por qué esa solución y no otra).
- Página de Notion movida a `✅ Archivo Histórico` con link cruzado a la entrada del CHANGELOG.

### 4.7 Evidencia
- Screenshots o logs de antes/después presentes cuando aplica.
- Build de preview de Vercel verificado y enlazado en el PR.
- Ningún criterio declarado como cumplido en el PR carece de su evidencia correspondiente en el cuerpo del documento.

**Regla de cierre:** un PR que incumpla un solo criterio de esta lista se retorna a `Draft`. No hay aprobaciones condicionales ni "merge y arreglo después".

---

## 5. Reglas de Validación del Revisor

El revisor (`@asebasg`) sigue este protocolo de decisión, en orden estricto:

1. **Gate de Trazabilidad** (§4.1) — si falla, rechazo inmediato sin revisar código.
2. **Gate de Verificación Anti-Jules** (§4.3) — si el PR involucró a Jules y no hay evidencia de auditoría manual, rechazo inmediato.
3. **Gate de Evidencia** (§4.7) — criterios declarados como cumplidos sin evidencia se tratan como incumplidos.
4. **Revisión técnica de código** contra `.rules.md`.
5. **Revisión de testing** contra §4.4.
6. **Revisión de seguridad y datos** contra §4.5.
7. **Aprobación condicionada a documentación de cierre** (§4.6) — se puede aprobar el código y bloquear el merge hasta que CHANGELOG/CONTEXT/DEV_NOTES estén listos, pero nunca mergear sin ellos.

Un PR que falla cualquier gate temprano (1–3) no continúa a revisión técnica; se retorna con el motivo puntual, sin ambigüedad ("falta test de regresión" en vez de "falta más testing").

---

## 6. Vinculación Requerimiento → PR → Documentación (Modelo de Trazabilidad)

```
Requerimiento (05_Historias_de_Usuario.md / decisión de producto)
        │
        ▼
Notion Page (ISSUE-N)  ───────┐
        │                     │ (mismo ID)
        ▼                     ▼
GitHub Issue #N  ◄──────────► Rama tipo/ISSUE-N-slug
        │
        ▼
Commits semánticos (tipo(scope): descripción)
        │
        ▼
Pull Request (Closes #N)
        │
        ▼
Merge a main
        │
        ├──► CHANGELOG.md (entrada con commit hash + scope + ISSUE-N)
        ├──► CONTEXT.md (si aplica: schema/estructura/deps)
        ├──► DEV_NOTES.md (si aplica: decisión técnica)
        └──► monthly-updates.md (agregación mensual, cierre de ciclo)
```

Toda flecha de este diagrama debe ser verificable por cualquier miembro del equipo en menos de tres clics/búsquedas. Si una flecha no es reconstruible, el proceso de documentación de ese cambio se considera **incompleto**, independientemente de si el código funciona en producción.

---

## 7. Anexo: Errores Comunes que Bloquean Aprobación (Registro Vivo)

Esta sección se actualiza con cada incidente real detectado, para evitar reincidencia.

| Patrón detectado | Regla que lo previene |
|---|---|
| Jules reporta trabajo completo sin implementar lógica real | §4.3 Verificación Anti-Jules |
| Causa raíz de bug no confirmada, solo hipótesis | §2.2 — bug permanece en Investigación |
| Alcance de issue crece a mitad de implementación (ej. hard-delete dentro de creación de usuario) | §3.1.4 — descomposición obligatoria en sub-issues |
| Ítem de PR declarado como cumplido sin evidencia en el cuerpo | §4.7 — declaración sin evidencia = incumplido |
| Validación de datos en capa incorrecta (post-upload en vez de pre-upload) | §2.2 — ¿Por qué? debe justificar la capa elegida, no solo el síntoma |

---

*Este documento es de cumplimiento obligatorio para humanos y agentes de IA (incluyendo Jules) que contribuyan al repositorio `asebasg/pawlig`. Cualquier propuesta de modificación a este estándar debe pasar por su propio ciclo de Issue → PR → CHANGELOG, como cualquier otro cambio.*
