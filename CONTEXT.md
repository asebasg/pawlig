# Contexto y Estructura del Proyecto — PawLig (v1.8.0)

> **Última actualización**: 15 de junio de 2026.
> **Versión**: v1.8.0

---

## 1. Esquema de la Base de Datos (schema.prisma)

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

## 2. Estructura del Proyecto

```text
.
├── .eslintrc.json
├── .github
│   ├── ISSUE_TEMPLATE
│   │   ├── bug-report.md
│   │   ├── documentation.md
│   │   ├── feature-request.md
│   │   ├── performance.md
│   │   ├── question.md
│   │   └── refactor.md
│   └── pull_request_template.md
├── .gitignore
├── .rules.md
├── CHANGELOG.md
├── CONTEXT.md
├── DEV_NOTES.md
├── README.md
├── app
│   ├── (auth)
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   └── unauthorized
│   │       └── page.tsx
│   ├── (dashboard)
│   │   ├── admin
│   │   │   ├── metrics
│   │   │   │   └── page.tsx
│   │   │   ├── moderation
│   │   │   │   ├── audit
│   │   │   │   │   ├── audit-log-viewer.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── shelters
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── shelter-moderation-client.tsx
│   │   │   │   ├── users
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── view
│   │   │   │   │   │       ├── __tests__
│   │   │   │   │   │       │   └── user-view.spec.tsx
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── block-user-modal.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── users-management-client.tsx
│   │   │   │   └── vendors
│   │   │   │       ├── page.tsx
│   │   │   │       └── vendor-moderation-client.tsx
│   │   │   ├── page.tsx
│   │   │   └── profile
│   │   │       └── page.tsx
│   ├── (shelter)
│   │   ├── adoptions
│   │   │   └── page.tsx
│   │   ├── metrics
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── pets
│   │   │   ├── [id]
│   │   │   │   └── edit
│   │   │   │       └── page.tsx
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── profile
│   │       └── page.tsx
│   ├── (user)
│   │   ├── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   ├── request-shelter
│   │   │   └── page.tsx
│   │   └── request-vendor
│   │       └── page.tsx
│   ├── (vendor)
│   │   ├── metrics
│   │       └── page.tsx
│   │   ├── orders
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── products
│   │   │   ├── [id]
│   │   │   │   └── edit
│   │   │   │       └── page.tsx
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── profile
│   │       └── page.tsx
│   ├── (public)
│   │   ├── adopciones
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── albergues
│   │   │   └── page.tsx
│   │   ├── changelog
│   │   │   ├── changelog-client.tsx
│   │   │   ├── dev
│   │   │   │   ├── dev-notes-client.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── faq
│   │   │   └── page.tsx
│   │   ├── help
│   │   │   └── page.tsx
│   │   ├── nosotros
│   │   │   └── page.tsx
│   │   ├── privacy
│   │   │   └── page.tsx
│   │   ├── productos
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── terms
│   │       └── page.tsx
│   ├── api
│   │   ├── admin
│   │   │   ├── metrics
│   │   │   │   ├── adoptions
│   │   │   │   │   ├── export
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── sales
│   │   │   │       ├── export
│   │   │   │       │   └── route.ts
│   │   │   │       ├── orders
│   │   │   │       │   └── route.ts
│   │   │   │       ├── products
│   │   │   │       │   └── route.ts
│   │   │   │       ├── route.ts
│   │   │   │       └── trends
│   │   │   │           └── route.ts
│   │   │   ├── moderation
│   │   │   │   ├── audit
│   │   │   │   │   └── route.ts
│   │   │   │   ├── shelters
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   └── vendors
│   │   │   │       ├── [id]
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── shelter-requests
│   │   │   │   └── route.ts
│   │   │   ├── shelters
│   │   │   │   └── [shelterId]
│   │   │   │       └── route.ts
│   │   │   └── users
│   │   │       ├── [id]
│   │   │       │   ├── block
│   │   │       │   │   └── route.ts
│   │   │       │   └── role
│   │   │       │       └── route.ts
│   │   │       └── route.ts
│   │   ├── adoptions
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── ai
│   │   │   └── refine
│   │   │       └── route.ts
│   │   ├── auth
│   │   │   ├── [...nextauth]
│   │   │   │   └── route.ts
│   │   │   ├── forgot-password
│   │   │   │   └── route.ts
│   │   │   └── register
│   │   │       └── route.ts
│   │   ├── cart
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── cloudinary
│   │   │   ├── delete
│   │   │   │   └── route.ts
│   │   │   └── sign
│   │   │       └── route.ts
│   │   ├── pets
│   │   │   ├── [id]
│   │   │   │   ├── favorite
│   │   │   │   │   └── route.ts
│   │   │   │   ├── route.ts
│   │   │   │   └── status
│   │   │   │       └── route.ts
│   │   │   ├── route.ts
│   │   │   └── search
│   │   │       └── route.ts
│   │   ├── products
│   │   │   ├── [id]
│   │   │   │   ├── route.ts
│   │   │   │   └── stock
│   │   │   │       └── route.ts
│   │   │   └── route.ts
│   │   ├── shelter
│   │   │   ├── adoptions
│   │   │   │   └── route.ts
│   │   │   └── reports
│   │   │       └── adoptions
│   │   │           ├── export
│   │   │           │   └── route.ts
│   │   │           └── route.ts
│   │   ├── shelters
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   ├── map
│   │   │   │   └── route.ts
│   │   │   └── search
│   │   │       └── route.ts
│   │  ├── upload
│   │   │   └── route.ts
│   │   ├── user
│   │   │   ├── favorites
│   │   │   │   ├── check
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── profile
│   │   │   │   └── route.ts
│   │   │   ├── request-shelter-account
│   │   │   │   └── route.ts
│   │   │   ├── request-vendor-account
│   │   │       └── route.ts
│   │   └── vendor
│   │       ├── metrics
│   │       │   ├── export
│   │       │   │   └── route.ts
│   │       │   ├── orders
│   │       │   │   └── route.ts
│   │       │   ├── products
│   │       │   │   └── route.ts
│   │       │   ├── route.ts
│   │       │   └── trends
│   │      │       └── route.ts
│   │       └── profile
│   │           └── route.ts
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components
│   ├── PetDetailClient.tsx
│   ├── PetGalleryClient.tsx
│   ├── ProductDetailClient.tsx
│   ├── ProductGalleryClient.tsx
│   ├── admin
│   │   ├── AdminDashboardClient.tsx
│   │   ├── AuditHistoryCard.tsx
│   │   ├── BlockUserButton.tsx
│   │   ├── EditUserButton.tsx
│   │   ├── RoleChangeModal.tsx
│   │   ├── UserActionsClient.tsx
│   │   ├── UserViewClient.tsx
│   │   ├── metrics
│   │   │   ├── admin-dashboard-tabs.tsx
│   │   │   └── admin-metrics-client.tsx
│   │   ├── moderation-tabs.tsx
│   │   └── reject-request-modal.tsx
│   ├── adopter
│   │   ├── adopter-dashboard-client.tsx
│   │   ├── adoptions-section.tsx
│   │   ├── cart-section.tsx
│   │   └── favorites-section.tsx
│   ├── cards
│   │   ├── pet-card.tsx
│   │   ├── product-card.tsx
│   │   └── shelter-pet-card.tsx
│   ├── cart
│   │   ├── cart-item.tsx
│   │   └── cart-summary.tsx
│   ├── filters
│   │   ├── pet-filter.tsx
│   │   └── product-filter.tsx
│   ├── forms
│   │   ├── login-form.tsx
│   │   ├── pet-form.tsx
│   │   ├── product-form.tsx
│   │   ├── register-form.tsx
│   │   ├── shelter-request-form.tsx
│   │   ├── user-profile-form.tsx
│   │   ├── vendor-profile-form.tsx
│   │   └── vendor-request-form.tsx
│   ├── help
│   │   └── accordion-section.tsx
│   ├── layout
│   │   ├── cart-button.tsx
│   │   ├── floating-cart-button.tsx
│   │   ├── footer.tsx
│   │   ├── index.ts
│   │   ├── navbar-auth.tsx
│   │   ├── navbar-mobile.tsx
│   │   ├── navbar-public.tsx
│   │   ├── navbar.tsx
│   │   ├── under-construction.tsx
│   │   └── user-menu.tsx
│   ├── map
│   │   ├── interactive-map.tsx
│   │   ├── legal-info-modal.tsx
│   │   ├── shelter-card.tsx
│   │   └── shelters-map-client.tsx
│   ├── modals
│   │   └── adoption-confirm-modal.tsx
│   ├── products
│   │   └── PaymentModal.tsx
│   ├── shelter
│   │   ├── AdoptionStats.tsx
│   │   ├── ShelterDashboardClient.tsx
│   │   ├── adoptions
│   │   │   ├── adoptions-client.tsx
│   │   │   ├── adoptions-table.tsx
│   │   │   ├── application-card.tsx
│   │   │   ├── applications-list.tsx
│   │   │   └── approval-modal.tsx
│   │   └── metrics
│   │       ├── adoption-charts.tsx
│   │       ├── adoption-filters.tsx
│   │       ├── adoption-metrics-client.tsx
│   │       ├── adoption-table.tsx
│   │       └── export-buttons.tsx
│   ├── shelters
│   │   ├── municipality-filter.tsx
│   │   └── shelter-search.tsx
│   ├── ui
│   │   ├── address-input.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button-variants.ts
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── confetti-button.tsx
│   │   ├── dialog.tsx
│   │   ├── favorite-button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loader.tsx
│   │   ├── logo.tsx
│   │   ├── pagination-system.tsx
│   │   ├── password-input.tsx
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   └── table.tsx
│   └── vendor
│       ├── ProductTable.tsx
│       ├── ProductsClient.tsx
│       ├── StockUpdateModal.tsx
│       ├── VendorDashboardClient.tsx
│       ├── VendorStats.tsx
│       └── metrics
│           ├── metrics-cards.tsx
│           ├── metrics-filters.tsx
│           ├── orders-by-status-chart.tsx
│           ├── sales-chart.tsx
│           ├── top-products-table.tsx
│           └── vendor-metrics-client.tsx
├── credentials-seed.txt
├── docs
│   ├── 01_Acta_de_Constitucion.md
│   ├── 02_Stakeholders.md
│   ├── 03_Alcance_del_Proyecto.md
│   ├── 04_Requerimientos.md
│   ├── 05_Historias_de_Usuario.md
│   ├── 06_Mapa_de_Procesos.md
│   ├── 07_Casos_de_Uso.md
│   ├── 08_Arquitectura_Software.md
│   ├── 09_Modelo_Entidad_Relacion.md
│   ├── 10_Diagramas_UML.md
│   ├── 11_Manual_Diseño.md
│   ├── 12_Plan_de_Pruebas.md
│   ├── 13_Casos_de_Prueba.md
│   ├── 14_Manual_del_Usuario.md
│   └── images
│       ├── adopcion.png
│       ├── diagrama_clases.png
│       ├── diagrama_flujo_general.png
│       ├── diagrama_uml.png
│       ├── gestionar_citas.png
│       ├── pet.png
│       ├── postular_adopcion.png
│       ├── publicar_mascota.png
│       └── simular_compra.png
├── lib
│   ├── auth
│   │   ├── auth-options.ts
│   │   ├── password.ts
│   │   ├── require-role.ts
│   │   └── session.ts
│   ├── cloudinary.ts
│   ├── constants.ts
│   ├── email
│   │   ├── components
│   │   │   └── EmailLayout.tsx
│   │   └── templates
│   │       ├── account-blocked.tsx
│   │       ├── adoption-status.tsx
│   │       ├── new-adoption.tsx
│   │       ├── new-order-vendor.tsx
│   │       ├── order-confirmation.tsx
│   │       ├── order-status.tsx
│   │       ├── password-reset.tsx
│   │       ├── shelter-approved.tsx
│   │       ├── shelter-rejected.tsx
│   │       ├── vendor-approved.tsx
│   │       └── vendor-rejected.tsx
│   ├── hooks
│   │   ├── use-cart-sync.ts
│   │   └── use-cart.ts
│   ├── services
│   │   ├── adoption-report.service.ts
│   │   ├── adoption.service.ts
│   │   ├── cart.service.ts
│   │   ├── email.service.test.ts
│   │   ├── email.service.ts
│   │   ├── geocoding.service.ts
│   │   ├── moderation.service.spec.ts
│   │   ├── moderation.service.ts
│   │   ├── pet.service.spec.ts
│   │   ├── pet.service.ts
│   │   ├── product.service.ts
│   │   ├── user.service.ts
│   │   └── vendor-metrics.service.ts
│   ├── utils
│   │   ├── age-formatter.test.ts
│   │   ├── age-formatter.ts
│   │   ├── db.ts
│   │   ├── export-csv.ts
│   │   ├── export-excel.ts
│   │   ├── export-pdf.ts
│   │   └── logger.ts
│   ├── utils.ts
│   └── validations
│       ├── adoption.schema.ts
│       ├── cart.schema.ts
│       ├── cloudinary.schema.ts
│       ├── pet-search.schema.ts
│       ├── pet.schema.ts
│       ├── product.schema.ts
│       └── user.schema.ts
├── middleware.ts
├── monthly-updates.md
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── public
│   └── images
│       ├── 404-page.png
│       ├── medellin-map.png
│       ├── nosotros_hero_image_1778473832814.png
│       ├── pet-adopted.png
│       ├── pet-community.png
│       ├── pet-home.png
│       └── under_construction.png
├── scripts
│   ├── create-pr.ps1
│   ├── create-pr.sh
│   ├── geocode-shelters.ts
│   └── test-live-emails.ts
├── tailwind.config.ts
├── tsconfig.json
├── types
│   ├── adoption.ts
│   ├── api.types.ts
│   ├── email.types.ts
│   ├── next-auth.d.ts
│   ├── report.types.ts
│   └── shelter.ts
├── vitest.config.ts
└── vitest.setup.ts
```

## 3. Dependencias del Proyecto

### Dependencias de Producción

- `@google/generative-ai`: `^0.24.1`
- `@hookform/resolvers`: `^5.2.2`
- `@prisma/client`: `^6.2.1`
- `@radix-ui/react-checkbox`: `^1.3.3`
- `@radix-ui/react-label`: `^2.1.8`
- `@radix-ui/react-radio-group`: `^1.3.8`
- `@radix-ui/react-select`: `^2.2.6`
- `@radix-ui/react-slot`: `^1.2.4`
- `@react-email/components`: `^1.0.12`
- `@react-email/render`: `^2.0.7`
- `@testing-library/user-event`: `^14.6.1`
- `axios`: `^1.13.2`
- `bcryptjs`: `^3.0.3`
- `class-variance-authority`: `^0.7.1`
- `cloudinary`: `^2.8.0`
- `clsx`: `^2.1.1`
- `date-fns`: `^4.1.0`
- `exceljs`: `^4.4.0`
- `jspdf`: `^4.2.1`
- `jspdf-autotable`: `^5.0.7`
- `leaflet`: `^1.9.4`
- `lucide-react`: `^0.554.0`
- `next`: `14.2.33`
- `next-auth`: `^4.24.7`
- `react`: `^18`
- `react-day-picker`: `^10.0.0`
- `react-dom`: `^18`
- `react-hook-form`: `^7.66.1`
- `react-leaflet`: `^4.2.1`
- `recharts`: `^3.8.1`
- `resend`: `^6.12.2`
- `sonner`: `^2.0.7`
- `swr`: `^2.4.1`
- `tailwind-merge`: `^3.4.0`
- `zod`: `^4.1.12`

### Dependencias de Desarrollo

- `@testing-library/jest-dom`: `^6.9.1`
- `@testing-library/react`: `^16.3.1`
- `@types/bcryptjs`: `^2.4.6`
- `@types/exceljs`: `^0.5.3`
- `@types/jspdf`: `^1.3.3`
- `@types/leaflet`: `^1.9.21`
- `@types/node`: `^20`
- `@types/react`: `^18`
- `@types/react-dom`: `^18`
- `@vitejs/plugin-react`: `^5.1.2`
- `@vitest/coverage-v8`: `^4.0.16`
- `dotenv`: `^17.2.3`
- `eslint`: `^8`
- `eslint-config-next`: `14.2.33`
- `jsdom`: `^27.4.0`
- `postcss`: `^8`
- `prisma`: `^6.2.1`
- `tailwindcss`: `^3.4.1`
- `ts-node`: `^10.9.2`
- `typescript`: `^5`
- `vite-tsconfig-paths`: `^6.0.3`
- `vitest`: `^4.0.16`
