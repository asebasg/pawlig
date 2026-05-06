title:	[FEATURE] - Carrito de Compras
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	enhancement
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	78
--
## ✨ Feature

**¿Qué?**
Sistema completo de carrito de compras persistente en base de datos con validaciones en tiempo real, sincronización automática de cambios de productos, y UI integrada en el panel de usuario con tabs dinámicos.

**¿Por qué?**
- Cumplir con RF-015 (Carrito de Compras) y HU-009 (Simulación de compra de productos)
- Permitir a usuarios autenticados gestionar productos antes de finalizar compra
- Mantener persistencia del carrito entre sesiones
- Garantizar integridad de datos (productos eliminados/agotados se remueven automáticamente)
- Mejorar UX con actualizaciones en tiempo real

**¿Cómo funciona?**

**Flujo principal:**
1. Usuario autenticado navega en `/productos`
2. Usuario agrega producto al carrito desde `ProductCard` o `ProductDetailClient`
3. Sistema valida autenticación y disponibilidad del producto
4. Sistema guarda item en base de datos (tabla `CartItem`)
5. Botón flotante de carrito (esquina inferior derecha) actualiza contador
6. Usuario puede ver carrito completo en `/user` (tab "Mi Carrito")
7. Usuario puede modificar cantidades o eliminar items
8. Sistema sincroniza cambios en tiempo real

**Validaciones automáticas:**
- Si producto es eliminado por vendedor → Se elimina de TODOS los carritos
- Si stock llega a 0 → Producto se oculta del catálogo (ya implementado) y se eliminan los items de TODOS los carritos (+ mensaje de alerta "¿No encuentras algunos productos? Tal vez ya no estén disponibles")
- Si precio cambia → Se actualiza automáticamente en `ProductCard` y carrito
- Si nombre/imagen cambian → Se reflejan en tiempo real

**Flujo de usuarios anónimos:**
1. Usuario anónimo intenta agregar producto al carrito
2. Sistema detecta ausencia de autenticación
3. Sistema redirige a `/login` con redirección a `/productos`

**Integración con checkout existente:**
- El checkout simulado ya existe (mencionado en punto 4).
- Este issue solo implementa la gestión del carrito
- Checkout consultará items del carrito en BD y procesará orden. Reutilizar el `PaymentModal.tsx` para procesar la compra simulada

---

## 📋 Metadata

**Status:**

- [x] 📋 Todo (no iniciado)
- [ ] 🔄 En Progreso (trabajando activamente)
- [ ] 👀 En Revisión (para ser aprobado)
- [ ] ✅ Finalizado (completado)

**Priority:**

- [x] P0 - Crítico (blocker/requerimiento esencial)
- [ ] P1 - Alto (alta demanda/valor de negocio)
- [ ] P2 - Medio (mejora importante)
- [ ] P3 - Bajo (nice-to-have)

**Size (Story Points):**

- [ ] XS (< 1h - cambio trivial)
- [ ] S (1-2h - cambio simple)
- [ ] M (2-4h - cambio pequeño)
- [ ] L (1 día - cambio mediano)
- [x] XL (2-3 días - cambio grande)
- [ ] XXL (> 3 días - cambio muy grande)

**Componentes:**

- [x] Frontend
- [x] Backend
- [x] Database
- [x] API
- [ ] Tests
- [x] Docs

---

## ✅ TODO

### Diseño
- [x] Definir arquitectura del carrito persistente
- [x] Diseñar wireframe del tab "Mi Carrito" en `/user`
- [x] Diseñar botón flotante de carrito para `/productos`
- [x] Definir estrategia de sincronización en tiempo real

### Implementación - Database (Prisma)
- [x] Crear modelo `CartItem` en `prisma/schema.prisma`
- [x] Agregar relaciones: `CartItem` ↔ `User`, `CartItem` ↔ `Product`
- [x] Crear migración: `npx prisma migrate dev --name add-cart-items`
- [x] Agregar índices para optimizar queries

### Implementación - Backend (API)
- [x] Crear servicio `lib/services/cart.service.ts`
- [x] Endpoint POST `/api/cart` - Agregar producto al carrito
- [x] Endpoint GET `/api/cart` - Obtener items del carrito del usuario
- [x] Endpoint PUT `/api/cart/:id` - Actualizar cantidad de item
- [x] Endpoint DELETE `/api/cart/:id` - Eliminar item del carrito
- [x] Endpoint DELETE `/api/cart` - Vaciar carrito completo
- [x] Middleware: Validar autenticación en todos los endpoints

### Implementación - Frontend (UI)
- [x] Actualizar `components/cards/product-card.tsx` con botón "Agregar al Carrito"
- [x] Actualizar `components/ProductDetailClient.tsx` con botón "Agregar al Carrito"
- [ ] Crear componente `components/layout/FloatingCartButton.tsx` (botón flotante con contador)
- [ ] Crear componente `components/adopter/CartSection.tsx` (contenido del tab en `/user`)
- [ ] Crear componente `components/cart/CartItem.tsx` (item individual con +/- y eliminar)
- [ ] Crear componente `components/cart/CartSummary.tsx` (resumen: subtotal, total, pagar (PaymentModal.tsx))
- [x] Integrar tab "Mi Carrito" en `app/(dashboard)/user/page.tsx`

### Implementación - Sincronización en Tiempo Real
- [ ] Implementar polling cada 30 segundos para actualizar carrito
- [ ] Detectar cambios en productos (precio, disponibilidad, eliminación)
- [ ] Actualizar UI automáticamente sin recargar página
- [ ] Mostrar notificaciones (toasts) cuando productos cambien o sean eliminados

### Implementación - Validaciones
- [ ] Validar autenticación antes de agregar al carrito (redirect a `/login` si no está autenticado)
- [ ] Validar que producto exista antes de agregarlo
- [ ] Validar que producto NO esté agotado (stock > 0)
- [ ] Validar cantidades (mínimo 1, máximo según stock disponible)
- [ ] Eliminar automáticamente items si producto es eliminado
- [ ] Eliminar automáticamente items si stock llega a 0

### Testing
- [ ] Unit tests para `cart.service.ts`
- [ ] Integration tests para endpoints de carrito
- [ ] Validar sincronización de cambios de productos
- [ ] Validar redirección de usuarios anónimos
- [ ] Testing de concurrencia (múltiples usuarios, mismo producto)

### Finalización
- [ ] Code review
- [ ] Actualizar documentación en `.rules.md`
- [ ] Actualizar `CHANGELOG.md`
- [ ] Actualizar `/changelog`
- [ ] Validar performance con carritos grandes (>50 items)
- [ ] Documentar queries optimizadas

---

## 🎯 Acceptance Criteria

**Autenticación:**
- [ ] Solo usuarios autenticados (rol ADOPTER, SHELTER, VENDOR o ADMIN) pueden agregar al carrito
- [ ] Usuarios anónimos son redirigidos a `/login`
- [ ] Redirección de usuarios autenticados a `/productos`

**Gestión de Carrito (RF-015, HU-009):**
- [ ] Usuario puede agregar producto desde `ProductCard` en `/productos` o desde `ProductDetailClient`
- [ ] Usuario puede modificar cantidad de items en el carrito (+/-)
- [ ] Usuario puede eliminar items individuales del carrito
- [ ] Usuario puede vaciar carrito completo
- [ ] Sistema persiste carrito en base de datos (no se pierde al cerrar sesión)

**Botón Flotante:**
- [ ] Botón flotante aparece SOLO en `/productos` (esquina inferior derecha)
- [ ] Contador muestra número total de items en el carrito
- [ ] Contador se actualiza inmediatamente al agregar/eliminar productos
- [ ] Al hacer clic, redirige a `/user` (tab "Mi Carrito")

**Visualización en Dashboard:**
- [ ] Tab "Mi Carrito" se muestra en `app/(dashboard)/user/page.tsx`
- [ ] Tab usa sistema de tabs dinámicos (sin crear nueva página)
- [ ] Muestra lista de productos con: imagen, nombre, precio, cantidad, subtotal
- [ ] Muestra resumen: subtotal, total
- [ ] Botón "Ir a Checkout" redirige a página de checkout existente

**Validaciones en Tiempo Real:**
- [ ] Si vendedor elimina producto → Se elimina automáticamente de TODOS los carritos
- [ ] Si stock llega a 0 → Producto se elimina automáticamente de carritos
- [ ] Si precio cambia → Se actualiza automáticamente en carrito y `ProductCard`
- [ ] Si nombre/imagen cambian → Se reflejan en tiempo real en carrito
- [ ] Usuario ve notificación cuando productos son removidos automáticamente

**Integridad de Datos:**
- [ ] No se puede agregar producto con stock 0
- [ ] No se puede agregar producto que no existe
- [ ] Cantidad no puede ser menor a 1
- [ ] Cantidad no puede exceder stock disponible
- [ ] Items duplicados se consolidan (suma cantidades)

**Performance:**
- [ ] Agregar al carrito < 1 segundo (RNF-001)
- [ ] Cargar carrito completo < 2 segundos
- [ ] Sincronización de cambios cada 30 segundos (polling)
- [ ] UI responsive en móvil y desktop

---

## 🔧 Tech Spec

**Stack sugerido:**
- **State Management:** SWR para fetching y revalidación automática
- **Polling:** SWR `refreshInterval: 30000` (30 segundos)
- **Notificaciones:** Toast component (ya existente en el proyecto)
- **Optimistic Updates:** SWR `optimisticData` para UX instantánea

**Estructura de archivos:**
```
prisma/
└── schema.prisma                          # Modelo CartItem (nuevo)

app/
├── (dashboard)/
│   └── user/
│       └── page.tsx                       # Integración del tab "Mi Carrito" (M)
└── api/
    └── cart/
        ├── route.ts                       # GET (obtener) / POST (agregar) / DELETE (vaciar)
        └── [id]/
            └── route.ts                   # PUT (actualizar) / DELETE (eliminar item)

components/
├── cards/
│   └── product-card.tsx                   # Botón "Agregar al Carrito" (M)
└── cart/
│   ├── CartTabContent.tsx                 # Contenido del tab (A)
│   ├── CartItem.tsx                       # Item individual (A)
│   └── CartSummary.tsx                    # Resumen de compra (A)
└── layout/
    └── FloatingCartButton.tsx             # Botón flotante con contador (A)

lib/
├── services/
│   └── cart.service.ts                    # Lógica de negocio del carrito (A)
├── hooks/
│   ├── use-cart.ts                        # Hook personalizado para carrito (A)
│   └── use-cart-sync.ts                   # Hook para sincronización (A)
└── validations/
    └── cart.schema.ts                     # Esquemas Zod de validación (A)
```

**Migrations/Schema changes:**
```prisma
// En prisma/schema.prisma

model CartItem {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  quantity  Int      @default(1)
  
  // Relaciones
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String   @db.ObjectId
  
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String   @db.ObjectId
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Índices para performance
  @@unique([userId, productId]) // Un usuario no puede tener el mismo producto duplicado
  @@index([userId])
  @@index([productId])
  @@index([createdAt])
}

// Actualizar modelo User (agregar relación)
model User {
  // ... campos existentes
  cartItems CartItem[]
}

// Actualizar modelo Product (agregar relación)
model Product {
  // ... campos existentes
  cartItems CartItem[]
}
```

**Endpoints nuevos:**
```typescript
// POST /api/cart
// Body: { productId: string, quantity: number }
// Response:
{
  success: true,
  cartItem: {
    id: "xxx",
    productId: "yyy",
    quantity: 2,
    product: {
      id: "yyy",
      name: "Alimento Premium",
      price: 50000,
      stock: 10,
      images: [...]
    }
  }
}

// GET /api/cart
// Response:
{
  items: [
    {
      id: "xxx",
      quantity: 2,
      product: {
        id: "yyy",
        name: "Alimento Premium",
        price: 50000,
        stock: 10,
        images: [...],
        vendor: { businessName: "PetShop XYZ" }
      }
    }
  ],
  summary: {
    subtotal: 100000,
    total: 100000,
    itemsCount: 2
  }
}

// PUT /api/cart/:id
// Body: { quantity: number }
// Response:
{
  success: true,
  cartItem: { id: "xxx", quantity: 3, ... }
}

// DELETE /api/cart/:id
// Response:
{
  success: true,
  message: "Producto eliminado del carrito"
}

// DELETE /api/cart
// Response:
{
  success: true,
  message: "Carrito vaciado exitosamente"
}
```

**Ejemplo de uso del hook:**
```typescript
// En cualquier componente
import { useCart } from "@/lib/hooks/use-cart";

export default function ProductCard({ product }) {
  const { addToCart, isLoading, cartCount } = useCart();
  
  const handleAddToCart = async () => {
    await addToCart(product.id, 1);
    // Optimistic update → contador se actualiza instantáneamente
  };
  
  return (
    
      {isLoading ? "Agregando..." : "Agregar al Carrito"}
    
  );
}
```

**Sincronización automática:**
```typescript
// En CartTabContent.tsx
import useSWR from "swr";

export default function CartTabContent() {
  const { data, error, mutate } = useSWR('/api/cart', {
    refreshInterval: 30000, // Polling cada 30 segundos
    revalidateOnFocus: true,
    onSuccess: (data) => {
      // Detectar cambios y mostrar notificaciones
      checkForProductChanges(data);
    }
  });
  
  // ...
}
```

**Dependencies:**
```json
{
  "swr": "^2.2.4"
}
```

**Queries optimizadas (Prisma):**
```typescript
// En cart.service.ts
export async function getCartItems(userId: string) {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          vendor: {
            select: {
              businessName: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

// Agregar producto (consolidar duplicados)
export async function addToCart(userId: string, productId: string, quantity: number) {
  // Validar que producto exista y tenga stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  
  if (!product || product.stock === 0) {
    throw new Error("Producto no disponible");
  }
  
  // Buscar si ya existe en carrito
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });
  
  if (existingItem) {
    // Actualizar cantidad
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity
      },
      include: { product: true }
    });
  }
  
  // Crear nuevo item
  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity
    },
    include: { product: true }
  });
}
```

**Triggers automáticos (Prisma Middleware):**
```typescript
// En lib/prisma.ts (agregar middleware)
prisma.$use(async (params, next) => {
  // Si se elimina un producto, eliminar de todos los carritos
  if (params.model === 'Product' && params.action === 'delete') {
    await prisma.cartItem.deleteMany({
      where: { productId: params.args.where.id }
    });
  }
  
  // Si stock llega a 0, eliminar de todos los carritos
  if (params.model === 'Product' && params.action === 'update') {
    if (params.args.data.stock === 0) {
      await prisma.cartItem.deleteMany({
        where: { productId: params.args.where.id }
      });
    }
  }
  
  return next(params);
});
```

---

## 📎 Referencias

- **Requerimientos Funcionales:** RF-015 (Carrito de compras)
- **Historia de Usuario:** HU-009 (Simulación de compra de productos y generación de pedido)
- **Arquitectura:** `08_Arquitectura_del_Software.pdf` (sección 4.1.3 - Gestión de estado con Context API)
- **Manual de Usuario:** `19_Manual_del_Usuario.pdf` (sección 4.9 - Gestionar carrito de compras)
- **Diseño UI:** `12_Manual_de_Diseño_UI.pdf` (componentes de carrito)
- **Similar a:** Amazon, MercadoLibre (carrito persistente)
- **Docs SWR:** https://swr.vercel.app/

---

**Para Jules:** Implement this persistent shopping cart system following the tech spec. Ensure cart is stored in database, syncs automatically every 30 seconds, and handles product deletions/stock changes gracefully. Integrate the cart tab into the existing user dashboard using dynamic tabs. Add the floating cart button only on `/productos` page. Ensure all acceptance criteria are met and queries are optimized for performance.
