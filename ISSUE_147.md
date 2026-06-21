title:	[FEATURE] - Refinamiento con IA para razones de auditoría administrativa
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	enhancement
comments:	0
assignees:	
projects:	
milestone:	
number:	147
--
## ✨ Feature

**¿Qué?**
Extender el sistema de refinamiento con IA (`/api/ai/refine`) para formalizar y estandarizar los campos de razón en formularios de acciones de auditoría administrativa del panel de admin. El objetivo es que el administrador escriba la razón en texto natural y la IA transforme el texto en un registro formal, técnico y acotado (≤300 caracteres) para auditoría.

**¿Por qué?**
Mejora la trazabilidad y profesionalización de los registros de auditoría, asegurando que las razones almacenadas eviten ambigüedades y lenguaje coloquial, facilitando revisiones posteriores y cumplimiento normativo.

**¿Cómo funciona?**
1. El administrador ingresa una razón en texto libre en los formularios de bloqueo/desbloqueo de usuario, cambio de rol, aprobación/rechazo de albergues/negocios.
2. Oprime el botón de refinamiento. Un componente UI reutilizable hace la petición a `/api/ai/refine` con el tipo de moderación.
3. La IA devuelve el texto formal refinado; el administrador puede usarlo tal cual, editarlo, o enviarlo.

# Archivos afectados
- `app/api/ai/refine/route.ts`: agregar `type: "moderation"`
- `components/ui/ai-refine-button.tsx`: crear componente
- `components/admin/BlockUserModal.tsx`: integrar botón
- `components/admin/RoleChangeModal.tsx`: integrar botón
- Formularios de aprobación/rechazo admin: integrar botón

---

## 📋 Metadata

**Status:**
- [x] 📋 Todo (no iniciado)
- [ ] 🔄 En Progreso (trabajando activamente)
- [ ] 👀 En Revisión (para ser aprobado)
- [ ] ✅ Finalizado (completado)

**Priority:**
- [ ] P0 - Crítico (blocker/requerimiento esencial)
- [ ] P1 - Alto (alta demanda/valor de negocio)
- [ ] P2 - Medio (mejora importante)
- [x] P3 - Bajo (nice-to-have)

**Size (Story Points):**
- [ ] XS (< 1h - cambio trivial)
- [x] S (1-2h - cambio simple)
- [ ] M (2-4h - cambio pequeño)
- [ ] L (1 día - cambio mediano)
- [ ] XL (2-3 días - cambio grande)
- [ ] XXL (> 3 días - cambio muy grande)

**Componentes:**
- [x] Frontend
- [x] Backend
- [ ] Database
- [x] API
- [ ] Tests
- [ ] Docs

---

## ✅ TODO

### Diseño

- [x] Definir arquitectura
- [x] Diseñar API/interfaces
- [x] Mockups/wireframes (si aplica)

### Implementación
- [x] Setup inicial
- [x] Implementar lógica core
- [x] Integrar con sistema existente
- [x] Manejar edge cases

### Testing
- [ ] Unit tests
- [x] Integration tests
- [ ] E2E tests (si aplica)

### Finalización
- [x] Code review
- [ ] Actualizar docs
- [x] Validar performance

---

## 🎯 Acceptance Criteria

- Los campos de razón en formularios de bloqueo/desbloqueo de usuario, cambio de rol y aprobación/rechazo en admin muestran el botón de refinamiento.
- El refinamiento llama `/api/ai/refine` con `{ description, type: "moderation" }` y usa el modelo configurado.
- El texto resultante cumple las reglas: ≤300 caracteres, lenguaje formal, sin información inventada, ni ambigüedades ni subjetividad.

---

## 🔧 Tech Spec

**Stack sugerido:**
- TypeScript, Next.js App Router, gemini-2.5-flash, lucide-react, sonner

**Endpoints/Componentes nuevos:**
- POST `/api/ai/refine` (agregar caso `type: "moderation"`)
- `components/ui/ai-refine-button.tsx` (componente reutilizable)

**Migrations/Schema changes:**
No aplica

**Dependencies:**
- gemini-2.5-flash
- lucide-react
- sonner

---

## 📎 Referencias

- Patron visual: botón de refinado ya usado en `pet-form.tsx` y `product-form.tsx`
- API exist: `/api/ai/refine`
- Ejemplo de integración en modales y formularios admin

---

**Para Jules:** Implement this feature following the tech spec. Ensure all acceptance criteria are met and tests pass.

