title:	[BUG] - Imágenes huérfanas en Cloudinary tras error de validación
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	bug
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	161
--
## 🐛 Bug

**Descripción:**

Durante el upload simultáneo de múltiples imágenes en formularios (mascotas, productos, albergues), cuando una o más imágenes **exceden el límite de 5MB**, el sistema muestra un toast de error pero genera un estado inconsistente crítico:

- ✅ Las imágenes válidas **SÍ se cargan a Cloudinary** exitosamente
- ❌ Las imágenes válidas **NO se reflejan en la UI** del formulario
- ❌ Las imágenes **quedan "huérfanas"** en Cloudinary sin referencia en la base de datos
- ⚠️ El usuario no sabe que se cargaron y puede intentar resubir (**duplicación**)
- ⚠️ Al recargar la página, las imágenes desaparecen de la UI pero permanecen en Cloudinary

**Flujo del error:**

1. Usuario selecciona múltiples imágenes (ej: img1 2MB, img2 3MB, img3 10MB)
2. Sistema inicia upload concurrente a Cloudinary
3. img1 e img2 se cargan exitosamente → URLs obtenidas
4. img3 falla por tamaño
5. Validación Zod rechaza img3
6. **PROBLEMA:** img1 e img2 no se muestran en la UI
7. **PROBLEMA:** Las URLs exitosas no se asignan al formulario
8. Usuario recarga la página
9. **PROBLEMA:** Imágenes desaparecen de la UI pero persisten en Cloudinary

**Reproducir:**

1. Acceder a `/shelter/pets/new` o `/vendor/products/new`
2. Completar campos básicos (nombre, descripción, etc.)
3. En sección de imágenes, seleccionar 3 archivos:
   - `imagen1.jpg` (2MB)
   - `imagen2.jpg` (3MB)
   - `imagen_grande.jpg` (10MB o superior)
4. Confirmar selección
5. Observar toast de error por archivo excedido
6. Recargar la página (F5 o Ctrl+R)

**Esperado vs Actual:**

| Escenario | Esperado | Actual |
|-----------|----------|--------|
| **Upload con 1+ error** | Muestra toast de error, imágenes válidas persisten en UI con URLs de Cloudinary | Toast de error, imágenes válidas desaparecen de UI |
| **Representación en UI** | Imágenes válidas listadas con opción de eliminar | Ninguna imagen visible después del error |
| **Cloudinary** | Solo imágenes aprobadas se guardan | Imágenes huérfanas sin referencia en app |
| **Recargar página** | Imágenes se recuperan desde Cloudinary | Imágenes desaparecen de UI |
| **Feedback al usuario** | "X imágenes cargadas, Y rechazadas" | Solo muestra error genérico |
| **Re-submit** | Validación previene duplicados | Puede crear registros duplicados |

---

## 📋 Metadata

**Status:**

- [x] 📋 Todo (no iniciado)
- [ ] 🔄 En Progreso (trabajando activamente)
- [ ] 👀 En Revisión (para ser aprobado)
- [ ] ✅ Finalizado (completado)

**Priority:**

- [x] P0 - Crítico (sistema caído/pérdida de datos/seguridad)
- [ ] P1 - Alto (funcionalidad principal rota)
- [ ] P2 - Medio (afecta experiencia pero no bloquea)
- [ ] P3 - Bajo (cosmético/menor/nice-to-have)

**Size (Story Points):**

- [ ] XS (< 1h - cambio trivial)
- [ ] S (1-2h - cambio simple)
- [ ] M (2-4h - cambio pequeño)
- [x] L (1 día - cambio mediano)
- [ ] XL (2-3 días - cambio grande)
- [ ] XXL (> 3 días - cambio muy grande)

**Archivos afectados:**

- `components/forms/pet-form.tsx`
- `components/forms/product-form.tsx`
- `components/forms/shelter-request-form.tsx`
- `lib/cloudinary.ts`
- `lib/validations/pet.schema.ts`
- `lib/validations/product.schema.ts`
- `app/api/cloudinary/sign/route.ts`
- `app/api/cloudinary/delete/route.ts`

---

## ✅ TODO

### Investigación

- [ ] Reproducir localmente en pet-form.tsx
- [ ] Reproducir en product-form.tsx
- [ ] Reproducir en shelter-request-form.tsx
- [ ] Identificar dónde se pierden las URLs exitosas en el estado
- [ ] Revisar flujo de validación Zod vs upload Cloudinary
- [ ] Analizar cómo se manejan errores parciales

### Fix

- [ ] **Solución recomendada:** Validación previa de tamaño/tipo ANTES de subir a Cloudinary
  - Usar `FileList.prototype.forEach()` y `File.size` check
  - Solo subir imágenes que pasan validación local
- [ ] Implementar estado granular: `{ file, status, cloudinaryUrl, error }`
- [ ] Mostrar imágenes exitosas incluso si algunas fallan
- [ ] Permitir eliminar imágenes fallidas del formulario
- [ ] Feedback granular en toast: "2 imágenes cargadas, 1 rechazada"
- [ ] Guardar URLs exitosas en localStorage con key `{formType}-{timestamp}`
- [ ] Recuperar URLs desde localStorage al recargar
- [ ] Limpiar localStorage al guardar el formulario exitosamente

### QA

- [ ] Probar upload de 1 imagen válida + 1 inválida
- [ ] Probar upload de 5 imágenes (mix válidas e inválidas)
- [ ] Probar recarga de página después de error
- [ ] Probar que no hay duplicación en Cloudinary
- [ ] Validar en dev con diferentes tamaños/formatos
- [ ] Probar casos edge: imagen exactamente 5MB, 5.1MB, 0 bytes

## 🔍 Contexto

**Entorno:**

- OS: Multiplataforma (Chrome, Firefox, Safari, Edge)
- Browser/Version: Todos (reproducible consistentemente)
- App Version: v1.8.0

**Reproducibilidad:**

- ✅ **100% reproducible** - Error consistente en todos los navegadores/OS
- Sin patrones específicos - Falla con todas las imágenes >5MB

**Logs/Screenshots:**

```
Toast Error: "El archivo [nombre] excede el tamaño máximo de 5MB"

Network Tab:
- POST /api/cloudinary/sign → 200 OK (para 2 imágenes)
- Las URLs se reciben correctamente en el cliente
- Pero no aparecen en el estado del formulario

Console (sin errores críticos - es lógica de UI)
```

**Impacto:**

- **Usuarios afectados:** Todos los que suben múltiples imágenes (shelters, vendors, adoptantes)
- **Workaround disponible:** ❌ No existe workaround conocido
- **Acumulación:** Imágenes huérfanas se acumulan en Cloudinary indefinidamente
- **Gasto:** Costo innecesario en almacenamiento y ancho de banda

**Análisis de Raíz:**

1. Las imágenes se suben a Cloudinary ANTES de validarse con Zod
2. Cuando la validación falla, no hay lógica para "rescatar" las URLs exitosas
3. El estado del formulario no se sincroniza con las imágenes cargadas
4. No hay persistencia (localStorage/sesión) para recuperar en recarga
5. Un solo error detiene la visualización de todas las imágenes válidas

---

## ✅ Checklist de Aceptación

- [ ] Imágenes válidas se muestran en UI aunque una falle
- [ ] Toast muestra feedback granular: "2 imágenes cargadas, 1 rechazada (excede 5MB)"
- [ ] URLs de Cloudinary se asignan correctamente al estado del formulario
- [ ] Recarga de página recupera imágenes desde localStorage
- [ ] No hay duplicación de imágenes en Cloudinary
- [ ] Validación de tamaño es clara y ocurre ANTES del upload
- [ ] Tests en pet-form.spec.tsx, product-form.spec.tsx
- [ ] No hay imágenes huérfanas creadas después del fix
- [ ] Script de limpieza identifica y elimina huérfanas después de 48h

---

**Para Jules:** Este es un bug P0 crítico. Se necesita refactorizar el flujo de upload para validar ANTES de subir a Cloudinary y mantener sincronización de estado correcto. Las imágenes huérfanas deben eliminarse automáticamente.
