# PawLig Context Rules

Este proyecto utiliza el estándar oficial y agnóstico documentado en [.rules.md](file:///C:/Users/ultra/Proyectos/pawlig/.rules.md).

Para cualquier tarea de desarrollo en este repositorio:
1. Consulta y aplica estrictamente todas las normas de estilo, nomenclatura, JSDoc y notas de pie de página definidas en `.rules.md`.
2. Sigue las convenciones de commits en español especificadas en dicho archivo.
3. Antes de trabajar en cualquier nueva feature, lee el archivo `documentacion_y_gestion_de_prs.md` y procede bajo lo que dice ese documento.
4. El estándar de estilos UI/UX del proyecto está en `DESIGN.md` y este debe seguirse al pie de la letra cada que se modifique alguna página.
5. Toda ejecución de comandos de terminal, scripts o tareas en segundo plano no debe exceder los **5 minutos**. Si la tarea supera este tiempo sin mostrar un resultado final, el asistente debe detenerla/cancelarla inmediatamente. Excepciones: Esta regla no aplica para procesos cruciales o naturalmente extensos como la instalación de dependencias (`npm install`), validación estricta de linting/tipos, builds de producción o la ejecución completa de la suite de tests (`npx vitest run`).