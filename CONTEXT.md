# Contexto y Estructura del Proyecto — PawLig (v1.15.1)

> **Última actualización**: 21 de agosto de 2026.
> **Versión**: v1.15.1

---

## 1. Esquema de la Base de Datos (schema.prisma)

> **Sincronización del esquema de base de datos realizada el 21 de agosto de 2026**: Este bloque de código representa una copia exacta y fiel de `prisma/schema.prisma` para asegurar consistencia absoluta con el ORM.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// ===== ENUMS =====
enum Municipality {
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
}

enum UserRole {
  ADMIN
  SHELTER
  VENDOR
  ADOPTER
}

enum AuditAction {
  BLOCK
  UNBLOCK
  CHANGE_ROLE
  DELETE
}

enum AuditCategory {
  USER_MANAGEMENT
  SHELTER_MODERATION
  VENDOR_MODERATION
}

enum PetStatus {
  AVAILABLE
  IN_PROCESS
  ADOPTED
}

enum AdoptionStatus {
  PENDING
  APPROVED
  REJECTED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum ProductCategory {
  ALIMENTO
  JUGUETES
  ACCESORIOS
  HIGIENE
  MEDICAMENTOS
  OTROS
}

// ===== MODELS =====

model User {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  email        String       @unique
  password     String
  name         String
  role         UserRole     @default(ADOPTER)
  phone        String
  municipality Municipality
  address      String
  idNumber     String
  birthDate    DateTime

  // Bloqueos de usuarios (HU-014)
  isActive    Boolean   @default(true)
  blockedAt   DateTime?
  blockedBy   String?   @db.ObjectId
  blockReason String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  shelter             Shelter?
  vendor              Vendor?
  adoptions           Adoption[]
  orders              Order[]
  favorites           Favorite[]
  passwordResetTokens PasswordResetToken[]
  cartItems           CartItem[]

  // Auditoría (HU-014) - Migrado a SystemAuditLog
  // (Las relaciones directas a logs se manejan manualmente dado el polimorfismo de SystemAuditLog)

  @@index([role])
  @@index([isActive])
  @@index([municipality])
}


model Shelter {
  id               String       @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  nit              String       @unique
  municipality     Municipality
  address          String
  description      String?
  verified         Boolean      @default(false)
  contactWhatsApp  String?
  contactInstagram String?
  rejectionReason  String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @unique @db.ObjectId

  pets Pet[]

  @@index([verified])
  @@index([municipality])
  @@index([name])

  // Campos para geolocalización
  latitude         Float?
  longitude        Float?
  geocodedAt       DateTime?

  @@index([latitude, longitude])
  @@index([geocodedAt])
}

model Vendor {
  id              String       @id @default(auto()) @map("_id") @db.ObjectId
  businessName    String
  businessPhone   String?
  description     String?
  logo            String?
  municipality    Municipality
  address         String
  verified        Boolean      @default(false)
  rejectionReason String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @unique @db.ObjectId

  products Product[]

  @@index([verified])
  @@index([municipality])
  @@index([businessName])
}

model Pet {
  id           String    @id @default(auto()) @map("_id") @db.ObjectId
  name         String
  species      String
  breed        String?
  age          Int?
  months       Int?
  sex          String?
  status       PetStatus @default(AVAILABLE)
  description  String
  requirements String?
  images       String[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  shelter   Shelter @relation(fields: [shelterId], references: [id], onDelete: Cascade)
  shelterId String  @db.ObjectId

  adoptions Adoption[]
  favorites Favorite[]

  @@index([status])
  @@index([species])
  @@index([shelterId])
  @@index([createdAt])
  @@index([name])
  @@index([sex])
  @@index([age])
}

model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  price       Float
  stock       Int      @default(0)
  category    ProductCategory
  description String?
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  vendor   Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId String @db.ObjectId

  orderItems OrderItem[]
  cartItems  CartItem[]

  @@index([category])
  @@index([vendorId])
  @@index([stock])
  @@index([name])
  @@index([price])
}

model Adoption {
  id        String         @id @default(auto()) @map("_id") @db.ObjectId
  status    AdoptionStatus @default(PENDING)
  message   String?
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  adopter   User   @relation(fields: [adopterId], references: [id], onDelete: Cascade)
  adopterId String @db.ObjectId

  pet   Pet    @relation(fields: [petId], references: [id], onDelete: Cascade)
  petId String @db.ObjectId

  @@unique([adopterId, petId])
  @@index([status])
  @@index([adopterId])
  @@index([petId])
  @@index([createdAt])
}

model Order {
  id                   String       @id @default(auto()) @map("_id") @db.ObjectId
  status               OrderStatus  @default(PENDING)
  total                Float
  shippingMunicipality Municipality
  shippingAddress      String
  paymentMethod        String
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @db.ObjectId

  items OrderItem[]

  @@index([status])
  @@index([userId])
  @@index([shippingMunicipality])
  @@index([createdAt])
}

model OrderItem {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  quantity Int
  price    Float

  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId String @db.ObjectId

  product   Product @relation(fields: [productId], references: [id])
  productId String  @db.ObjectId

  @@index([orderId])
  @@index([productId])
}

model Favorite {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String   @db.ObjectId
  pet       Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  petId     String   @db.ObjectId

  @@unique([userId, petId])
  @@index([userId])
  @@index([petId])
  @@index([createdAt])
}

model PasswordResetToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  token     String   @unique
  userId    String   @db.ObjectId
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model CartItem {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  quantity Int    @default(1)

  // Relaciones
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @db.ObjectId

  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String  @db.ObjectId

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Índices para performance
  @@unique([userId, productId]) // Un usuario no puede tener el mismo producto duplicado
  @@index([userId])
  @@index([productId])
  @@index([createdAt])
}

model SystemAuditLog {
  id           String        @id @default(auto()) @map("_id") @db.ObjectId
  category     AuditCategory
  action       String        // Ej: "APPROVE", "REJECT", "BLOCK", "CHANGE_ROLE"
  actorId      String        @db.ObjectId 
  actorEmail   String
  resourceType String        // Ej: "SHELTER", "VENDOR", "USER"
  resourceId   String        @db.ObjectId 
  before       String?       // JSON String
  after        String?       // JSON String
  reason       String
  ipAddress    String?
  userAgent    String?
  requestId    String?       // Correlación para tracing
  createdAt    DateTime      @default(now())

  @@index([category])
  @@index([action])
  @@index([resourceType, resourceId])
  @@index([createdAt])
}
```

---

### 1.1 Integración de Rutas y Comportamiento Lógico de Base de Datos (Alta de Usuarios)

La plataforma cuenta con un flujo seguro para el alta manual de usuarios administrativos y comerciales, garantizando la trazabilidad de estas operaciones en la base de datos de MongoDB.

#### Rutas de Frontend
- **/admin/moderation/users/create (Ruta de Frontend)**:
  - **Tipo**: Server Component protegido (`app/(dashboard)/admin/moderation/users/create/page.tsx`).
  - **Descripción**: Interfaz gráfica administrativa que renderiza el formulario modular `CreateUserForm` (`components/forms/create-user-form.tsx`).
  - **Seguridad (Guard de Servidor)**: Requiere una sesión de usuario válida (`getServerSession`) y que el rol del usuario autenticado sea estrictamente `UserRole.ADMIN`. De lo contrario, se redirige al inicio de sesión o a `/unauthorized?reason=admin_only`.

#### Endpoints de API
- **POST /api/admin/users (Ruta de API)**:
  - **Tipo**: Route Handler dinámico (`app/api/admin/users/route.ts`).
  - **Descripción**: Procesa la validación de entrada con Zod (`createUserByAdminSchema`), verifica la inexistencia de correos electrónicos duplicados (tanto cuentas activas como cuentas bloqueadas), autogenera una clave temporal segura y delega la lógica de persistencia al servicio de usuario.
  - **Seguridad**: Solo accesible bajo el rol `ADMIN`. Retorna códigos de estado HTTP precisos: `401 Unauthorized` si no hay sesión, `403 Forbidden` si no es administrador, `400 Bad Request` en fallos de validación Zod, `409 Conflict` si el correo está ocupado, y `201 Created` al crearse de forma exitosa.

#### Comportamiento y Flujo en la Base de Datos
La persistencia de datos implementa las siguientes reglas lógicas del negocio directamente en el ORM de Prisma (MongoDB):
1. **Lógica de Auditoría Polimórfica (`SystemAuditLog`)**:
   - El modelo `SystemAuditLog` se utiliza para registrar la creación de cualquier usuario.
   - Las operaciones se agrupan en una **transacción interactiva** (`prisma.$transaction(async (tx) => ...)`) lo que garantiza que el alta del registro en la tabla `User` y la bitácora en `SystemAuditLog` sean operaciones **atómicas**.
   - Al ser interactiva, se recupera el ID autogenerado del nuevo `User` y se mapea directamente en el campo `resourceId` (como ObjectID de MongoDB) del log de auditoría.
   - El log se registra con la acción `"CREATE"`, la categoría `AuditCategory.USER_MANAGEMENT` y el tipo de recurso `"USER"`. El campo `before` se almacena como `null`, y `after` guarda el string JSON que contiene el `email` y el `role` asignados.
2. **Justificación Obligatoria de Roles Especiales**:
   - Para roles diferentes a `ADOPTER` (tales como `ADMIN`, `SHELTER`, `VENDOR`), se exige una justificación (`reason`) descriptiva con una longitud mínima de 10 caracteres. Esta lógica es controlada por el esquema Zod `createUserByAdminSchema.refine` y persistida directamente en el campo `reason` del registro de auditoría.
   - Para el rol por defecto `ADOPTER`, la base de datos almacena la razón estándar fija `"Usuario creado manualmente por administrador"`.
3. **Seguridad de Credenciales**:
   - Las contraseñas temporales no se persisten en texto plano en la base de datos; se hashean utilizando `bcryptjs` con 12 rondas de sal antes de insertarse en el campo `password` del modelo `User`.

---

### 1.2 Eliminación Segura de Imágenes e Integridad de Adopciones (v1.15.1)

El servicio `deletePet` (`lib/services/pet.service.ts`) encapsula las operaciones de baja física de mascotas y limpieza automatizada de almacenamiento:

1. **Integridad Relacional de Adopciones**:
   - Antes de ejecutar cualquier borrado, se verifica si la mascota tiene solicitudes en el modelo `Adoption` (`prisma.adoption.findMany({ where: { petId } })`).
   - Si existen postulaciones pendientes o activas, se arroja un error descriptivo impidiendo la eliminación y manteniendo la consistencia de la base de datos.
2. **Borrado en Cascada en Cloudinary**:
   - Tras remover exitosamente la entidad en Prisma, se extraen los identificadores multimedia y se ejecuta `deleteImagesFromCloudinary(imageUrls)` de forma asíncrona no bloqueante, purgando recursos huérfanos del bucket de Cloudinary.

---

## 2. Estructura del Proyecto

> **Mapeo de la estructura de carpetas realizado el 21 de agosto de 2026**: Representación jerárquica de todos los archivos y carpetas del repositorio, excluyendo dependencias y compilaciones. Los directorios finalizan siempre con una barra diagonal `/`.

```text
./
├── .env.local.example
├── .eslintrc.json
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md
│   │   ├── documentation.md
│   │   ├── feature-request.md
│   │   ├── performance.md
│   │   └── refactor.md
│   └── pull_request_template.md
├── .gitignore
├── .rules.md
├── CHANGELOG.md
├── CONTEXT.md
├── DEV_NOTES.md
├── README.md
├── credentials-seed.txt
├── documentacion_y_gestion_de_prs.md
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── unauthorized/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   ├── dev/
│   │   │   │   ├── docs/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── metrics/
│   │   │   │   └── page.tsx
│   │   │   ├── moderation/
│   │   │   │   ├── audit/
│   │   │   │   │   ├── audit-log-viewer.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── shelters/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── shelter-moderation-client.tsx
│   │   │   │   ├── users/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── view/
│   │   │   │   │   │       ├── __tests__/
│   │   │   │   │   │       │   └── user-view.spec.tsx
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── block-user-modal.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── users-management-client.tsx
│   │   │   │   └── vendors/
│   │   │   │       ├── page.tsx
│   │   │   │       └── vendor-moderation-client.tsx
│   │   │   ├── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── shelter/
│   │   │   ├── adoptions/
│   │   │   │   └── page.tsx
│   │   │   ├── metrics/
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pets/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── user/
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── request-shelter/
│   │   │   │   └── page.tsx
│   │   │   └── request-vendor/
│   │   │       └── page.tsx
│   │   └── vendor/
│   │       ├── metrics/
│   │       │   └── page.tsx
│   │       ├── orders/
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       ├── products/
│   │       │   ├── [id]/
│   │       │   │   └── edit/
│   │       │   │       └── page.tsx
│   │       │   ├── new/
│   │       │   │       └── page.tsx
│   │       │   └── page.tsx
│   │       └── profile/
│   │           └── page.tsx
│   ├── (public)/
│   │   ├── adopciones/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── albergues/
│   │   │   └── page.tsx
│   │   ├── changelog/
│   │   │   ├── changelog-client.tsx
│   │   │   ├── dev/
│   │   │   │   ├── dev-notes-client.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── help/
│   │   │   └── page.tsx
│   │   ├── nosotros/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── productos/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── docs/
│   │   │   │   └── [slug]/
│   │   │   │       └── pdf/
│   │   │   │           └── route.ts
│   │   │   ├── metrics/
│   │   │   │   ├── adoptions/
│   │   │   │   │   ├── export/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── sales/
│   │   │   │       ├── export/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── orders/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── products/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── route.ts
│   │   │   │       └── trends/
│   │   │   │           └── route.ts
│   │   │   ├── moderation/
│   │   │   │   ├── audit/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── shelters/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── vendors/
│   │   │   │       ├── [id]/
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── shelter-requests/
│   │   │   │   └── route.ts
│   │   │   ├── shelters/
│   │   │   │   └── [shelterId]/
│   │   │   │       └── route.ts
│   │   │   └── users/
│   │   │       ├── [id]/
│   │   │       │   ├── block/
│   │   │       │   │   └── route.ts
│   │   │       │   └── role/
│   │   │       │       └── route.ts
│   │   │       ├── route.test.ts
│   │   │       └── route.ts
│   │   ├── adoptions/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── ai/
│   │   │   └── refine/
│   │   │       └── route.ts
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts
│   │   │   ├── forgot-password/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── cart/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── cloudinary/
│   │   │   ├── cleanup/
│   │   │   │   ├── route.test.ts
│   │   │   │   └── route.ts
│   │   │   ├── delete/
│   │   │   │   └── route.ts
│   │   │   └── sign/
│   │   │       └── route.ts
│   │   ├── pets/
│   │   │   ├── [id]/
│   │   │   │   ├── favorite/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── route.ts
│   │   │   │   └── status/
│   │   │   │       └── route.ts
│   │   │   ├── route.ts
│   │   │   └── search/
│   │   │       └── route.ts
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts
│   │   │   │   └── stock/
│   │   │   │       └── route.ts
│   │   │   └── route.ts
│   │   ├── shelter/
│   │   │   ├── adoptions/
│   │   │   │   └── route.ts
│   │   │   └── reports/
│   │   │       └── adoptions/
│   │   │           ├── export/
│   │   │           │   └── route.ts
│   │   │           └── route.ts
│   │   ├── shelters/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── map/
│   │   │   │   └── route.ts
│   │   │   └── search/
│   │   │       └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   ├── user/
│   │   │   ├── favorites/
│   │   │   │   ├── check/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── profile/
│   │   │   │   └── route.ts
│   │   │   ├── request-shelter-account/
│   │   │   │   └── route.ts
│   │   │   └── request-vendor-account/
│   │   │       └── route.ts
│   │   └── vendor/
│   │       ├── metrics/
│   │       │   ├── export/
│   │       │   │   └── route.ts
│   │       │   ├── orders/
│   │       │   │   └── route.ts
│   │       │   ├── products/
│   │       │   │   └── route.ts
│   │       │   ├── route.ts
│   │       │   └── trends/
│   │       │       └── route.ts
│   │       └── profile/
│   │           └── route.ts
│   ├── fonts/
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── PetDetailClient.tsx
│   ├── PetGalleryClient.tsx
│   ├── ProductDetailClient.tsx
│   ├── ProductGalleryClient.tsx
│   ├── admin/
│   │   ├── AdminDashboardClient.tsx
│   │   ├── AuditHistoryCard.tsx
│   │   ├── BlockUserButton.tsx
│   │   ├── DevDashboardClient.tsx
│   │   ├── EditUserButton.tsx
│   │   ├── RoleChangeModal.tsx
│   │   ├── UserActionsClient.tsx
│   │   ├── UserViewClient.tsx
│   │   ├── approve-request-modal.tsx
│   │   ├── docs/
│   │   │   ├── doc-viewer.tsx
│   │   │   └── docs-sidebar.tsx
│   │   ├── metrics/
│   │   │   ├── admin-dashboard-tabs.tsx
│   │   │   └── admin-metrics-client.tsx
│   │   ├── moderation-tabs.tsx
│   │   └── reject-request-modal.tsx
│   ├── adopter/
│   │   ├── adopter-dashboard-client.tsx
│   │   ├── adoptions-section.tsx
│   │   ├── cart-section.tsx
│   │   └── favorites-section.tsx
│   ├── cards/
│   │   ├── pet-card.tsx
│   │   ├── product-card.tsx
│   │   └── shelter-pet-card.tsx
│   ├── cart/
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── filters/
│   │   ├── pet-filter.tsx
│   │   └── product-filter.tsx
│   ├── forms/
│   │   ├── __tests__/
│   │   │   ├── pet-form.spec.tsx
│   │   │   └── product-form.spec.tsx
│   │   ├── create-user-form.tsx
│   │   ├── login-form.tsx
│   │   ├── pet-form.tsx
│   │   ├── product-form.tsx
│   │   ├── register-form.tsx
│   │   ├── shelter-request-form.tsx
│   │   ├── user-profile-form.tsx
│   │   ├── vendor-profile-form.tsx
│   │   └── vendor-request-form.tsx
│   ├── help/
│   │   └── accordion-section.tsx
│   ├── layout/
│   │   ├── cart-button.tsx
│   │   ├── floating-cart-button.tsx
│   │   ├── footer.tsx
│   │   ├── index.ts
│   │   ├── navbar-auth.tsx
│   │   ├── navbar-mobile.tsx
│   │   ├── navbar-public.tsx
│   │   ├── navbar.tsx
│   │   ├── under-construction.tsx
│   │   └── user-menu.tsx
│   ├── map/
│   │   ├── interactive-map.tsx
│   │   ├── legal-info-modal.tsx
│   │   ├── shelter-card.tsx
│   │   └── shelters-map-client.tsx
│   ├── modals/
│   │   ├── adoption-confirm-modal.tsx
│   │   ├── form-timeout-modal.test.tsx
│   │   ├── form-timeout-modal.tsx
│   │   ├── leave-form-confirm-modal.test.tsx
│   │   └── leave-form-confirm-modal.tsx
│   ├── products/
│   │   └── PaymentModal.tsx
│   ├── shelter/
│   │   ├── AdoptionStats.tsx
│   │   ├── ShelterDashboardClient.tsx
│   │   ├── adoptions/
│   │   │   ├── adoptions-client.tsx
│   │   │   ├── adoptions-table.tsx
│   │   │   ├── application-card.tsx
│   │   │   ├── applications-list.tsx
│   │   │   └── approval-modal.tsx
│   │   └── metrics/
│   │       ├── adoption-charts.tsx
│   │       ├── adoption-filters.tsx
│   │       ├── adoption-metrics-client.tsx
│   │       ├── adoption-table.tsx
│   │       └── export-buttons.tsx
│   ├── shelters/
│   │   ├── municipality-filter.tsx
│   │   └── shelter-search.tsx
│   ├── ui/
│   │   ├── address-input.tsx
│   │   ├── ai-refine-button.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button-variants.ts
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── confetti-button.tsx
│   │   ├── dialog.tsx
│   │   ├── favorite-button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loader.tsx
│   │   ├── logo.tsx
│   │   ├── pagination-system.tsx
│   │   ├── password-input.tsx
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   └── table.tsx
│   └── vendor/
│       ├── ProductTable.tsx
│       ├── ProductsClient.tsx
│       ├── StockUpdateModal.tsx
│       ├── VendorDashboardClient.tsx
│       ├── VendorStats.tsx
│       └── metrics/
│           ├── metrics-cards.tsx
│           ├── metrics-filters.tsx
│           ├── orders-by-status-chart.tsx
│           ├── sales-chart.tsx
│           ├── top-products-table.tsx
│           └── vendor-metrics-client.tsx
├── credentials-seed.txt
├── lib/
│   ├── auth/
│   │   ├── auth-options.ts
│   │   ├── password.test.ts
│   │   ├── password.ts
│   │   ├── require-role.ts
│   │   └── session.ts
│   ├── cloudinary.ts
│   ├── constants.ts
│   ├── email/
│   │   ├── components/
│   │   │   └── EmailLayout.tsx
│   │   └── templates/
│   │       ├── account-blocked.tsx
│   │       ├── adoption-status.tsx
│   │       ├── new-adoption.tsx
│   │       ├── new-order-vendor.tsx
│   │       ├── order-confirmation.tsx
│   │       ├── order-status.tsx
│   │       ├── password-reset.tsx
│   │       ├── shelter-approved.tsx
│   │       ├── shelter-rejected.tsx
│   │       ├── vendor-approved.tsx
│   │       └── vendor-rejected.tsx
│   ├── hooks/
│   │   ├── use-cart-sync.ts
│   │   ├── use-cart.ts
│   │   ├── use-unsaved-images-guard.test.ts
│   │   └── use-unsaved-images-guard.ts
│   ├── services/
│   │   ├── adoption-report.service.ts
│   │   ├── adoption.service.ts
│   │   ├── cart.service.ts
│   │   ├── docs.service.ts
│   │   ├── email.service.test.ts
│   │   ├── email.service.ts
│   │   ├── geocoding.service.ts
│   │   ├── moderation.service.spec.ts
│   │   ├── moderation.service.ts
│   │   ├── pet.service.spec.ts
│   │   ├── pet.service.ts
│   │   ├── product.service.ts
│   │   ├── user.service.spec.ts
│   │   ├── user.service.ts
│   │   └── vendor-metrics.service.ts
│   ├── utils/
│   │   ├── age-formatter.test.ts
│   │   ├── age-formatter.ts
│   │   ├── cloudinary-helpers.ts
│   │   ├── db.ts
│   │   ├── export-csv.ts
│   │   ├── export-excel.ts
│   │   ├── export-pdf.ts
│   │   └── logger.ts
│   ├── utils.ts
│   └── validations/
│       ├── adoption.schema.ts
│       ├── cart.schema.ts
│       ├── cloudinary.schema.ts
│       ├── pet-search.schema.ts
│       ├── pet.schema.ts
│       ├── product.schema.ts
│       ├── user.schema.test.ts
│       └── user.schema.ts
├── middleware.ts
├── monthly-updates.md
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── docs/
│   │   ├── 01_Acta_de_Constitucion.md
│   │   ├── 02_Stakeholders.md
│   │   ├── 03_Alcance_del_Proyecto.md
│   │   ├── 04_Requerimientos.md
│   │   ├── 05_Historias_de_Usuario.md
│   │   ├── 06_Mapa_de_Procesos.md
│   │   ├── 07_Casos_de_Uso.md
│   │   ├── 08_Arquitectura_Software.md
│   │   ├── 09_Modelo_Entidad_Relacion.md
│   │   ├── 10_Diagramas_UML.md
│   │   ├── 11_Manual_Diseño.md
│   │   ├── 12_Plan_de_Pruebas.md
│   │   ├── 13_Casos_de_Prueba.md
│   │   └── 14_Manual_del_Usuario.md
│   └── images/
│       ├── 404-page.png
│       ├── adopcion.png
│       ├── diagrama_clases.png
│       ├── diagrama_flujo_general.png
│       ├── diagrama_uml.png
│       ├── gestionar_citas.png
│       ├── medellin-map.png
│       ├── nosotros_hero_image_1778473832814.png
│       ├── pet-adopted.png
│       ├── pet-community.png
│       ├── pet-home.png
│       ├── pet.png
│       ├── postular_adopcion.png
│       ├── publicar_mascota.png
│       ├── simular_compra.png
│       └── under_construction.png
├── scripts/
│   ├── cleanup-orphaned-images.test.ts
│   ├── cleanup-orphaned-images.ts
│   ├── create-pr.ps1
│   ├── create-pr.sh
│   ├── geocode-shelters.ts
│   └── test-live-emails.ts
├── tailwind.config.ts
├── tsconfig.json
├── types/
│   ├── adoption.ts
│   ├── api.types.ts
│   ├── docs.types.ts
│   ├── email.types.ts
│   ├── next-auth.d.ts
│   ├── report.types.ts
│   ├── shelter.ts
│   └── upload.types.ts
├── vitest.config.ts
└── vitest.setup.ts
```

---

## 3. Dependencias del Proyecto

> **Análisis de dependencias realizado el 21 de agosto de 2026**: Esta sección presenta una categorización exhaustiva y rigurosa de todas las librerías, frameworks y herramientas clave utilizadas en el proyecto (extraídas directamente de `package.json`), organizadas y agrupadas según su propósito técnico específico.

### Dependencias de Producción

- **Frontend Core**:
  - `next`: `14.2.33` - Framework de React optimizado para producción con SSR, routing basado en carpetas y optimización de recursos.
  - `react`: `^18` - Biblioteca base para la creación de interfaces de usuario basadas en componentes declarativos.
  - `react-dom`: `^18` - Paquete que sirve como punto de entrada a los métodos específicos del DOM para React.
  - `swr`: `^2.4.1` - Biblioteca para la obtención, almacenamiento en caché y revalidación de datos en tiempo real de manera eficiente.

- **UI & Components**:
  - `@radix-ui/react-checkbox`: `^1.3.3` - Primitivo de componente de checkbox accesible y sin estilos para mayor flexibilidad de diseño.
  - `@radix-ui/react-label`: `^2.1.8` - Primitivo de componente de etiqueta accesible con soporte para lectores de pantalla.
  - `@radix-ui/react-radio-group`: `^1.3.8` - Primitivo de componente de grupo de selección radial accesible y navegable con teclado.
  - `@radix-ui/react-select`: `^2.2.6` - Primitivo de componente de selección desplegable accesible y personalizable.
  - `@radix-ui/react-slot`: `^1.2.4` - Utilidad para la composición de componentes mediante slots, permitiendo fusionar props en el componente hijo.
  - `lucide-react`: `^0.554.0` - Set de iconos vectoriales SVG ligeros, consistentes y optimizados para React.
  - `sonner`: `^2.0.7` - Biblioteca para notificaciones tipo toast elegantes, ligeras y altamente personalizables.
  - `class-variance-authority`: `^0.7.1` - Herramienta para la gestión declarativa de variantes CSS y estados de componentes UI.
  - `clsx`: `^2.1.1` - Utilidad para la concatenación condicional y limpia de nombres de clases CSS.
  - `tailwind-merge`: `^3.4.0` - Utilidad para fusionar clases de Tailwind CSS en tiempo de ejecución de forma eficiente y sin conflictos.
  - `react-day-picker`: `^10.0.0` - Componente de calendario interactivo para la selección de fechas individuales o rangos.
  - `recharts`: `^3.8.1` - Biblioteca de gráficos interactivos y modulares basada en componentes de React y D3.

- **Formularios & Validación**:
  - `react-hook-form`: `^7.66.1` - Gestión eficiente del estado de formularios con validación flexible, minimizando renders innecesarios.
  - `@hookform/resolvers`: `^5.2.2` - Adaptadores para integrar esquemas de validación externos como Zod con react-hook-form.
  - `zod`: `^4.1.12` - Biblioteca de declaración de esquemas y validación de tipos en tiempo de ejecución de alta eficiencia.

- **Database & ORM**:
  - `@prisma/client`: `^6.2.1` - Cliente de base de datos autogenerado, reactivo y type-safe para interactuar con MongoDB.

- **Autenticación & Seguridad**:
  - `next-auth`: `^4.24.7` - Solución completa y segura de autenticación y autorización para aplicaciones Next.js.
  - `bcryptjs`: `^3.0.3` - Biblioteca nativa para el hashing y verificación segura de contraseñas mediante algoritmos criptográficos.

- **Servicios Externos & IA**:
  - `cloudinary`: `^2.8.0` - SDK oficial para la carga, gestión, transformación y entrega optimizada de medios en la nube.
  - `@google/generative-ai`: `^0.24.1` - Cliente oficial de Google para interactuar con los modelos avanzados de IA generativa Gemini.

- **Emailing System**:
  - `resend`: `^6.12.2` - API moderna y de alta confiabilidad para el envío de correos electrónicos transaccionales y masivos.
  - `@react-email/components`: `^1.0.12` - Colección de componentes de React para diseñar correos responsivos compatibles con múltiples clientes de email.
  - `@react-email/render`: `^2.0.7` - Utilidad para transformar y renderizar plantillas de React Email a código HTML plano y optimizado.

- **Geolocalización & Mapas**:
  - `leaflet`: `^1.9.4` - Biblioteca JavaScript de código abierto líder para mapas interactivos y ligeros.
  - `react-leaflet`: `^4.2.1` - Componentes y hooks de React para la abstracción nativa y reactiva de mapas Leaflet.

- **Reportes & Utilidades**:
  - `exceljs`: `^4.4.0` - Herramienta avanzada para leer, manipular y escribir hojas de cálculo complejas en formato XLSX.
  - `jspdf`: `^4.2.1` - Biblioteca para la generación dinámica de documentos PDF vectoriales directamente desde el lado del cliente.
  - `jspdf-autotable`: `^5.0.7` - Extensión de jspdf para la estructuración y creación automática de tablas complejas en archivos PDF.
  - `axios`: `^1.13.2` - Cliente HTTP basado en promesas con soporte para interceptores y cancelaciones de peticiones.
  - `date-fns`: `^4.1.0` - Conjunto modular de utilidades y funciones auxiliares para la manipulación y formateo multilingüe de fechas.
  - `remark`: `^15.0.1` - Procesador de Markdown altamente extensible basado en plugins y AST.
  - `remark-gfm`: `^4.0.1` - Extensión de remark para dar soporte al estándar GitHub Flavored Markdown (tablas, tachados, etc.).
  - `remark-html`: `^16.0.1` - Plugin de remark para la conversión y serialización segura de nodos Markdown a código HTML.
  - `unist-util-visit`: `^5.1.0` - Utilidad de bajo nivel para recorrer nodos en árboles de sintaxis abstracta (AST) de unist.

### Dependencias de Desarrollo & Testing

- **Desarrollo/Testing**:
  - `@testing-library/user-event`: `^14.6.1` - Simulación avanzada y fiel de interacciones reales de usuario en el entorno de pruebas automatizadas.
  - `@tailwindcss/typography`: `^0.5.20` - Plugin oficial de Tailwind CSS para aplicar estilos tipográficos automáticos a bloques de contenido HTML.
  - `@testing-library/jest-dom`: `^6.9.1` - Conjunto de matchers de aserción personalizados para validar estados y propiedades del DOM en pruebas.
  - `@testing-library/react`: `^16.3.1` - Utilidades de pruebas centradas en el comportamiento del usuario para validar componentes React de forma robusta.
  - `@types/bcryptjs`: `^2.4.6` - Definiciones estáticas de tipos para la biblioteca bcryptjs.
  - `@types/exceljs`: `^0.5.3` - Definiciones estáticas de tipos para la biblioteca exceljs.
  - `@types/jspdf`: `^1.3.3` - Definiciones estáticas de tipos para la biblioteca jspdf.
  - `@types/leaflet`: `^1.9.21` - Definiciones estáticas de tipos para la biblioteca Leaflet.
  - `@types/node`: `^20` - Definiciones de tipos para todas las APIs nativas del entorno de ejecución de Node.js.
  - `@types/react`: `^18` - Definiciones de tipos de TypeScript para la biblioteca React.
  - `@types/react-dom`: `^18` - Definiciones de tipos de TypeScript para React DOM.
  - `@vitejs/plugin-react`: `^5.1.2` - Plugin oficial de empaquetado para dar soporte rápido de React en entornos Vite.
  - `@vitest/coverage-v8`: `^4.0.16` - Motor de cobertura de código basado en V8 para la generación de reportes detallados en Vitest.
  - `dotenv`: `^17.2.3` - Módulo de carga automatizada de variables de entorno desde archivos locales `.env`.
  - `eslint`: `^8` - Linter de análisis estático de código para la detección de errores y el cumplimiento de estándares.
  - `eslint-config-next`: `14.2.33` - Configuración estándar de reglas de análisis estático recomendadas por el equipo de Next.js.
  - `jsdom`: `^27.4.0` - Simulación pura del entorno del navegador y DOM para pruebas rápidas basadas en Node.js.
  - `postcss`: `^8` - Herramienta extensible para transformar estilos CSS utilizando plugins basados en JavaScript.
  - `prisma`: `^6.2.1` - CLI oficial de Prisma para la gestión de migraciones, introspection de esquemas y generación de cliente.
  - `tailwindcss`: `^3.4.1` - Framework CSS basado en utilidades altamente optimizado para el diseño rápido y responsivo de interfaces.
  - `ts-node`: `^10.9.2` - Motor de ejecución directa y REPL de código TypeScript en entornos de consola Node.js.
  - `typescript`: `^5` - Superconjunto de JavaScript con tipado estático y compilación avanzada de última generación.
  - `vite-tsconfig-paths`: `^6.0.3` - Plugin para la resolución automática de alias de rutas configurados en tsconfig.json dentro de Vite.
  - `vitest`: `^4.0.16` - Entorno moderno, reactivo y de alto rendimiento para la ejecución de pruebas unitarias y de integración.

---

## 4. Estándares de Codificación, Scripts y Utilidades

### Estándares de Codificación Obligatorios

El proyecto sigue reglas estrictas de nomenclatura y estructura para asegurar la excelencia técnica:
- **Indentación**: Uso estricto de 2 espacios (sin tabuladores).
- **Nomenclatura**: variables y funciones en `camelCase`, componentes e interfaces en `PascalCase`, y archivos/directorios en `kebab-case`.
- **Comentarios Mandatarios**:
  - **Cabecera (JSDoc)**: Todos los archivos de lógica (servicios, componentes, API routes) deben incluir un bloque explicativo con su descripción, requisitos e historia de usuario implementada.
  - **Pie de página (Notas de Implementación)**: Al final de cada archivo significativo, se debe incluir un bloque de comentarios con la descripción general, lógica clave y dependencias externas.

### Scripts de Utilidad

El proyecto incluye scripts ejecutables mediante `npx tsx scripts/<script-name>` para facilitar tareas administrativas y de mantenimiento:
- `npx tsx scripts/cleanup-orphaned-images.ts` - Realiza el mantenimiento de Cloudinary, identificando y removiendo imágenes huérfanas de la base de datos.
- `npx tsx scripts/test-live-emails.ts` - Pruebas de integración y envío de correos reales utilizando el servicio de Resend.
- `npx tsx scripts/geocode-shelters.ts` - Utilidad de geocodificación para asignar latitud y longitud a aquellos albergues sin coordenadas geográficas explícitas.

### Configuración del Entorno de Pruebas

Para garantizar una correcta ejecución del suite de pruebas mediante Vitest (`npm test` o `vitest --run`):
- **Node.js**: Se requiere una versión de ejecución Node.js 18.17+ (LTS recomendada).
- **Variable de Entorno**: Se debe configurar obligatoriamente la variable `EMAIL_FROM=onboarding@resend.dev` para evitar errores y fallos de aserción en las pruebas del servicio de correos.
