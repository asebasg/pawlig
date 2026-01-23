# Modelo Entidad Relación

## Índice

1. Introducción
   &nbsp;&nbsp;&nbsp;&nbsp;Propósito del modelo de datos
   &nbsp;&nbsp;&nbsp;&nbsp;Alcance del diseño de BD
   &nbsp;&nbsp;&nbsp;&nbsp;Sistema de gestión de BD seleccionado
2. Modelo Conceptual (Diagrama ER Lógico)
3. Diccionario de Datos
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: User
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: Shelter
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: Provider
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: Pet
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: Product
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: Adoption
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: Order
   &nbsp;&nbsp;&nbsp;&nbsp;Entidad: OrderItem
4. Modelo Relacional (Esquema de Colecciones/Tablas)
5. Normalización
6. Índices y Optimización
7. Restricciones e Integridad
8. Script SQL Completo (Esquema Lógico Prisma)
9. Trazabilidad con Requerimientos

## 1. Introducción

### Propósito del modelo de datos

El propósito de este documento es definir la estructura lógica y la organización de la base de datos (BD) de la plataforma **PawLig**, garantizando la integridad de los datos, la trazabilidad con los requerimientos funcionales y la optimización necesaria para un alto rendimiento. Este modelo sirve como especificación técnica para la capa de acceso a datos (_Data Access Layer_).

### Alcance del diseño de BD

El diseño abarca la totalidad de las entidades requeridas para la **Versión 1.0** del sistema PawLig. Esto incluye los datos necesarios para gestionar usuarios y sus roles (Adoptante, Albergue, Proveedor, Administrador), el módulo de adopción de mascotas, la gestión de inventario y pedidos simulados. El alcance geográfico se limita al **Valle de Aburrá**.

### Sistema de gestión de BD seleccionado

Se ha seleccionado **MongoDB Atlas**, un sistema de gestión de base de datos NoSQL documental. La gestión del esquema, las relaciones lógicas y la tipificación se realiza mediante **Prisma ORM**.

---

## 2. Modelo Conceptual (Diagrama ER Lógico)

El sistema se estructura en **ocho (8) entidades principales** (colecciones) y **cinco (5) estructuras de datos fijos** (ENUMs) que definen las reglas de dominio para mantener la integridad. La representación de las relaciones es lógica y se implementa mediante la vinculación de claves foráneas (IDs).

**Entidades Centrales (Mínimo 8 de 8-12 requeridas):**

1. **User (Usuario)**: Almacena la información de todos los actores del sistema.
2. **Shelter (Albergue)**: Información detallada de las entidades de rescate verificadas (Relación 1:1 con User).
3. **Provider (Proveedor)**: Información de los vendedores de productos (Relación 1:1 con User).
4. **Pet (Mascota)**: Animales disponibles para adopción (Relación 1:N con Shelter).
5. **Product (Producto)**: Artículos del catálogo (Relación 1:N con Provider).
6. **Adoption (Adopción)**: Registra las postulaciones (Relación N:M entre User y Pet, resuelta en esta tabla).
7. **Order (Pedido)**: Registra la simulación de compra.
8. **OrderItem (Ítem de Pedido)**: Detalle de productos dentro de un pedido (Relación N:M entre Order y Product).

**Relaciones Clave:**

| Relación           | Entidades          | Cardinalidad | Justificación                                                  |
| ------------------ | ------------------ | ------------ | -------------------------------------------------------------- |
| Pertenencia de Rol | User ↔ Shelter     | 1:1          | Un usuario (rol SHELTER) gestiona un solo perfil de Albergue.  |
| Pertenencia de Rol | User ↔ Provider    | 1:1          | Un usuario (rol PROVIDER) gestiona un solo perfil de Vendedor. |
| Publicación        | Shelter ↔ Pet      | 1:N          | Un Albergue publica múltiples Mascotas.                        |
| Venta              | Provider ↔ Product | 1:N          | Un Proveedor gestiona múltiples Productos.                     |
| Postulación        | User ↔ Adoption    | 1:N          | Un Adoptante puede tener múltiples solicitudes de Adopción.    |
| Detalle de Compra  | Order ↔ OrderItem  | 1:N          | Un Pedido contiene múltiples Ítems de Pedido.                  |

---

## 3. Diccionario de Datos

El siguiente diccionario detalla los atributos de cada entidad, especificando el tipo de dato (con la notación Prisma/MongoDB), la clave primaria (PK), la clave foránea (FK) y las restricciones de obligatoriedad (NN = No Nulo).

### Entidad: User

| Atributo     | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                                         |
| ------------ | --------------------- | --- | --- | --- | -------- | ------------------------------------------------------------------- |
| id           | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria única del usuario.                                   |
| email        | String                |     |     | ✓   |          | Correo electrónico único para autenticación (RF-002, RN-002).       |
| password     | String                |     |     | ✓   |          | Contraseña encriptada (Bcrypt con salt rounds 12).                  |
| name         | String                |     |     | ✓   |          | Nombre completo.                                                    |
| role         | UserRole (ENUM)       |     |     | ✓   |          | Rol asignado (ADMIN, SHELTER, PROVIDER, ADOPTER). Default: ADOPTER. |
| phone        | String                |     |     | ✓   |          | Número de contacto.                                                 |
| municipality | Municipality (ENUM)   |     |     | ✓   |          | Municipio de residencia (Valle de Aburrá).                          |
| address      | String                |     |     | ✓   |          | Dirección de residencia.                                            |
| idNumber     | String                |     |     | ✓   |          | Número de identificación.                                           |
| birthDate    | DateTime              |     |     | ✓   |          | Fecha de nacimiento.                                                |

### Entidad: Shelter

| Atributo         | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                                            |
| ---------------- | --------------------- | --- | --- | --- | -------- | ---------------------------------------------------------------------- |
| id               | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria del perfil de Albergue.                                 |
| userId           | String (@db.ObjectId) |     | ✓   | ✓   |          | FK Única a la entidad User (Rol SHELTER).                              |
| name             | String                |     |     | ✓   |          | Nombre oficial del albergue.                                           |
| municipality     | Municipality (ENUM)   |     |     | ✓   |          | Ubicación del albergue (Valle de Aburrá) (RN-003).                     |
| address          | String                |     |     | ✓   |          | Dirección física.                                                      |
| description      | String?               |     |     |     | ✓        | Descripción detallada del albergue.                                    |
| verified         | Boolean               |     |     | ✓   |          | Indica si el Administrador aprobó la cuenta (Default: false) (HU-002). |
| contactWhatsApp  | String?               |     |     |     | ✓        | Número de contacto de WhatsApp (HU-008).                               |
| contactInstagram | String?               |     |     |     | ✓        | Perfil de Instagram (HU-008).                                          |

### Entidad: Provider

| Atributo     | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                       |
| ------------ | --------------------- | --- | --- | --- | -------- | ------------------------------------------------- |
| id           | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria del perfil de Proveedor.           |
| userId       | String (@db.ObjectId) |     | ✓   | ✓   |          | FK Única a la entidad User (Rol PROVIDER).        |
| businessName | String                |     |     | ✓   |          | Nombre del negocio.                               |
| municipality | Municipality (ENUM)   |     |     | ✓   |          | Ubicación del negocio (Valle de Aburrá) (RN-005). |
| description  | String?               |     |     |     | ✓        | Descripción del negocio (HU-003).                 |
| verified     | Boolean               |     |     | ✓   |          | Indica si el Administrador aprobó la cuenta.      |

### Entidad: Pet

| Atributo     | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                                       |
| ------------ | --------------------- | --- | --- | --- | -------- | ----------------------------------------------------------------- |
| id           | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria de la mascota.                                     |
| shelterId    | String (@db.ObjectId) |     | ✓   | ✓   |          | FK al Shelter que publica la mascota.                             |
| name         | String                |     |     | ✓   |          | Nombre de la mascota.                                             |
| species      | String                |     |     | ✓   |          | Especie (Perro, Gato, etc.).                                      |
| status       | PetStatus (ENUM)      |     |     | ✓   |          | Estado de adopción (AVAILABLE por defecto).                       |
| description  | String                |     |     | ✓   |          | Descripción detallada y características.                          |
| images       | String[]              |     |     | ✓   |          | Arreglo de URLs de imágenes (almacenadas en Cloudinary) (RN-007). |
| requirements | String?               |     |     |     | ✓        | Requisitos específicos para la adopción.                          |

### Entidad: Product

| Atributo   | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                     |
| ---------- | --------------------- | --- | --- | --- | -------- | ----------------------------------------------- |
| id         | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria del producto.                    |
| providerId | String (@db.ObjectId) |     | ✓   | ✓   |          | FK al Provider que vende el producto.           |
| name       | String                |     |     | ✓   |          | Nombre del producto.                            |
| price      | Float                 |     |     | ✓   |          | Precio unitario.                                |
| stock      | Int                   |     |     | ✓   |          | Cantidad disponible en inventario (Default: 0). |
| category   | String                |     |     | ✓   |          | Categoría del producto.                         |
| images     | String[]              |     |     | ✓   |          | Arreglo de URLs de imágenes (Cloudinary).       |

### Entidad: Adoption

| Atributo  | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                  |
| --------- | --------------------- | --- | --- | --- | -------- | -------------------------------------------- |
| id        | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria de la solicitud de adopción.  |
| adopterId | String (@db.ObjectId) |     | ✓   | ✓   |          | FK al User Adoptante.                        |
| petId     | String (@db.ObjectId) |     | ✓   | ✓   |          | FK a la Pet postulada.                       |
| status    | AdoptionStatus (ENUM) |     |     | ✓   |          | Estado de la postulación (Default: PENDING). |
| message   | String?               |     |     |     | ✓        | Mensaje inicial del adoptante.               |

**Restricción:** `@@unique([adopterId, petId])` → Un usuario solo puede postularse una vez por mascota.

### Entidad: Order

| Atributo             | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                   |
| -------------------- | --------------------- | --- | --- | --- | -------- | --------------------------------------------- |
| id                   | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria del pedido simulado.           |
| userId               | String (@db.ObjectId) |     | ✓   | ✓   |          | FK al User que realizó la compra.             |
| status               | OrderStatus (ENUM)    |     |     | ✓   |          | Estado del pedido (PENDING, CONFIRMED, etc.). |
| total                | Float                 |     |     | ✓   |          | Costo total del pedido.                       |
| shippingMunicipality | Municipality (ENUM)   |     |     | ✓   |          | Municipio de envío (Valle de Aburrá).         |
| shippingAddress      | String                |     |     | ✓   |          | Dirección de envío.                           |
| paymentMethod        | String                |     |     | ✓   |          | Método de pago simulado.                      |

### Entidad: OrderItem

| Atributo  | Tipo de Dato          | PK  | FK  | NN  | Opcional | Descripción                                           |
| --------- | --------------------- | --- | --- | --- | -------- | ----------------------------------------------------- |
| id        | String (@db.ObjectId) | ✓   |     | ✓   |          | Clave primaria del ítem de pedido.                    |
| orderId   | String (@db.ObjectId) |     | ✓   | ✓   |          | FK al Order al que pertenece (Composición 1:N).       |
| productId | String (@db.ObjectId) |     | ✓   | ✓   |          | FK al Product que se compró.                          |
| quantity  | Int                   |     |     | ✓   |          | Cantidad comprada de ese producto.                    |
| price     | Float                 |     |     | ✓   |          | Precio unitario del producto al momento de la compra. |

---

## 4. Modelo Relacional (Esquema de Colecciones/Tablas)

Dado que se utiliza **MongoDB (NoSQL)** con **Prisma**, el modelo relacional se traduce en un esquema de colecciones donde las relaciones se gestionan mediante referencias de documentos (_Foreign Keys Lógicas_). Prisma fuerza una estructura relacional limpia, similar a la **3FN**, pero almacena los datos en colecciones flexibles.

El esquema relacional lógico consiste en las **8 colecciones descritas**. Las relaciones se establecen explícitamente en el Schema de Prisma con el decorador `@relation`, garantizando que la integridad referencial se mantenga a nivel de aplicación (ORM).

---

## 5. Normalización

El diseño de la base de datos PawLig sigue los principios de la normalización, aunque la implementación física se haga en un SGBD NoSQL (MongoDB), aprovechando la flexibilidad documental sin sacrificar la integridad de los datos relacionales.

- **Primera Forma Normal (1FN)**: La mayoría de los atributos son atómicos. La única excepción es el atributo `images` (`String[]`) en _Pet_ y _Product_, que se utiliza para almacenar URLs de multimedia. Esta estructura es una práctica estándar y aceptable en bases de datos documentales como MongoDB, y se justifica por la integración con Cloudinary y para la gestión multimedia.

- **Segunda y Tercera Forma Normal (2FN y 3FN)**: Se cumple el principio de la **3FN**, ya que:
  - Todas las entidades tienen una clave primaria única (`id`).
  - Se han eliminado dependencias parciales y transitivas. Por ejemplo, la información de ubicación geográfica (_Municipios_) se centraliza en un ENUM en lugar de repetirse como texto en cada registro, estandarizando los datos y evitando redundancia.
  - La información transaccional (_Order_, _OrderItem_) y la información de catálogo (_Product_) están separadas y vinculadas por claves foráneas lógicas, asegurando que los datos de la orden no dependan de la clave de ningún ítem, sino de la clave de la orden misma.

**Nivel de Normalización Alcanzado**: Tercera Forma Normal (3FN) a nivel de modelado lógico con optimizaciones NoSQL para datos multimedia.

---

## 6. Índices y Optimización

Los índices se definen en el esquema de Prisma para asegurar que las consultas críticas cumplan con el **Requerimiento No Funcional de Rendimiento (RNF-001)**.

| Tabla    | Columna(s)                  | Tipo de Índice               | Justificación (Requerimiento)                                                         |
| -------- | --------------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| User     | email                       | Único (`@unique`)            | Optimiza la autenticación y login (RF-002).                                           |
| User     | role                        | Compuesto (`@@index`)        | Filtrado rápido de usuarios por rol (RF-005, HU-014).                                 |
| Pet      | status, species             | Compuesto (`@@index`)        | Permite el filtrado avanzado de mascotas por estado y especie (RF-009, HU-006).       |
| Pet      | shelterId, createdAt        | Compuesto (`@@index`)        | Consultas rápidas para albergues sobre sus publicaciones recientes.                   |
| Adoption | adopterId, petId            | Único Compuesto (`@@unique`) | Garantiza la unicidad de la postulación (no dos postulaciones para la misma mascota). |
| Product  | category, providerId, stock | Compuesto (`@@index`)        | Búsqueda y filtrado eficiente de productos; chequeo de inventario (HU-010).           |
| Order    | shippingMunicipality        | Compuesto (`@@index`)        | Optimiza reportes logísticos y consultas por municipio (HU-012).                      |

---

## 7. Restricciones e Integridad

El sistema implementa restricciones lógicas de integridad referencial y de dominio para asegurar la validez de los datos.

| Tipo de Restricción | Entidad           | Atributo/Relación  | Descripción                                                               | Fuente                   |
| ------------------- | ----------------- | ------------------ | ------------------------------------------------------------------------- | ------------------------ |
| Clave Primaria (PK) | Todas             | id                 | Identificador único de tipo ObjectId de MongoDB.                          | Prisma `@id`             |
| Clave Foránea (FK)  | Shelter, Provider | userId             | Enlace con la tabla User (`onDelete: Cascade`).                           | Prisma `@relation`       |
| UNIQUE              | User              | email              | Garantiza que cada usuario tenga un correo único.                         | RN-002, Prisma `@unique` |
| UNIQUE              | Adoption          | adopterId, petId   | Restricción compuesta para evitar duplicidad de solicitudes de adopción.  | Prisma `@@unique`        |
| Dominio (ENUM)      | User              | role, municipality | Limita los valores a roles predefinidos y municipios del Valle de Aburrá. | Guía Fase 1              |
| Valores por Defecto | User              | role               | Valor inicial de ADOPTER.                                                 | RF-001                   |
| Valores por Defecto | Pet               | status             | Valor inicial de AVAILABLE.                                               | RF-010                   |
| Validación Lógica   | User              | password           | Contraseña mínima de 8 caracteres.                                        | RNF-002, RN-001          |
| Validación Lógica   | Pet               | images             | Mínimo una foto requerida.                                                | RN-007                   |

---

## 8. Script SQL Completo (Esquema Lógico Prisma)

Según la guía, se requiere un _"Script SQL Completo"_ para la creación de la BD y tablas, además de la inserción de 3-5 registros de prueba por tabla.

**Aclaración Técnica Profesional**: Dado que PawLig utiliza **MongoDB**, un sistema NoSQL que no emplea DDL (Data Definition Language) SQL, el **Esquema de Prisma** actúa como el DDL lógico. Este esquema define los modelos (colecciones), los tipos de datos y las relaciones, siendo el mecanismo que la herramienta Prisma utiliza para estructurar la base de datos MongoDB.

El siguiente es el script completo del **Esquema Prisma**, que define la base de datos para PawLig:

```prisma
// Configuración del Conector
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

//===== ENUMS (Definiciones de Dominio) =====
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
  PROVIDER
  ADOPTER
}

enum PetStatus {
  AVAILABLE // Por defecto
  IN_PROCESS
  ADOPTED
}

enum AdoptionStatus {
  PENDING // Por defecto
  APPROVED
  REJECTED
}

enum OrderStatus {
  PENDING // Por defecto
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

//===== MODELS (Colecciones/Tablas) =====
model User {
  id           String       @id @default(auto()) @map("_id") @db.ObjectId
  email        String       @unique // RNF-002, RF-002
  password     String
  name         String
  role         UserRole     @default(ADOPTER)
  phone        String
  municipality Municipality // RN-003, RN-005
  address      String
  idNumber     String
  birthDate    DateTime
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  shelter      Shelter?
  provider     Provider?
  adoptions    Adoption[]
  orders       Order[]

  @@index([role])
  @@index([email])
  @@index([municipality])
}

model Shelter {
  id               String       @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  municipality     Municipality
  address          String
  description      String?
  verified         Boolean      @default(false)
  contactWhatsApp  String? // HU-008
  contactInstagram String? // HU-008
  rejectionReason  String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId           String       @unique @db.ObjectId // Relación 1:1
  pets             Pet[]        // Relación 1:N

  @@index([verified])
  @@index([municipality])
}

model Provider {
  id               String       @id @default(auto()) @map("_id") @db.ObjectId
  businessName     String
  businessPhone    String?
  description      String?
  logo             String?
  municipality     Municipality
  address          String
  verified         Boolean      @default(false)
  rejectionReason  String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId           String       @unique @db.ObjectId // Relación 1:1
  products         Product[]    // Relación 1:N

  @@index([verified])
  @@index([municipality])
}

model Pet {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  species     String
  breed       String?
  age         Int?
  sex         String?
  status      PetStatus    @default(AVAILABLE) // RF-010
  description String
  requirements String?
  images      String[] // RN-007 (Array de URLs Cloudinary)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  shelter     Shelter      @relation(fields: [shelterId], references: [id], onDelete: Cascade)
  shelterId   String       @db.ObjectId
  adoptions   Adoption[]   // Relación 1:N

  @@index([status]) // RF-009, HU-006
  @@index([species]) // RF-009, HU-006
  @@index([shelterId])
  @@index([createdAt])
}

model Product {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  price       Float
  stock       Int      @default(0) // RF-013, HU-010
  category    String   // HU-015
  description String?
  images      String[]?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  provider    Provider @relation(fields: [providerId], references: [id], onDelete: Cascade)
  providerId  String   @db.ObjectId
  orderItems  OrderItem[]

  @@index([category])
  @@index([providerId])
  @@index([stock])
}

model Adoption {
  id          String         @id @default(auto()) @map("_id") @db.ObjectId
  status      AdoptionStatus @default(PENDING) // HU-007
  message     String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  adopter     User           @relation(fields: [adopterId], references: [id], onDelete: Cascade)
  adopterId   String         @db.ObjectId
  pet         Pet            @relation(fields: [petId], references: [id], onDelete: Cascade)
  petId       String         @db.ObjectId

  @@index([status])
  @@index([adopterId])
  @@index([petId])
  @@unique([adopterId, petId]) // Restricción clave única compuesta
}

model Order {
  id                   String         @id @default(auto()) @map("_id") @db.ObjectId
  status               OrderStatus    @default(PENDING)
  total                Float
  shippingMunicipality Municipality // HU-009, Valle de Aburrá
  shippingAddress      String
  paymentMethod        String // Simulado
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt

  user                 User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId               String         @db.ObjectId
  items                OrderItem[]

  @@index([status])
  @@index([userId])
  @@index([shippingMunicipality]) // HU-012
  @@index([createdAt])
}

model OrderItem {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  quantity  Int
  price     Float

  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   String   @db.ObjectId
  product   Product  @relation(fields: [productId], references: [id])
  productId String   @db.ObjectId

  @@index([orderId])
  @@index([productId])
}
```

> **Nota sobre Inserción de Datos de Prueba (Seed)**: Para cumplir con el requisito de la guía de "Inserción de datos de prueba (mínimo 3-5 registros por tabla)", el equipo de desarrollo utilizará un **Seed Script** de Node.js que empleará el **Prisma Client** para poblar las colecciones de MongoDB con datos representativos (usuarios, albergues, mascotas disponibles y productos) para la ejecución de pruebas funcionales.

## 9. Trazabilidad con Requerimientos

El siguiente matriz asegura la trazabilidad entre las entidades modeladas y los **Requerimientos Funcionales (RF)** e **Historias de Usuario (HU)** definidos en la Fase 1.

| Entidad       | Requerimientos Funcionales Relacionados                    | Historias de Usuario Asociadas                 |
| :------------ | :--------------------------------------------------------- | :--------------------------------------------- |
| **User**      | **RF-001**, **RF-002**, **RF-003**, **RF-004**, **RF-005** | **HU-001**, **HU-004**, **HU-014**             |
| **Shelter**   | **RF-005**, **RF-006**, **RF-011**, **RF-016**             | **HU-002**, **HU-008**, **HU-011**             |
| **Provider**  | **RF-005**, **RF-007**, **RF-012**, **RF-013**, **RF-017** | **HU-003**, **HU-010**, **HU-012**             |
| **Pet**       | **RF-008**, **RF-009**, **RF-010**, **RF-011**             | **HU-005**, **HU-006**, **HU-007**, **HU-008** |
| **Adoption**  | **RF-010**, **RF-016**                                     | **HU-007**, **HU-011**                         |
| **Product**   | **RF-012**, **RF-013**, **RF-014**                         | **HU-009**, **HU-010**                         |
| **Order**     | **RF-014**, **RF-015**, **RF-017**                         | **HU-009**, **HU-012**                         |
| **OrderItem** | **RF-014**, **RF-015**                                     | **HU-009**                                     |
