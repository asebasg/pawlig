# 🔌 API - Ejemplos de Uso (HU-002)

## Endpoints Disponibles

### 1. Crear Solicitud de Albergue

**Endpoint:**
```
POST /api/auth/request-shelter-account
```

**Content-Type:**
```
application/json
```

**Parámetros (Body):**

```json
{
  "email": "juan.perez@ejemplo.com",
  "password": "MiContraseña123",
  "name": "Juan Carlos Pérez García",
  "phone": "+573001234567",
  "municipality": "MEDELLIN",
  "address": "Calle 10 #20-30 Apartamento 405",
  "idNumber": "1234567890",
  "birthDate": "1990-05-15",
  "shelterName": "Albergue Mascotas Felices",
  "shelterMunicipality": "MEDELLIN",
  "shelterAddress": "Calle Principal #100, Medellín",
  "shelterDescription": "Albergue dedicado al rescate, rehabilitación y colocación en familia de perros en situación de calle. Trabajamos desde hace 10 años en el Valle de Aburrá.",
  "contactWhatsApp": "+573001234567",
  "contactInstagram": "@albergue_mascotas_felices"
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Solicitud de cuenta enviada exitosamente. Queda en estado \"Pendiente de aprobación\".",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Errores Posibles:**

1. **Email duplicado (400):**
```json
{
  "message": "El email ya está registrado"
}
```

2. **Validación fallida (400):**
```json
{
  "message": "Validación fallida. Por favor revisa los campos marcados.",
  "errors": {
    "password": "La contraseña debe tener mínimo 8 caracteres",
    "email": "Email inválido",
    "shelterName": "Nombre del albergue requerido"
  }
}
```

3. **Error del servidor (500):**
```json
{
  "message": "Error al procesar la solicitud"
}
```

---

## 2. Listar Solicitudes (Admin)

**Endpoint:**
```
GET /api/admin/shelter-requests
```

**Parámetros Query (Opcionales):**
- `status=PENDING` - Filtrar solo pendientes
- `status=APPROVED` - Filtrar aprobadas
- `status=REJECTED` - Filtrar rechazadas

**Ejemplos:**

```
GET /api/admin/shelter-requests
GET /api/admin/shelter-requests?status=PENDING
GET /api/admin/shelter-requests?status=APPROVED
```

**Respuesta Exitosa (200):**
```json
{
  "count": 3,
  "shelters": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Albergue Mascotas Felices",
      "municipality": "MEDELLIN",
      "address": "Calle Principal #100",
      "description": "Albergue dedicado al rescate...",
      "verified": false,
      "approvalStatus": "PENDING",
      "contactWhatsApp": "+573001234567",
      "contactInstagram": "@albergue_mascotas_felices",
      "rejectionReason": null,
      "createdAt": "2025-11-18T10:30:00.000Z",
      "updatedAt": "2025-11-18T10:30:00.000Z",
      "userId": "507f1f77bcf86cd799439012",
      "user": {
        "id": "507f1f77bcf86cd799439012",
        "email": "juan.perez@ejemplo.com",
        "name": "Juan Carlos Pérez García",
        "phone": "+573001234567",
        "municipality": "MEDELLIN",
        "address": "Calle 10 #20-30 Apartamento 405",
        "idNumber": "1234567890",
        "birthDate": "1990-05-15T00:00:00.000Z"
      }
    }
  ]
}
```

---

## 3. Aprobar Solicitud (Admin)

**Endpoint:**
```
PATCH /api/admin/shelters/{shelterId}
```

**Parámetro de Ruta:**
- `shelterId` - ID del albergue

**Content-Type:**
```
application/json
```

**Body:**
```json
{
  "action": "approve"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Solicitud aprobada correctamente",
  "shelter": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Albergue Mascotas Felices",
    "municipality": "MEDELLIN",
    "address": "Calle Principal #100",
    "description": "Albergue dedicado al rescate...",
    "verified": true,
    "approvalStatus": "APPROVED",
    "contactWhatsApp": "+573001234567",
    "contactInstagram": "@albergue_mascotas_felices",
    "rejectionReason": null,
    "createdAt": "2025-11-18T10:30:00.000Z",
    "updatedAt": "2025-11-18T11:45:00.000Z",
    "userId": "507f1f77bcf86cd799439012"
  }
}
```

---

## 4. Rechazar Solicitud (Admin)

**Endpoint:**
```
PATCH /api/admin/shelters/{shelterId}
```

**Content-Type:**
```
application/json
```

**Body:**
```json
{
  "action": "reject",
  "rejectionReason": "La descripción del albergue es muy vaga. Por favor proporciona más detalles sobre tu operación."
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Solicitud rechazada correctamente",
  "shelter": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Albergue Mascotas Felices",
    "municipality": "MEDELLIN",
    "address": "Calle Principal #100",
    "description": "Albergue dedicado al rescate...",
    "verified": false,
    "approvalStatus": "REJECTED",
    "contactWhatsApp": "+573001234567",
    "contactInstagram": "@albergue_mascotas_felices",
    "rejectionReason": "La descripción del albergue es muy vaga. Por favor proporciona más detalles sobre tu operación.",
    "createdAt": "2025-11-18T10:30:00.000Z",
    "updatedAt": "2025-11-18T11:50:00.000Z",
    "userId": "507f1f77bcf86cd799439012"
  }
}
```

**Errores Posibles:**

1. **Sin razón de rechazo (400):**
```json
{
  "message": "Se requiere una razón de rechazo"
}
```

2. **Acción inválida (400):**
```json
{
  "message": "Acción inválida. Debe ser \"approve\" o \"reject\""
}
```

3. **Albergue no encontrado (404):**
```json
{
  "message": "Albergue no encontrado"
}
```

---

## Ejemplos con cURL

### Crear solicitud:
```bash
curl -X POST http://localhost:3000/api/auth/request-shelter-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "albergue@ejemplo.com",
    "password": "MiContraseña123",
    "name": "Juan Pérez",
    "phone": "+573001234567",
    "municipality": "MEDELLIN",
    "address": "Calle 10 #20",
    "idNumber": "1234567890",
    "birthDate": "1990-05-15",
    "shelterName": "Mi Albergue",
    "shelterMunicipality": "MEDELLIN",
    "shelterAddress": "Calle Principal #100",
    "shelterDescription": "Albergue de rescate",
    "contactWhatsApp": "+573001234567",
    "contactInstagram": "@mi_albergue"
  }'
```

### Listar solicitudes pendientes:
```bash
curl http://localhost:3000/api/admin/shelter-requests?status=PENDING
```

### Aprobar solicitud:
```bash
curl -X PATCH http://localhost:3000/api/admin/shelters/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve"
  }'
```

### Rechazar solicitud:
```bash
curl -X PATCH http://localhost:3000/api/admin/shelters/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject",
    "rejectionReason": "Información incompleta"
  }'
```

---

## Ejemplos con JavaScript/Fetch

### Crear solicitud:
```javascript
const formData = {
  email: 'albergue@ejemplo.com',
  password: 'MiContraseña123',
  name: 'Juan Pérez',
  phone: '+573001234567',
  municipality: 'MEDELLIN',
  address: 'Calle 10 #20',
  idNumber: '1234567890',
  birthDate: '1990-05-15',
  shelterName: 'Mi Albergue',
  shelterMunicipality: 'MEDELLIN',
  shelterAddress: 'Calle Principal #100',
  shelterDescription: 'Albergue de rescate',
  contactWhatsApp: '+573001234567',
  contactInstagram: '@mi_albergue'
};

fetch('/api/auth/request-shelter-account', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Listar solicitudes:
```javascript
fetch('/api/admin/shelter-requests?status=PENDING')
  .then(res => res.json())
  .then(data => console.log(data.shelters))
  .catch(err => console.error(err));
```

### Aprobar solicitud:
```javascript
fetch('/api/admin/shelters/507f1f77bcf86cd799439011', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'approve'
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

---

## Municipios Válidos

```
MEDELLIN
BELLO
ITAGUI
ENVIGADO
SABANETA
LA_ESTRELLA
CALDAS
COPACABANA
GIRARDOTA
BARBOSA
```

## Estados de Aprobación

```
PENDING  - Esperando revisión del administrador
APPROVED - Solicitud aprobada
REJECTED - Solicitud rechazada
```
