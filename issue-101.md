# [BUG] - Error de sincronización del registro de auditoría asebasg/pawlig#101
Open • asebasg (Sebastián Ospina) opened about 19 hours ago • 0 comments
Assignees: asebasg (Sebastián Ospina)
Labels: bug


  ## 🐛 Bug

  Descripción:

  El registro de auditoría del módulo de user management sí registra las acciones de bloqueo y desbloqueo de usuarios,
  pero hay un problema crítico de sincronización y refresco de datos. Los cambios en el historial de auditoría no se
  visualizan en tiempo real. El contenido solo se muestra después de un tiempo muy prolongado, lo que afecta la
  experiencia del administrador y la capacidad de validar acciones inmediatamente.

  Reproducir:

  1. Iniciar sesión como administrador.
  2. Acceder al perfil de un usuario.
  3. Realizar una acción de bloqueo o desbloqueo sobre la cuenta.
  4. Revisar inmediatamente el historial de auditoría en la misma página.
  5. Observar que la acción NO aparece en el registro.
  6. Esperar un tiempo prolongado o recargar manualmente la página.
  7. Recién entonces el registro de auditoría se actualiza.

  Esperado vs Actual:

  • Esperado: Después de realizar una acción de bloqueo/desbloqueo, el sistema debe mostrar el registro de auditoría
  inmediatamente al recargar la página o mediante un hot reload automático, sin necesidad de esperar un tiempo
  indefinido.
  • Actual: El historial de auditoría se registra correctamente en la base de datos, pero no se refleja en la UI en 
  tiempo real. Solo aparece después de un tiempo muy prolongado o requiere una recarga manual forzada.

  --------

  ## 📋 Metadata

  Status:

  [ ] 📋 Todo (no iniciado)
  [ ] 🔄 En Progreso (trabajando activamente)
  [ ] 👀 En Revisión (para ser aprobado)
  [ ] ✅ Finalizado (completado)

  Priority:

  [ ] P0 - Crítico (sistema caído/pérdida de datos/seguridad)
  [✓] P1 - Alto (funcionalidad principal rota)
  [ ] P2 - Medio (afecta experiencia pero no bloquea)
  [ ] P3 - Bajo (cosmético/menor/nice-to-have)

  Size (Story Points):

  [ ] XS (< 1h - cambio trivial)
  [ ] S (1-2h - cambio simple)
  [✓] M (2-4h - cambio pequeño)
  [ ] L (1 día - cambio mediano)
  [ ] XL (2-3 días - cambio grande)
  [ ] XXL (> 3 días - cambio muy grande)

  Archivos afectados:

  •  app/(dashboard)/admin/users/[id]/view/page.tsx 
  •  components/admin/AuditHistoryCard.tsx 
  •  components/admin/UserActionsClient.tsx 
  •  app/api/admin/users/[id]/block/route.ts 

  --------

  ## ✅ TODO

  ### Investigación

  [ ] Reproducir localmente
  [ ] Identificar causa raíz (problema de revalidación de datos, caché, o refresco de componentes)
  [ ] Revisar estrategia de revalidación en Next.js

  ### Fix

  [ ] Implementar revalidación inmediata después de la acción de bloqueo/desbloqueo
  [ ] Agregar hot reload o refetch automático de datos de auditoría
  [ ] Opcionalmente: agregar actualización en tiempo real (WebSocket o polling)
  [ ] Agregar/actualizar tests
  [ ] Validar que no rompe nada

  ### QA

  [ ] Probar en dev
  [ ] Probar casos edge (múltiples acciones seguidas, cambios rápidos)
  [ ] Validar en staging

  ## 🔍 Contexto

  Entorno:

  • OS: Producción
  • Browser/Version: Todos
  • App Version: Actual

  Logs/Screenshots:

    El registro de auditoría se guarda correctamente en la BD, pero la UI no se actualiza inmediatamente.
    La acción solo es visible después de:
    1. Esperar un tiempo prolongado (varios minutos)
    2. Recargar manualmente la página (F5)

  Impacto:

  • Usuarios afectados: Administradores del sistema
  • Severidad: Afecta la usabilidad y la capacidad de validar acciones en tiempo real
  • Workaround disponible: [x] Sí (recargar la página manualmente) [ ] No

  --------

  Para Jules: Fix this bug. The audit data is being saved correctly to the DB, but there's a synchronization issue
  with the UI refresh. Implement immediate revalidation/hot reload when block/unblock actions complete. Run existing
  tests, add new ones if needed, ensure no regressions.


View this issue on GitHub: https://github.com/asebasg/pawlig/issues/101
