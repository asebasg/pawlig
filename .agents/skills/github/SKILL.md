---
name: github
description: Coordina y ejecuta operaciones con el MCP de GitHub (github-mcp-server) para gestionar Issues, ramas, Pull Requests y trazabilidad conforme a documentacion_y_gestion_de_prs.md. Invocable con /github.
---

# GitHub Skill — PawLig

Esta skill instruye al agente para interactuar con el servidor MCP de GitHub (`github-mcp-server`) asegurando el cumplimiento estricto del estándar de trazabilidad de PawLig documentado en [documentacion_y_gestion_de_prs.md](file:///c:/Users/ultra/Proyectos/pawlig/documentacion_y_gestion_de_prs.md) y [.rules.md](file:///c:/Users/ultra/Proyectos/pawlig/.rules.md).

---

## 1. Herramientas MCP Disponibles (`github-mcp-server`)

Para interactuar con GitHub, utiliza `call_mcp_tool` con `ServerName: "github-mcp-server"` y una de las siguientes herramientas:
- `get_issue` / `list_issues` / `search_issues` / `create_issue` / `update_issue` / `add_issue_comment`
- `get_pull_request` / `list_pull_requests` / `create_pull_request` / `merge_pull_request` / `get_pull_request_files` / `get_pull_request_status`
- `create_branch` / `list_commits` / `get_file_contents` / `create_or_update_file` / `push_files`

---

## 2. Reglas de Oro de Trazabilidad en PawLig

1. **Cadena Obligatoria**:
   ```text
   Notion (idea/problema) → GitHub Issue (#N) → Rama (tipo/ISSUE-N-slug)
   → Commits semánticos → PR (Closes #N) → CHANGELOG.md + CONTEXT.md + DEV_NOTES.md
   ```
2. **Ningún Issue sin Notion**: Todo Issue que se cree debe incluir obligatoriamente el enlace a la página correspondiente en Notion en su cuerpo o sección de referencias (§3.1 de documentacion_y_gestion_de_prs.md).
3. **Nomenclatura de Ramas**:
   - Features / Refactor: `<tipo>/ISSUE-<N>-<slug-kebab-case>` (ej. `feat/ISSUE-174-crear-usuario`).
   - Bugs: `fix/<BUG-ID>-<slug-kebab-case>` (ej. `fix/BUG-2026-06-20-001-orphan-cloudinary`).
4. **Nomenclatura de Commits**:
   - Formato en español siguiendo Conventional Commits y las directrices de `.rules.md`:
     `feat(auth): agregar validación de tokens #ISSUE-174`
5. **Revisión de PRs**:
   - Todo PR debe utilizar la plantilla oficial de PawLig (`.github/pull_request_template.md` o la especificada en `documentacion_y_gestion_de_prs.md`).
   - No declarar tareas completadas en PRs sin verificar el código real y las pruebas ejecutadas (§4.3).

---

## 3. Procedimientos Operativos con el MCP

### 3.1 Consultar o Crear Issues
- **Consulta**:
  - Antes de iniciar cualquier tarea, comprueba si el Issue ya existe en el repositorio usando `search_issues` o `list_issues`.
  - Extrae el número del issue (`#N`) o el identificador del bug (`BUG-YYYY-MM-DD-NNN`).
- **Creación**:
  - Usa `create_issue`.
  - Asegúrate de que el título siga la convención:
    - Feature: `Feature — ISSUE-N: <Título>` o descripción asociada al número asignado.
    - Bug: `Bug — BUG-YYYY-MM-DD-NNN: <Título>`.
  - En el cuerpo del Issue, incluye:
    - Enlace a la página de Notion.
    - Descripción del contexto (Esperado vs Actual en bugs).
    - Criterios de aceptación.
    - Subsección `## 🔓 Decisiones Pendientes` si existen decisiones de diseño sin resolver.

### 3.2 Gestión de Ramas
- Valida la rama actual con git o crea la rama requerida con `create_branch` en GitHub si se coordina remotamente:
  - Nombre: `<tipo>/ISSUE-<N>-<slug>` o `fix/<BUG-ID>-<slug>`.

### 3.3 Creación y Gestión de Pull Requests
- Al preparar un Pull Request con `create_pull_request`:
  - **Título**: `<tipo>(<scope>): <descripción breve> (Closes #N)`.
  - **Cuerpo**: Debe apegarse a la estructura de la plantilla de PRs:
    1. Resumen de la solución técnica.
    2. Cierre de issue: `Closes #N` o `Relacionado con BUG-YYYY-MM-DD-NNN`.
    3. Enlace a la página de Notion correspondiente.
    4. Checklist de verificación (código, tests, tipos, documentación actualizada).
- Al revisar un PR con `get_pull_request`, `get_pull_request_files`:
  - Audita que la cadena de trazabilidad esté completa: Notion URL presente, Issue referenciado, y que los archivos modificados correspondan exactamente con el alcance acordado.
