title:	[FEATURE] - Modal de Restablecimiento de Contraseña Funcional
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	enhancement
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	225
--
## ✨ Feature
 
**¿Qué?**
 
Implementación integral del flujo de restablecimiento de contraseña en la plataforma PawLig:
 
1. Modal de solicitud accesible desde `/login` mediante enlace "¿Olvidaste tu contraseña?"
2. Envío de correo con enlace único de restablecimiento vía Resend
3. Página segura `/reset-password?token=<unique_token>` con validación de identidad
4. Tokens válidos únicamente por 60 minutos (3600 segundos)
5. Cambio seguro de credenciales con hasheo en bcryptjs y redirección a login
**¿Por qué?**
 
- Recuperabilidad de Cuenta: Los usuarios olvidan contraseñas; sin este flujo, pierden acceso permanente
- Seguridad: Tokens únicos y efímeros previenen ataques de fuerza bruta o reutilización
- Experiencia UX: Modal intuitivo reduce fricción y mejora retención de usuarios
- Validación de Sesión: El sistema no debe crear sesiones automáticas tras cambio; requiere nuevo login
**¿Cómo funciona?**
 
```
Usuario en /login
    ↓
Clica "¿Olvidaste tu contraseña?" → Abre Modal
    ↓
Ingresa correo → Validación Zod (email válido + exists en DB)
    ↓
Clica "Enviar enlace" → POST /api/auth/forgot-password
    ↓
Backend: Crea PasswordResetToken (token único + expiración 60 min)
    ↓
Envía correo vía Resend con URL: https://pawlig.lat/reset-password?token=<unique_token>
    ↓
Retorna 200 OK (sin revelar existencia de usuario → previene enumeración)
    ↓
Usuario recibe correo → Clica enlace → Navega a /reset-password?token=X
    ↓
Validación de token: Existe, vigente, no usado
    ↓
Si válido: Muestra formulario (Nueva contraseña + Confirmar)
Si inválido/expirado: Error + enlace para solicitar nuevo correo
    ↓
Usuario completa formulario → Validación Zod (passwords match, min 8 chars)
    ↓
POST /api/auth/reset-password con token + nueva contraseña
    ↓
Backend: Verifica token, hashea contraseña, actualiza User.password, marca token como used
    ↓
Retorna 200 OK + Cliente redirecciona a /login con toast de éxito
    ↓
Usuario puede usar nueva contraseña para iniciar sesión
```
 
---
 
## ✅ TODO
 
### Diseño
 
- [ ] Definir arquitectura de seguridad de tokens
- [ ] Diseñar API/interfaces (endpoints, schemas Zod)
- [ ] Validar wireframes/mockups (modal + página reset)
### Implementación
 
- [ ] Setup inicial de componentes y páginas
- [ ] Implementar lógica core (generación de tokens, hashing)
- [ ] Integrar con sistema existente (login-form, email service)
- [ ] Manejar edge cases (token inválido, expirado, usado)
### Testing
 
- [ ] Unit tests (password.test.ts)
- [ ] Integration tests (route.test.ts)
- [ ] E2E tests (flujo completo)
- [ ] Test de regresión (contraseña anterior no funciona)
### Finalización
 
- [ ] Code review
- [ ] Validar en staging
- [ ] Actualizar docs (CONTEXT.md, DEV_NOTES.md)
- [ ] CHANGELOG.md
- [ ] Cerrar decisiones pendientes
---
 
## 🎯 Acceptance Criteria
 
### A. Modal de Solicitud de Correo
- [ ] Componente `ForgotPasswordModal` accesible desde `/login`
- [ ] Input de correo con validación Zod en cliente (email válido)
- [ ] Botón "Enviar enlace" deshabilitado mientras se envía (loading state)
- [ ] Mensaje de éxito genérico: "Si la cuenta existe, recibirás un correo en los próximos minutos"
- [ ] Manejo de errores de red (retry, toast)
- [ ] Modal cerrable (X o Escape)
### B. Endpoint POST /api/auth/forgot-password
- [ ] Validación Zod: email requerido, formato válido
- [ ] Consulta en DB: busca User por email
- [ ] Generación de Token: `crypto.randomBytes(32)` → `sha256()` → almacenado en `PasswordResetToken`
- [ ] Expiración: `expiresAt = now() + 3600000ms` (60 minutos)
- [ ] Envío de Correo: plantilla `password-reset.tsx` con enlace único
- [ ] Respuesta: 200 OK siempre (sin revelar existencia de usuario)
- [ ] Rate Limiting: máximo 3 solicitudes por email/5 minutos (prevenir spam)
### C. Página /reset-password
- [ ] Server Component con guard: valida que exista parámetro `token` en query
- [ ] Búsqueda de `PasswordResetToken` en DB
- [ ] Validaciones:
  - Token existe
  - Token NO ha expirado (`expiresAt > now()`)
  - Token NO fue usado previamente (`used = false`)
- [ ] Si válido: renderiza formulario (`ResetPasswordForm`)
- [ ] Si inválido/expirado: muestra error + link para "Solicitar nuevo enlace"
- [ ] Estilos responsivos (mobile-first)
### D. Formulario de Restablecimiento
- [ ] Dos inputs: "Nueva contraseña" + "Confirmar contraseña"
- [ ] Validación Zod:
  - Mínimo 8 caracteres
  - Máximo 128 caracteres
  - Passwords coinciden
  - No reutilizar contraseña anterior (consulta password hasheada)
- [ ] Visibilidad toggleable de contraseña (usar `PasswordInput` existente)
- [ ] Botón "Cambiar contraseña" con loading state
- [ ] Manejo de errores (token inválido, expirado, etc.)
### E. Endpoint POST /api/auth/reset-password
- [ ] Validación Zod: `token` + `password` + `passwordConfirm` requeridos
- [ ] Búsqueda de `PasswordResetToken` y validaciones (existe, vigente, no usado)
- [ ] Búsqueda de `User` asociado
- [ ] Hash de nueva contraseña (bcryptjs, 12 rondas)
- [ ] Transacción atómica:
  - Actualizar `User.password`
  - Marcar `PasswordResetToken.used = true`
- [ ] Respuesta: 200 OK + JSON `{ success: true }`
- [ ] Cliente: Toast de éxito + redirección a `/login` tras 2 segundos
### F. Seguridad & Auditoría
- [ ] Tokens almacenados como SHA-256 (nunca en texto plano)
- [ ] Registro en `SystemAuditLog` (acción: PASSWORD_RESET, categoría: USER_MANAGEMENT)
- [ ] Sin rate limiting en `/reset-password` GET (solo validar token)
- [ ] CSRF protection: usar tokens de Next.js (automático en Route Handlers)
- [ ] HTTPS obligatorio en producción
### G. Plantilla de Correo
- [ ] Email responsivo con logo de PawLig
- [ ] Asunto: "Restablece tu contraseña en PawLig"
- [ ] Enlace con token: `https://pawlig.lat/reset-password?token=<token_hash>`
- [ ] Texto de advertencia: "Este enlace expira en 60 minutos"
- [ ] Footer con información de contacto
### H. Testing
- [ ] Unit tests: `password.test.ts` (generación de tokens, hashing)
- [ ] Integration tests: `route.test.ts` (endpoints forgot/reset)
- [ ] Test de regresión: validar que contraseña anterior NO funciona post-reset
- [ ] Test de expiración: token > 60 min debe rechazarse
---
 
## 🔧 Tech Spec
 
**Stack sugerido:**
- Frontend: React Hook Form + Zod + Next.js Suspense
- Backend: Prisma ORM + Resend + bcryptjs
- Seguridad: Tokens SHA-256, CSRF automático, HTTPS obligatorio
**Endpoints/Componentes nuevos:**
- Componente: `ForgotPasswordModal` (`components/modals/forgot-password-modal.tsx`)
- Componente: `ResetPasswordForm` (`components/forms/reset-password-form.tsx`)
- Página: `/reset-password` (`app/(auth)/reset-password/page.tsx`)
- Endpoint: `POST /api/auth/forgot-password`
- Endpoint: `POST /api/auth/reset-password`
**Archivos modificados:**
- `components/forms/login-form.tsx` — Integrar enlace modal
- `lib/auth/password.ts` — Agregar utilidades de token
- `lib/validations/user.schema.ts` — Esquemas Zod
- `lib/email/templates/password-reset.tsx` — Verificar/ajustar
- `app/api/auth/forgot-password/route.ts` — Auditar + refactor
**Migrations/Schema changes:**
```sql
-- Ya existe en schema.prisma:
model PasswordResetToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  token     String   @unique
  userId    String   @db.ObjectId
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@index([expiresAt])
}
```
 
**Dependencies:**
- Resend (ya instalado)
- bcryptjs (ya instalado)
- Zod (ya instalado)
- crypto (nativa de Node.js)
---
 
## 📎 Referencias
 
- **Notion:** [Link a la página de Notion — se actualiza tras crear el Issue]
- **Documentación relacionada:** CHANGELOG.md v1.7.0 (24-04-2026) - Sistema de Email
- **Similar a:** ISSUE-174 (Alta manual de usuarios con tokens seguros)
- **Docs:** CONTEXT.md - Sección 1.1 (Integración de Rutas y Autenticación)
---
 
## 🔓 Decisiones Pendientes
 
1. **¿Duración del token?** Especificación dice 60 minutos. ¿Confirmado?
2. **¿Rate limit diferenciado?** ¿Mismo límite para todos o IP-based?
3. **¿Plantilla de correo ya finalizada?** ¿Necesita ajustes visuales?
4. **¿Log de auditoría detallado?** ¿Registrar intentos fallidos?
5. **¿Invalidar sesiones activas?** Si el usuario hace reset, ¿cerrar otras sesiones?
---
 
## 📝 Notas Adicionales
 
**Referencia Histórica:**
Versión v1.7.0 (24-04-2026) declaró la implementación de este sistema, pero requiere auditoría y refactor completo para garantizar funcionalidad en la página principal de login.
 
**Criterios de Aceptación de PR:**
- ✅ Todos los tests pasan (`npm test -- --run`)
- ✅ ESLint sin warnings (`npm run lint`)
- ✅ Coverage > 80% en servicios de auth
- ✅ Screenshots de flujo e2e en descripción del PR
- ✅ Link a staging con funcionalidad verificada
---
 
**Para Jules:** Implementa esta feature siguiendo el tech spec. Asegura que todos los acceptance criteria se cumplan y que los tests pasen. Audita el código existente en v1.7.0 antes de partir desde cero o refactorizar.
 
