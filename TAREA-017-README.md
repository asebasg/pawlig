# TAREA-017: Actualización de Perfiles - Guía Rápida

## 🎯 Objetivo
Implementar funcionalidad de actualización de perfiles para usuarios adoptantes y vendedores según HU-003.

---

## 📍 Endpoints Implementados

### 1. Perfil de Usuario (ADOPTER)
```
GET  /api/users/profile    - Obtener datos actuales
PUT  /api/users/profile    - Actualizar perfil
```

**Campos actualizables:**
- name (obligatorio)
- phone (obligatorio)
- municipality (obligatorio)
- address (obligatorio)
- idNumber (obligatorio)
- birthDate (obligatorio, >= 18 años)

**Campos protegidos:**
- email, password, role, isActive

---

### 2. Perfil de Vendedor (VENDOR)
```
GET  /api/vendors/profile   - Obtener datos actuales
PUT  /api/vendors/profile   - Actualizar perfil
```

**Campos actualizables:**
- businessName (obligatorio)
- businessPhone (opcional)
- description (opcional, 20-1000 chars)
- logo (opcional, URL válida)
- municipality (obligatorio)
- address (obligatorio)

**Campos protegidos:**
- verified, rejectionReason, userId

---

## 🖥️ Interfaces de Usuario

### Usuario Adoptante
**Ruta:** `/dashboard/profile`
- Accesible para cualquier usuario autenticado
- Formulario: `components/forms/user-profile-form.tsx`

### Vendedor
**Ruta:** `/dashboard/vendor/profile`
- Solo accesible para usuarios con rol VENDOR
- Formulario: `components/forms/vendor-profile-form.tsx`

---

## 🔒 Seguridad

### Validaciones Implementadas:
- ✅ Autenticación requerida (NextAuth)
- ✅ Verificación de rol (VENDOR para vendedores)
- ✅ Validación de cuenta activa (isActive)
- ✅ Validación Zod en cliente y servidor
- ✅ Campos protegidos no actualizables

### Códigos de Error:
- `401` - No autenticado
- `403` - Rol incorrecto o cuenta bloqueada
- `400` - Errores de validación
- `404` - Usuario/Vendedor no encontrado
- `500` - Error del servidor

---

## 🧪 Testing Manual

### Escenario 1: Actualización exitosa (Usuario)
1. Login como ADOPTER
2. Ir a `/dashboard/profile`
3. Modificar campos (ej: nombre, teléfono)
4. Click en "Guardar Cambios"
5. **Esperado:** Mensaje verde "Perfil actualizado exitosamente"

### Escenario 2: Validación de campos obligatorios
1. Login como usuario
2. Ir a `/dashboard/profile`
3. Borrar campo obligatorio (ej: nombre)
4. Click en "Guardar Cambios"
5. **Esperado:** Error rojo "Nombre debe tener al menos 2 caracteres"

### Escenario 3: Cuenta bloqueada
1. Admin bloquea cuenta de usuario
2. Usuario intenta actualizar perfil
3. **Esperado:** Error "Cuenta bloqueada. No puedes actualizar tu perfil."

### Escenario 4: Actualización exitosa (Vendedor)
1. Login como VENDOR
2. Ir a `/dashboard/vendor/profile`
3. Modificar campos (ej: businessName, description)
4. Click en "Guardar Cambios"
5. **Esperado:** Mensaje verde "Perfil actualizado exitosamente"

### Escenario 5: Validación de edad
1. Login como usuario
2. Ir a `/dashboard/profile`
3. Cambiar birthDate a menos de 18 años
4. Click en "Guardar Cambios"
5. **Esperado:** Error "Debes ser mayor de 18 años"

---

## 📦 Archivos Principales

### Backend (API Routes):
```
app/api/users/profile/route.ts      - Endpoint de usuarios
app/api/vendors/profile/route.ts    - Endpoint de vendedores (NUEVO)
app/api/providers/profile/route.ts  - Legacy (deprecado)
```

### Frontend (Páginas):
```
app/(dashboard)/profile/page.tsx           - Página de perfil usuario
app/(dashboard)/vendor/profile/page.tsx    - Página de perfil vendedor
```

### Componentes:
```
components/forms/user-profile-form.tsx     - Formulario usuario
components/forms/vendor-profile-form.tsx   - Formulario vendedor
```

### Validaciones:
```
lib/validations/user.schema.ts             - Schemas Zod
```

---

## 🔄 Flujo de Actualización

```
1. Usuario accede a página de perfil
   ↓
2. Página carga datos actuales (GET endpoint)
   ↓
3. Usuario edita campos en formulario
   ↓
4. Validación Zod en cliente (tiempo real)
   ↓
5. Click en "Guardar Cambios"
   ↓
6. PUT request al endpoint correspondiente
   ↓
7. Validación Zod en servidor
   ↓
8. Actualización en MongoDB (Prisma)
   ↓
9. Respuesta con éxito o errores
   ↓
10. Mensaje de confirmación o errores en UI
```

---

## 🐛 Problemas Conocidos y Soluciones

### ❌ Error: "Method Not Allowed (405)"
**Causa:** Formulario enviando método incorrecto
**Solución:** ✅ Corregido - Ambos usan PUT

### ❌ Error: "Perfil de vendedor no encontrado"
**Causa:** Usuario no tiene registro en tabla Vendor
**Solución:** Verificar que el usuario tenga rol VENDOR y registro en Vendor

### ❌ Error: "Cuenta bloqueada"
**Causa:** isActive = false
**Solución:** Contactar administrador para desbloqueo

---

## 📚 Documentación Adicional

- **Correcciones aplicadas:** Ver `TAREA-017-CORRECTIONS.md`
- **Reporte de validación:** Ver `TAREA-017-VALIDATION-REPORT.md`
- **Historias de usuario:** Ver documentación del proyecto (HU-003)

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Verificar tipos TypeScript
npx tsc --noEmit

# Linting
npm run lint

# Prisma Studio (ver datos)
npx prisma studio

# Regenerar cliente Prisma
npx prisma generate
```

---

## 📞 Contacto

**Equipo:** Andrés Ospina (Líder), Mateo Úsuga, Santiago Lezcano  
**Instructor:** Mateo Arroyave Quintero  
**Proyecto:** PawLig - SENA 2025

---

**Última actualización:** 2025-01-XX  
**Estado:** ✅ Completado y validado
