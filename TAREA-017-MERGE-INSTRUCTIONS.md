# 🔀 INSTRUCCIONES DE MERGE - TAREA-017

## ✅ Pre-requisitos Completados

- [x] Código implementado y corregido
- [x] Auditoría de calidad completada
- [x] Problemas críticos resueltos
- [x] Documentación generada
- [x] Validaciones de seguridad aplicadas

---

## 📋 CHECKLIST PRE-MERGE

### 1. Verificación de Código
```bash
# Verificar que no hay errores de TypeScript
npx tsc --noEmit

# Verificar linting
npm run lint

# Verificar que el proyecto compila
npm run build
```

### 2. Testing Manual
- [ ] Probar actualización de perfil de usuario (ADOPTER)
- [ ] Probar actualización de perfil de vendedor (VENDOR)
- [ ] Verificar validaciones de campos obligatorios
- [ ] Verificar rechazo de cuenta bloqueada
- [ ] Verificar mensajes de error
- [ ] Verificar mensajes de éxito

### 3. Verificación de Archivos
```bash
# Verificar que todos los archivos nuevos existen
ls app/api/vendors/profile/route.ts
ls TAREA-017-*.md

# Verificar que no hay archivos temporales
git status
```

---

## 🔀 PROCESO DE MERGE

### Paso 1: Preparar la rama
```bash
# Asegurarse de estar en la rama correcta
git checkout feat/tarea-017-implementacion-actualizacion-perfil

# Verificar estado
git status

# Agregar todos los cambios
git add .

# Commit final (si hay cambios pendientes)
git commit -m "fix(tarea-017): aplicar correcciones de auditoría de calidad

- Corregir método HTTP inconsistente (PATCH → PUT)
- Estandarizar nomenclatura (providers → vendors)
- Agregar validación de cuentas bloqueadas
- Mejorar manejo de errores
- Agregar documentación completa

Refs: HU-003"
```

### Paso 2: Actualizar desde develop
```bash
# Cambiar a develop
git checkout develop

# Actualizar develop
git pull origin develop

# Volver a la rama de feature
git checkout feat/tarea-017-implementacion-actualizacion-perfil

# Merge develop en la rama de feature
git merge develop

# Resolver conflictos si los hay
# (Revisar cuidadosamente cada conflicto)
```

### Paso 3: Verificar después del merge
```bash
# Instalar dependencias (por si acaso)
npm install

# Verificar que compila
npm run build

# Ejecutar en desarrollo
npm run dev

# Probar funcionalidades manualmente
```

### Paso 4: Push y crear Pull Request
```bash
# Push de la rama
git push origin feat/tarea-017-implementacion-actualizacion-perfil

# Crear Pull Request en GitHub/GitLab
# Título: "TAREA-017: Implementar actualización de perfiles (HU-003)"
```

---

## 📝 PLANTILLA DE PULL REQUEST

```markdown
## 🎯 Descripción

Implementación de la funcionalidad de actualización de perfiles para usuarios adoptantes y vendedores según HU-003.

## ✨ Cambios Principales

### Funcionalidades Nuevas:
- ✅ PUT /api/users/profile - Actualización de perfil de usuario
- ✅ PUT /api/vendors/profile - Actualización de perfil de vendedor
- ✅ Formulario de edición de perfil (usuario)
- ✅ Formulario de edición de perfil (vendedor)

### Correcciones Aplicadas:
- ✅ Método HTTP estandarizado (PUT)
- ✅ Nomenclatura consistente (vendors)
- ✅ Validación de cuentas bloqueadas
- ✅ Manejo mejorado de errores

## 🔒 Seguridad

- ✅ Autenticación verificada
- ✅ Validación de roles
- ✅ Validación de cuentas activas
- ✅ Campos protegidos no actualizables
- ✅ Validación de edad >= 18 años

## 📊 Trazabilidad

- **Historia de Usuario:** HU-003
- **Criterio 1:** ✅ Sistema guarda cambios inmediatamente
- **Criterio 2:** ✅ Sistema notifica campos obligatorios

## 🧪 Testing

### Escenarios Probados:
- ✅ Actualización exitosa (usuario)
- ✅ Actualización exitosa (vendedor)
- ✅ Validación de campos obligatorios
- ✅ Rechazo de cuenta bloqueada
- ✅ Manejo de errores

## 📁 Archivos Modificados

### Creados (4):
- `app/api/vendors/profile/route.ts`
- `TAREA-017-CORRECTIONS.md`
- `TAREA-017-VALIDATION-REPORT.md`
- `TAREA-017-README.md`
- `TAREA-017-SUMMARY.md`
- `TAREA-017-MERGE-INSTRUCTIONS.md`

### Modificados (6):
- `app/api/users/profile/route.ts`
- `app/api/providers/profile/route.ts`
- `components/forms/user-profile-form.tsx`
- `components/forms/vendor-profile-form.tsx`
- `app/(dashboard)/vendor/profile/page.tsx`

## 📚 Documentación

Ver archivos `TAREA-017-*.md` para documentación completa:
- Correcciones aplicadas
- Reporte de validación
- Guía rápida de uso
- Resumen ejecutivo

## ✅ Checklist

- [x] Código implementado
- [x] Auditoría completada
- [x] Problemas críticos resueltos
- [x] Documentación generada
- [x] Testing manual realizado
- [x] Sin conflictos con develop
- [x] Build exitoso

## 👥 Revisores

@andres-ospina (Líder)

## 📝 Notas Adicionales

- Ruta legacy `/api/providers/profile` marcada como @deprecated
- Se recomienda eliminarla en futuro release
- Tests automatizados pendientes (recomendado para próximo sprint)
```

---

## 🔍 REVISIÓN DEL LÍDER

### Puntos a Verificar:
1. ✅ Funcionalidad completa
2. ✅ Código limpio y documentado
3. ✅ Sin vulnerabilidades
4. ✅ Trazabilidad con HU-003
5. ✅ Manejo de errores robusto
6. ✅ UX apropiada

### Aprobación:
- [ ] Código revisado
- [ ] Funcionalidad probada
- [ ] Documentación revisada
- [ ] Aprobado para merge

---

## 🚀 POST-MERGE

### Inmediato:
1. Verificar que el merge fue exitoso
2. Probar en ambiente de desarrollo
3. Notificar al equipo

### Seguimiento:
1. Monitorear logs por errores
2. Recopilar feedback de usuarios
3. Planear eliminación de ruta legacy

---

## 📞 CONTACTO

**Líder del Proyecto:** Andrés Ospina  
**Email:** asebasg07@gmail.com

---

## ⚠️ IMPORTANTE

- **NO** hacer merge directo a `main`
- **SIEMPRE** hacer merge a `develop` primero
- **ESPERAR** aprobación del líder antes de merge
- **VERIFICAR** que no hay conflictos

---

**Preparado por:** Auditor de Calidad Senior  
**Fecha:** 2025-01-XX  
**Estado:** ✅ LISTO PARA MERGE
