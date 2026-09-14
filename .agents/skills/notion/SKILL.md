---
name: notion
description: Coordina y ejecuta operaciones con el MCP de Notion (notion-mcp-server) para documentar y gestionar páginas, backlog y estados según documentacion_y_gestion_de_prs.md. Invocable con /notion.
---

# Notion Skill — PawLig

Esta skill instruye al agente para interactuar con el servidor MCP de Notion (`notion-mcp-server`) asegurando el cumplimiento estricto del estándar de trazabilidad y estructura de páginas de PawLig documentado en [documentacion_y_gestion_de_prs.md](file:///c:/Users/ultra/Proyectos/pawlig/documentacion_y_gestion_de_prs.md).

---

## 1. Herramientas MCP Disponibles (`notion-mcp-server`)

Para interactuar con Notion, utiliza `call_mcp_tool` con `ServerName: "notion-mcp-server"` y una de las siguientes herramientas:
- `API-post-search`: Buscar páginas o bases de datos por título o texto.
- `API-retrieve-a-page` / `API-patch-page` / `API-post-page`: Consultar propiedades, actualizar o crear nuevas páginas.
- `API-retrieve-page-markdown` / `API-update-page-markdown`: Obtener o editar directamente el contenido en Markdown de una página.
- `API-get-block-children` / `API-patch-block-children`: Gestionar bloques hijos en una página o contenedor.
- `API-query-data-source` / `API-retrieve-a-database`: Consultar registros filtrados en bases de datos de Notion.
- `API-create-a-comment` / `API-retrieve-a-comment`: Agregar o inspeccionar comentarios de discusión en páginas.

---

## 2. Reglas de Estructura de Página en Notion (§2.1)

Toda página creada o editada en Notion debe respetar de manera obligatoria la estructura definida en `documentacion_y_gestion_de_prs.md`:

| Sección | Features | Bugs | Ideas / Refactor |
|---|---|---|---|
| **Título** | `Feature — ISSUE-N: Título` | `Bug — BUG-YYYY-MM-DD-NNN: Título` | `Refactor — ISSUE-N: Título` / `Idea — Título` |
| **¿Qué?** | Sí | Sí (síntoma observable que se rompe) | Sí |
| **¿Por qué?** | Sí | **Causa raíz confirmada** (obligatorio) | Sí (justificación técnica) |
| **¿Cómo funciona?** | Sí (comportamiento esperado) | Sí (solución propuesta y alternativas evaluadas) | Sí (patrón/principio aplicado) |
| **Diseño** | Sí | Opcional si el fix es trivial (< 1h) | Sí |
| **Implementación** | Sí | Sí | Sí |
| **Testing** | Sí | Sí (incluye caso de regresión) | Sí |
| **Finalización** | Sí | Sí | Sí |

### Regla estricta para Bugs (§2.2):
- **¿Qué?**: Solo describe el síntoma observable ("El usuario X no puede hacer Y"), nunca la causa técnica interna.
- **¿Por qué?**: Causa raíz técnica exacta con referencia a archivo, línea y función. Prohibido indicar "no se sabe" o "posiblemente". Si no está confirmada, la página debe permanecer en `🔄 En Investigación`.
- **¿Cómo funciona?**: Justificar la solución elegida frente a alternativas.

---

## 3. Estados de Página y Sincronización (§2.3)

Los estados deben mantenerse sincronizados 1:1 con GitHub:
```text
📋 Todo → 🔄 En Progreso → 👀 En Revisión → ✅ Finalizado
```

- **Todo**: Registrada en Backlog, sin trabajo activo en código.
- **En Progreso**: Issue abierto en GitHub y rama creada.
- **En Revisión**: PR abierto en GitHub con el link del PR pegado en la página de Notion.
- **Finalizado**: PR mergeado a `main`, CHANGELOG.md actualizado y pruebas verificadas.

---

## 4. Procedimientos Operativos con el MCP

### 4.1 Buscar y Consultar
- Usa `API-post-search` o `API-query-data-source` para localizar la página correspondiente por su identificador (`ISSUE-N` o `BUG-YYYY-MM-DD-NNN`).
- Usa `API-retrieve-page-markdown` para leer el contenido detallado y verificar el estado actual de las secciones.

### 4.2 Crear una Página de Especificación
- Antes de abrir un Issue en GitHub, crea la página en la base de datos o carpeta correspondiente de Notion con `API-post-page`.
- Inicializa el contenido con las 7 secciones obligatorias.
- Asigna el estado inicial `📋 Todo`.

### 4.3 Actualizar Estados y Enlaces Cruzados
- Al comenzar desarrollo: Actualiza el estado a `🔄 En Progreso` con `API-patch-page`.
- Al abrir un PR: Pega el enlace del PR de GitHub en la página y actualiza el estado a `👀 En Revisión`.
- Al mergear: Actualiza el estado a `✅ Finalizado`.
