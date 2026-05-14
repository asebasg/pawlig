title:	[FEATURE] - Historial y Reportes de Ventas (Métricas)
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	enhancement
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	77
--
## ✨ Feature

**¿Qué?**
<!-- Qué nueva funcionalidad quieres agregar -->
Dashboard completo de métricas y reportes para vendedores con visualización de ventas, productos más vendidos, órdenes por estado, gráficos de tendencias y exportación en múltiples formatos (CSV, Excel, PDF).

**¿Por qué?**
<!-- Por qué quieres agregar esta funcionalidad -->
- Cumplir con HU-012 (Reporte de Órdenes Simuladas por Vendedor)
- Permitir a vendedores tomar decisiones basadas en datos
- Facilitar la gestión logística de envíos dentro del Valle de Aburrá
- Identificar productos de alto rendimiento y oportunidades de mejora
- Proporcionar transparencia sobre el desempeño del negocio

**¿Cómo funciona?**
<!-- Cómo quieres que funcione la funcionalidad -->
**Flujo principal:**
1. Vendedor accede a `/dashboard/vendor/metrics`
2. Sistema muestra dashboard con métricas generales y gráficos
3. Vendedor selecciona filtros de tiempo (semana, mes, 3 meses, 6 meses, año, personalizado)
4. Sistema actualiza visualizaciones según filtros
5. Vendedor puede exportar reporte en CSV, Excel o PDF
6. Sistema genera archivo descargable con todas las métricas

**Métricas incluidas:**
- **Ventas totales:** Suma en COP de todas las órdenes en el período
- **Número de órdenes:** Total de órdenes recibidas
- **Productos más vendidos:** Top 10 productos por unidades vendidas
- **Órdenes por estado:** Desglose (Pendiente, Confirmado, Enviado, Entregado, Cancelado)
- **Gráficos de tendencias:** Ventas por día/semana/mes según filtro seleccionado
- **Unidades vendidas:** Total de productos vendidos
- **Ticket promedio:** Valor promedio por orden
- **Distribución por municipio:** Órdenes agrupadas por municipio del Valle de Aburrá

---

## 📋 Metadata

**Status:**

- [x] 📋 Todo (no iniciado)
- [ ] 🔄 En Progreso (trabajando activamente)
- [ ] 👀 En Revisión (para ser aprobado)
- [ ] ✅ Finalizado (completado)

**Priority:**

- [ ] P0 - Crítico (blocker/requerimiento esencial)
- [x] P1 - Alto (alta demanda/valor de negocio)
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
- [ ] Database
- [x] API
- [ ] Tests
- [x] Docs

---

## ✅ TODO

### Diseño
- [ ] Definir arquitectura del servicio de métricas
- [ ] Diseñar wireframes del dashboard (similar a métricas de adopciones)
- [ ] Definir estructura de datos para cada métrica
- [ ] Diseñar layout de exportación PDF

### Implementación - Backend (API)
- [ ] Crear servicio de métricas en `lib/services/vendor-metrics.service.ts`
- [ ] Endpoint GET `/api/vendor/metrics` - Obtener métricas generales
- [ ] Endpoint GET `/api/vendor/metrics/products` - Top productos vendidos
- [ ] Endpoint GET `/api/vendor/metrics/orders` - Órdenes por estado
- [ ] Endpoint GET `/api/vendor/metrics/trends` - Datos para gráficos
- [ ] Endpoint GET `/api/vendor/metrics/export` - Exportar reportes

### Implementación - Frontend (Dashboard)
- [x] Crear página `app/(dashboard)/vendor/metrics/page.tsx`
- [ ] Componente `VendorMetricsClient.tsx` (lógica principal)
- [ ] Componente `MetricsFilters.tsx` (filtros de tiempo)
- [ ] Componente `MetricsCards.tsx` (tarjetas de KPIs)
- [ ] Componente `SalesChart.tsx` (gráfico de tendencias con Recharts)
- [ ] Componente `TopProductsTable.tsx` (tabla de productos más vendidos)
- [ ] Componente `OrdersByStatusChart.tsx` (gráfico de órdenes por estado)
- [ ] Componente `ExportButtons.tsx` (botones CSV/Excel/PDF)

### Implementación - Exportación
- [ ] Implementar exportación CSV con formato correcto
- [ ] Implementar exportación Excel con `xlsx` library
- [ ] Implementar exportación PDF con `jsPDF` y `jspdf-autotable`
- [ ] Incluir logo de PawLig en PDF
- [ ] Incluir metadatos (fecha generación, período, vendedor)

### Testing
- [ ] Unit tests para `vendor-metrics.service.ts`
- [ ] Integration tests para endpoints de métricas
- [ ] Validar cálculos de métricas con datos de prueba
- [ ] Validar exportación de archivos (CSV, Excel, PDF)
- [ ] Testing de filtros de tiempo

### Finalización
- [ ] Code review
- [ ] Actualizar documentación en `.rules.md`
- [ ] Actualizar `CHANGELOG.md`
- [ ] Validar performance con datasets grandes (>1000 órdenes)
- [ ] Documentar queries optimizadas

---

## 🎯 Acceptance Criteria

**Dashboard:**
- [ ] Vendedor puede acceder a `/dashboard/vendor/metrics` estando autenticado y verificado
- [ ] Dashboard muestra métricas generales del negocio
- [ ] Gráficos se renderizan correctamente con datos reales
- [ ] UI es responsive (móvil y desktop)

**Filtros:**
- [ ] Filtro "Última semana" muestra datos de últimos 7 días
- [ ] Filtro "Último mes" muestra datos de últimos 30 días
- [ ] Filtro "Últimos 3 meses" muestra datos de últimos 90 días
- [ ] Filtro "Últimos 6 meses" muestra datos de últimos 180 días
- [ ] Filtro "Último año" muestra datos de últimos 365 días
- [ ] Filtro "Personalizado" permite seleccionar rango de fechas específico
- [ ] Dashboard se actualiza al cambiar filtro (sin recargar página)

**Métricas (HU-012):**
- [ ] Muestra ventas totales en COP del período seleccionado
- [ ] Muestra número total de órdenes recibidas
- [ ] Muestra tabla con top 10 productos más vendidos (unidades ordenadas)
- [ ] Muestra desglose de órdenes por estado (Pendiente, Confirmado, Enviado, Entregado, Cancelado)
- [ ] Muestra gráfico de tendencias de ventas (línea temporal)
- [ ] Muestra total de unidades vendidas
- [ ] Muestra ticket promedio por orden
- [ ] Muestra distribución de órdenes por municipio del Valle de Aburrá

**Exportación:**
- [ ] Botón "Exportar CSV" genera archivo `.csv` descargable
- [ ] Botón "Exportar Excel" genera archivo `.xlsx` descargable
- [ ] Botón "Exportar PDF" genera archivo `.pdf` descargable
- [ ] Archivos exportados incluyen todas las métricas del período seleccionado
- [ ] PDF incluye logo de PawLig, fecha de generación y nombre del vendedor
- [ ] Archivos tienen nomenclatura: `reporte-ventas-[vendedor]-[fecha].{csv|xlsx|pdf}`

**Seguridad:**
- [ ] Solo vendedores verificados pueden acceder
- [ ] Vendedor solo ve sus propias métricas (no de otros vendedores)
- [ ] Endpoints protegidos con validación de rol VENDOR

**Performance:**
- [ ] Carga inicial del dashboard < 3 segundos (RNF-001)
- [ ] Cambio de filtro actualiza dashboard < 2 segundos
- [ ] Exportación de reporte < 5 segundos

---

## 🔧 Tech Spec

**Stack sugerido:**
- **Gráficos:** Recharts (ya usado en el proyecto)
- **Exportación Excel:** `xlsx` library
- **Exportación PDF:** `jspdf` + `jspdf-autotable`
- **Exportación CSV:** Implementación nativa con `Blob` API
- **Date handling:** `date-fns` para manejo de rangos de fechas

**Estructura de archivos:**
```
app/
├── (dashboard)/
│   └── vendor/
│       └── metrics/
│           └── page.tsx                    # Página principal de métricas

components/
├── vendor/
│   └── metrics/
│       ├── VendorMetricsClient.tsx        # Cliente principal
│       ├── MetricsCards.tsx               # Tarjetas de KPIs
│       ├── SalesChart.tsx                 # Gráfico de tendencias
│       ├── TopProductsTable.tsx           # Tabla top productos
│       ├── OrdersByStatusChart.tsx        # Gráfico órdenes por estado
│       └── ExportButtons.tsx              # Botones de exportación
├── filters/
│       └── MetricsFilters.tsx             # Filtros de tiempo

lib/
├── services/
│   └── vendor-metrics.service.ts          # Servicio de métricas
├── utils/
│   ├── export-csv.ts                      # Utilidad para CSV
│   ├── export-excel.ts                    # Utilidad para Excel
│   └── export-pdf.ts                      # Utilidad para PDF

app/api/
└── vendor/
    └── metrics/
        ├── route.ts                       # GET métricas generales
        ├── products/route.ts              # GET top productos
        ├── orders/route.ts                # GET órdenes por estado
        ├── trends/route.ts                # GET datos para gráficos
        └── export/route.ts                # GET exportar reportes
```

**Endpoints nuevos:**
```typescript
// GET /api/vendor/metrics?period=week&startDate=2026-01-01&endDate=2026-01-31
// Response:
{
  totalSales: 1500000,        // COP
  totalOrders: 45,
  totalUnits: 120,
  averageTicket: 33333.33,
  period: {
    startDate: "2026-01-01",
    endDate: "2026-01-31"
  }
}

// GET /api/vendor/metrics/products?period=week
// Response:
{
  products: [
    {
      id: "xxx",
      name: "Alimento Premium para Perro",
      unitsSold: 35,
      revenue: 875000
    },
    // ... top 10
  ]
}

// GET /api/vendor/metrics/orders?period=week
// Response:
{
  byStatus: {
    PENDING: 5,
    CONFIRMED: 10,
    SHIPPED: 15,
    DELIVERED: 12,
    CANCELLED: 3
  },
  byMunicipality: {
    MEDELLIN: 20,
    ENVIGADO: 10,
    ITAGUI: 8,
    // ...
  }
}

// GET /api/vendor/metrics/trends?period=week
// Response:
{
  data: [
    { date: "2026-01-15", sales: 50000, orders: 2 },
    { date: "2026-01-16", sales: 75000, orders: 3 },
    // ...
  ]
}

// GET /api/vendor/metrics/export?format=csv&period=month
// Response: File download (CSV/Excel/PDF)
```

**Dependencies:**
```json
{
  "xlsx": "^0.18.5",
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.2",
  "date-fns": "^3.0.0"
}
```

**Queries optimizadas (Prisma):**
```typescript
// Ejemplo de query optimizada para métricas
const metrics = await prisma.order.aggregate({
  where: {
    items: {
      some: {
        product: {
          vendorId: vendorId
        }
      }
    },
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  },
  _sum: {
    total: true
  },
  _count: {
    id: true
  }
});
```

**Migrations/Schema changes:**
No se requieren cambios en el schema. Se utilizan los modelos existentes: `Order`, `OrderItem`, `Product`, `Vendor`.

**Índices existentes relevantes:**
- `Order.createdAt` (ya existe)
- `Order.status` (ya existe)
- `OrderItem.productId` (ya existe)
- `Product.vendorId` (ya existe)

---

## 📎 Referencias

- **Diseño similar a:** `app/(dashboard)/shelter/metrics/page.tsx` (Métricas de adopciones)
- **Historia de Usuario:** HU-012 (Reporte de Órdenes Simuladas por Vendedor)
- **Requerimiento Funcional:** RF-018 (Dashboard administrativo - aplicar patrón similar)
- **Arquitectura:** `08_Arquitectura_del_Software.pdf` (sección 4.2.2 - Endpoints de reportes)
- **Docs Recharts:** https://recharts.org/en-US/
- **Docs jsPDF:** https://github.com/parallax/jsPDF
- **Docs xlsx:** https://docs.sheetjs.com/

---

**Para Jules:** Implement this vendor metrics dashboard following the same pattern as the shelter adoption reports. Ensure all acceptance criteria are met, queries are optimized for performance, and export functionality works correctly for all three formats (CSV, Excel, PDF). Use Recharts for visualizations and maintain consistency with the existing design system.

