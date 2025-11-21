# Historia de Usuario 2 (HU-002) - Solicitud de Cuenta Especializada para Albergue

## Descripción
Como representante de albergue o entidad de rescate, quiero completar un formulario de solicitud de cuenta especializada para que el administrador del sistema me autorice a publicar mascotas y gestionar solicitudes de adopción dentro del Valle de Aburrá.

## Criterios de Aceptación

### CA1: Envío exitoso de solicitud con datos completos
**Dado** que soy un representante de una entidad de rescate
**Cuando** envío el formulario de solicitud de cuenta con todos los datos requeridos
**Entonces** la cuenta queda en estado "Pendiente de aprobación" y se notifica al administrador

**Implementación:**
- ✅ Formulario con validación completa en `components/forms/shelter-request-form.tsx`
- ✅ Ruta API POST `/api/auth/request-shelter-account` que crea usuario y albergue
- ✅ Estado `approvalStatus: PENDING` en el modelo Shelter (Prisma)
- ✅ Enum `ShelterApprovalStatus` con valores: PENDING, APPROVED, REJECTED
- ✅ Transacción que crea Usuario + Shelter simultáneamente
- ✅ Rol de usuario configurado como `SHELTER`

### CA2: Validación de campos obligatorios
**Dado** que envío el formulario sin completar todos los campos obligatorios
**Cuando** intento enviar la solicitud
**Entonces** el sistema me muestra los campos faltantes y no envía la solicitud

**Implementación:**
- ✅ Schema Zod en `lib/validations/user.schema.ts` con validación de todos los campos
- ✅ Validaciones client-side en el componente (validación de Zod)
- ✅ Validaciones server-side en la ruta API
- ✅ Mensajes de error específicos por campo
- ✅ Campos obligatorios claramente marcados con asterisco (*)
- ✅ La solicitud no se envía si hay errores de validación

## Campos Requeridos del Formulario

### Datos del Representante
- Email (email válido, único)
- Contraseña (mínimo 8 caracteres)
- Nombre Completo (mínimo 2 caracteres)
- Número de Identificación (requerido)
- Fecha de Nacimiento (validación de mayor de 18 años)
- Teléfono (7-15 caracteres)
- Municipio (Valle de Aburrá)
- Dirección Personal

### Datos del Albergue
- Nombre del Albergue (requerido, 3-100 caracteres)
- Municipio del Albergue (requerido)
- Dirección del Albergue (requerido, 5-200 caracteres)
- Descripción del Albergue (opcional, mínimo 20 caracteres si se proporciona)
- WhatsApp de Contacto (opcional, formato validado)
- Instagram del Albergue (opcional, formato validado)

## Archivos Creados/Modificados

### Modificados:
1. **prisma/schema.prisma**
   - Agregado enum `ShelterApprovalStatus`
   - Agregado campo `approvalStatus` en modelo `Shelter`
   - Agregado índice en `approvalStatus`

2. **lib/validations/user.schema.ts**
   - Agregado `shelterApplicationSchema` con validaciones completas

### Creados:
1. **components/forms/shelter-request-form.tsx**
   - Componente form con validación client-side
   - Manejo de errores por campo
   - Envío a API
   - Mensaje de éxito

2. **app/api/auth/request-shelter-account/route.ts**
   - POST endpoint para crear solicitud
   - Validación server-side con Zod
   - Transacción de creación usuario+shelter
   - Manejo de errores

3. **app/(auth)/request-shelter/page.tsx**
   - Página de solicitud con instrucciones
   - Información de qué ocurre después
   - Diseño responsive

4. **app/api/admin/shelters/[shelterId]/route.ts**
   - PATCH endpoint para aprobar/rechazar solicitudes (para administrador)
   - Actualización de estado de aprobación
   - Soporte para razón de rechazo

## Estados de Aprobación

- `PENDING`: Solicitud recién creada, esperando revisión del administrador
- `APPROVED`: Solicitud aprobada, usuario puede publicar mascotas
- `REJECTED`: Solicitud rechazada, se proporciona razón del rechazo

## Próximas Implementaciones (TODOs)

1. Envío de emails de notificación:
   - Email al administrador cuando se crea solicitud
   - Email al usuario cuando su solicitud es aprobada/rechazada

2. Dashboard del administrador:
   - Lista de solicitudes pendientes
   - Interfaz para aprobar/rechazar
   - Vista de historial

3. Restricciones de acceso:
   - Solo usuarios aprobados pueden crear mascotas
   - Validación del estado en rutas que requieren albergue

4. Logging y auditoría:
   - Registro de quién aprobó/rechazó y cuándo
   - Registro de cambios

## Testing

Para probar manualmente:

1. **Acceder al formulario:**
   ```
   GET /request-shelter
   ```

2. **Enviar solicitud válida:**
   ```
   POST /api/auth/request-shelter-account
   Content-Type: application/json
   
   {
     "email": "albergue@ejemplo.com",
     "password": "Contraseña123",
     "name": "Juan Pérez",
     "phone": "+573001234567",
     "municipality": "MEDELLIN",
     "address": "Calle 10 #20-30",
     "idNumber": "1234567890",
     "birthDate": "1990-01-01",
     "shelterName": "Albergue Mi Hogar",
     "shelterMunicipality": "MEDELLIN",
     "shelterAddress": "Calle Principal #100",
     "shelterDescription": "Albergue dedicado al rescate y rehabilitación de perros",
     "contactWhatsApp": "+573001234567",
     "contactInstagram": "@mi_albergue"
   }
   ```

3. **Verificar estado pendiente:**
   ```
   Buscar en BD: Shelter.approvalStatus = PENDING
   ```

4. **Probar validación (campo obligatorio vacío):**
   - El formulario debe mostrar error y no enviar

5. **Aprobar solicitud (como admin):**
   ```
   PATCH /api/admin/shelters/{shelterId}
   Content-Type: application/json
   
   {
     "action": "approve"
   }
   ```

6. **Rechazar solicitud (como admin):**
   ```
   PATCH /api/admin/shelters/{shelterId}
   Content-Type: application/json
   
   {
     "action": "reject",
     "rejectionReason": "Información incompleta del albergue"
   }
   ```

## Notas

- El usuario se crea automáticamente con rol `SHELTER` al crear una solicitud
- El albergue se vincula al usuario mediante relación de base de datos
- Los emails de notificación aún están pendientes de implementación
- Se usa Zod para validación completa (client y server)
- La contraseña se hasea con bcryptjs antes de guardarse
