# Esquema de la Base de Datos (schema.prisma)

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

// ===== MODELS =====

model User {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  email       String       @unique
  password    String
  name        String
  role        UserRole     @default(ADOPTER)
  phone       String
  municipality Municipality
  address     String
  idNumber    String
  birthDate   DateTime

  // Bloqueos de usuarios (HU-014)
  isActive    Boolean      @default(true)
  blockedAt   DateTime?
  blockedBy   String?      @db.ObjectId
  blockReason String?

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relaciones
  shelter     Shelter?
  vendor      Vendor?
  adoptions   Adoption[]
  orders      Order[]
  favorites   Favorite[]

  // Auditoría (HU-014)
  adminActions UserAudit[] @relation("AdminActions")
  auditRecords UserAudit[] @relation("AffectedUser")

  @@index([role])
  @@index([isActive])
  @@index([municipality])
}

model UserAudit {
  id          String      @id @default(auto()) @map("_id") @db.ObjectId

  // Acción realizada (HU-014)
  action      AuditAction // Enum tipado (no String)
  reason      String      // Justificación obligatoria (RN-017)

  // Trazabilidad
  oldValue    String?
  newValue    String?

  // Relaciones
  performedBy User     @relation("AdminActions", fields: [adminId], references: [id], onDelete: Cascade)
  adminId     String   @db.ObjectId

  affectedUser User    @relation("AffectedUser", fields: [userId], references: [id], onDelete: Cascade)
  userId      String   @db.ObjectId

  // Metadata de seguridad (RNF-002)
  ipAddress   String?
  userAgent   String?

  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([adminId])
  @@index([action])
  @@index([createdAt])
}

model Shelter {
  id                String       @id @default(auto()) @map("_id") @db.ObjectId
  name              String
  nit               String       @unique
  municipality      Municipality
  address           String
  description       String?
  verified          Boolean      @default(false)
  contactWhatsApp   String?
  contactInstagram  String?
  rejectionReason   String?
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @unique @db.ObjectId

  pets Pet[]

  @@index([verified])
  @@index([municipality])
  @@index([name])
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
  category    String
  description String?
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  vendor      Vendor @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId    String @db.ObjectId

  orderItems OrderItem[]

  @@index([category])
  @@index([vendorId])
  @@index([stock])
  @@index([name])
  @@index([price])
}

model Adoption {
  id        String          @id @default(auto()) @map("_id") @db.ObjectId
  status    AdoptionStatus  @default(PENDING)
  message   String?
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

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
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String   @db.ObjectId
  pet        Pet      @relation(fields: [petId], references: [id], onDelete: Cascade)
  petId      String   @db.ObjectId

  @@unique([userId, petId])
  @@index([userId])
  @@index([petId])
  @@index([createdAt])
}
```

# Estructura del Proyecto

```text
.
├── .env.local.example
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
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   └── users
│   │   │       ├── BlockUserModal.tsx
│   │   │       ├── UsersManagementClient.tsx
│   │   │       ├── [id]
│   │   │       │   └── view
│   │   │       │       ├── __tests__
│   │   │       │       │   └── user-view.spec.tsx
│   │   │       │       └── page.tsx
│   │   │       └── page.tsx
│   │   ├── shelter
│   │   │   ├── adoptions
│   │   │   │   └── page.tsx
│   │   │   ├── metrics
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── pets
│   │   │   │   ├── [id]
│   │   │   │   │   └── edit
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── new
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── profile
│   │   │       └── page.tsx
│   │   ├── user
│   │   │   ├── page.tsx
│   │   │   ├── profile
│   │   │   │   └── page.tsx
│   │   │   ├── request-shelter
│   │   │   │   └── page.tsx
│   │   │   └── request-vendor
│   │   │       └── page.tsx
│   │   └── vendor
│   │       ├── metrics
│   │       │   └── page.tsx
│   │       ├── orders
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       ├── products
│   │       │   ├── [id]
│   │       │   │   └── edit
│   │       │   │       └── page.tsx
│   │       │   ├── new
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       └── profile
│   │           └── page.tsx
│   ├── (public)
│   │   ├── adopciones
│   │   │   ├── [id]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── changelog
│   │   │   └── page.tsx
│   │   ├── faq
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
│   │   │   └── register
│   │   │       └── route.ts
│   │   ├── cloudinary
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
│   │   │   └── adoptions
│   │   │       └── route.ts
│   │   ├── upload
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
│   │   │   └── request-vendor-account
│   │   │       └── route.ts
│   │   └── vendor
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
│   ├── AdoptionApplicationsClient.tsx
│   ├── PetDetailClient.tsx
│   ├── PetGalleryClient.tsx
│   ├── ProductDetailClient.tsx
│   ├── ProductGalleryClient.tsx
│   ├── admin
│   │   ├── AuditHistoryCard.tsx
│   │   ├── BlockUserButton.tsx
│   │   ├── RoleChangeModal.tsx
│   │   ├── UserActionsClient.tsx
│   │   └── UserViewClient.tsx
│   ├── adopter
│   │   ├── AdopterDashboardClient.tsx
│   │   ├── AdoptionsSection.tsx
│   │   ├── CartSection.tsx
│   │   └── FavoritesSection.tsx
│   ├── cards
│   │   ├── pet-card.tsx
│   │   ├── product-card.tsx
│   │   └── shelter-pet-card.tsx
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
│   ├── layout
│   │   ├── cart-button.tsx
│   │   ├── footer.tsx
│   │   ├── index.ts
│   │   ├── navbar-auth.tsx
│   │   ├── navbar-mobile.tsx
│   │   ├── navbar-public.tsx
│   │   ├── navbar.tsx
│   │   └── user-menu.tsx
│   ├── products
│   │   └── PaymentModal.tsx
│   ├── shelter
│   │   ├── AdoptionStats.tsx
│   │   └── ShelterDashboardClient.tsx
│   ├── ui
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
│   │   ├── radio-group.tsx
│   │   ├── select.tsx
│   │   └── table.tsx
│   └── vendor
│       ├── ProductTable.tsx
│       ├── ProductsClient.tsx
│       ├── StockUpdateModal.tsx
│       ├── VendorDashboardClient.tsx
│       └── VendorStats.tsx
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
│   ├── services
│   │   ├── pet.service.spec.ts
│   │   ├── pet.service.ts
│   │   ├── product.service.ts
│   │   └── user.service.ts
│   ├── utils
│   │   ├── db.ts
│   │   └── logger.ts
│   ├── utils.ts
│   └── validations
│       ├── adoption.schema.ts
│       ├── cloudinary.schema.ts
│       ├── pet-search.schema.ts
│       ├── pet.schema.ts
│       ├── product.schema.ts
│       └── user.schema.ts
├── middleware.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   └── schema.prisma
├── public
│   └── images
│       ├── 404-page.png
│       ├── medellin-map.png
│       ├── pet-adopted.png
│       ├── pet-community.png
│       ├── pet-home.png
│       └── under_construction.png
├── tailwind.config.ts
├── tsconfig.json
├── types
│   ├── api.types.ts
│   └── next-auth.d.ts
├── vitest.config.ts
└── vitest.setup.ts

104 directories, 201 files
```

> **Última actualización**: 8 de febrero de 2026.
