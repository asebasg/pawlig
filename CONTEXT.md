# Contexto y Estructura del Proyecto — PawLig (v1.8.0)

> **Última actualización**: 22 de junio de 2026.
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
│   │   │   ├── dev
│   │   │   ├── metrics
│   │   │   ├── moderation
│   │   │   ├── page.tsx
│   │   │   └── profile
│   │   ├── shelter
│   │   │   ├── adoptions
│   │   │   ├── metrics
│   │   │   ├── page.tsx
│   │   │   ├── pets
│   │   │   └── profile
│   │   ├── user
│   │   │   ├── page.tsx
│   │   │   ├── profile
│   │   │   ├── request-shelter
│   │   │   └── request-vendor
│   │   └── vendor
│   │       ├── metrics
│   │       ├── orders
│   │       ├── page.tsx
│   │       ├── products
│   │       └── profile
│   ├── (public)
│   │   ├── adopciones
│   │   │   ├── [id]
│   │   │   └── page.tsx
│   │   ├── albergues
│   │   │   └── page.tsx
│   │   ├── changelog
│   │   │   ├── changelog-client.tsx
│   │   │   ├── dev
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
│   │   │   └── page.tsx
│   │   └── terms
│   │       └── page.tsx
│   ├── api
│   │   ├── admin
│   │   │   ├── docs
│   │   │   ├── metrics
│   │   │   ├── moderation
│   │   │   ├── shelter-requests
│   │   │   ├── shelters
│   │   │   └── users
│   │   ├── adoptions
│   │   │   ├── [id]
│   │   │   └── route.ts
│   │   ├── ai
│   │   │   └── refine
│   │   ├── auth
│   │   │   ├── [...nextauth]
│   │   │   ├── forgot-password
│   │   │   └── register
│   │   ├── cart
│   │   │   ├── [id]
│   │   │   └── route.ts
│   │   ├── cloudinary
│   │   │   ├── delete
│   │   │   └── sign
│   │   ├── pets
│   │   │   ├── [id]
│   │   │   ├── route.ts
│   │   │   └── search
│   │   ├── products
│   │   │   ├── [id]
│   │   │   └── route.ts
│   │   ├── shelter
│   │   │   ├── adoptions
│   │   │   └── reports
│   │   ├── shelters
│   │   │   ├── [id]
│   │   │   ├── map
│   │   │   └── search
│   │   ├── upload
│   │   │   └── route.ts
│   │   ├── user
│   │   │   ├── favorites
│   │   │   ├── profile
│   │   │   ├── request-shelter-account
│   │   │   └── request-vendor-account
│   │   └── vendor
│   │       ├── metrics
│   │       └── profile
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components
│   ├── admin
│   │   ├── docs
│   │   ├── metrics
│   │   └── AdminDashboardClient.tsx
│   ├── adopter
│   │   └── adopter-dashboard-client.tsx
│   ├── cards
│   │   ├── pet-card.tsx
│   │   ├── product-card.tsx
│   │   └── shelter-pet-card.tsx
│   ├── forms
│   │   ├── pet-form.tsx
│   │   ├── product-form.tsx
│   │   └── register-form.tsx
│   ├── layout
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── map
│   │   ├── interactive-map.tsx
│   │   └── shelters-map-client.tsx
│   ├── ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── table.tsx
│   └── vendor
│       ├── metrics
│       └── VendorDashboardClient.tsx
├── lib
│   ├── auth
│   │   ├── auth-options.ts
│   │   └── require-role.ts
│   ├── email
│   │   ├── components
│   │   └── templates
│   ├── services
│   │   ├── pet.service.ts
│   │   ├── product.service.ts
│   │   └── user.service.ts
│   ├── utils
│   │   ├── db.ts
│   │   └── logger.ts
│   └── validations
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── public
│   ├── docs
│   └── images
├── scripts
├── types
└── vitest.config.ts
```

## 3. Dependencias del Proyecto

### Dependencias de Producción

- **Frontend/Framework**:
  - `next`: `14.2.33`
  - `react`: `^18`
  - `react-dom`: `^18`
  - `swr`: `^2.4.1`
- **UI/Componentes**:
  - `@radix-ui/react-checkbox`: `^1.3.3`
  - `@radix-ui/react-label`: `^2.1.8`
  - `@radix-ui/react-radio-group`: `^1.3.8`
  - `@radix-ui/react-select`: `^2.2.6`
  - `@radix-ui/react-slot`: `^1.2.4`
  - `lucide-react`: `^0.554.0`
  - `sonner`: `^2.0.7`
  - `class-variance-authority`: `^0.7.1`
  - `clsx`: `^2.1.1`
  - `tailwind-merge`: `^3.4.0`
  - `react-day-picker`: `^10.0.0`
  - `recharts`: `^3.8.1`
- **Formularios y Validación**:
  - `react-hook-form`: `^7.66.1`
  - `@hookform/resolvers`: `^5.2.2`
  - `zod`: `^4.1.12`
- **Base de Datos y ORM**:
  - `@prisma/client`: `^6.2.1`
- **Autenticación y Seguridad**:
  - `next-auth`: `^4.24.7`
  - `bcryptjs`: `^3.0.3`
- **Servicios Externos**:
  - `cloudinary`: `^2.8.0`
  - `@google/generative-ai`: `^0.24.1`
  - `resend`: `^6.12.2`
  - `@react-email/components`: `^1.0.12`
  - `@react-email/render`: `^2.0.7`
- **Utilidades**:
  - `axios`: `^1.13.2`
  - `date-fns`: `^4.1.0`
  - `exceljs`: `^4.4.0`
  - `jspdf`: `^4.2.1`
  - `jspdf-autotable`: `^5.0.7`
  - `leaflet`: `^1.9.4`
  - `react-leaflet`: `^4.2.1`
  - `remark`: `^15.0.1`
  - `remark-gfm`: `^4.0.1`
  - `remark-html`: `^16.0.1`
  - `unist-util-visit`: `^5.1.0`

### Dependencias de Desarrollo

- **Testing**:
  - `vitest`: `^4.0.16`
  - `@testing-library/react`: `^16.3.1`
  - `@testing-library/jest-dom`: `^6.9.1`
  - `@testing-library/user-event`: `^14.6.1`
  - `jsdom`: `^27.4.0`
  - `@vitejs/plugin-react`: `^5.1.2`
  - `vite-tsconfig-paths`: `^6.0.3`
  - `@vitest/coverage-v8`: `^4.0.16`
- **Estilos y Linting**:
  - `tailwindcss`: `^3.4.1`
  - `postcss`: `^8`
  - `eslint`: `^8`
  - `eslint-config-next`: `14.2.33`
  - `@tailwindcss/typography`: `^0.5.20`
- **Herramientas de Tipado y DB**:
  - `typescript`: `^5`
  - `@types/node`: `^20`
  - `@types/react`: `^18`
  - `@types/react-dom`: `^18`
  - `@types/bcryptjs`: `^2.4.6`
  - `@types/exceljs`: `^0.5.3`
  - `@types/jspdf`: `^1.3.3`
  - `@types/leaflet`: `^1.9.21`
  - `prisma`: `^6.2.1`
  - `ts-node`: `^10.9.2`
  - `dotenv`: `^17.2.3`
