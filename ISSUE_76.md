title:	[FEATURE] - Historial y Reportes de Adopciones (Métricas)
state:	OPEN
author:	asebasg (Sebastián Ospina)
labels:	enhancement
comments:	0
assignees:	asebasg (Sebastián Ospina)
projects:	
milestone:	
number:	76
--
## ✨ Feature

**¿Qué?**
<!-- Qué nueva funcionalidad quieres agregar -->
Sistema de métricas y reportes de adopciones para albergues que permite generar listados filtrados de adopciones finalizadas con opción de exportación en múltiples formatos (CSV, Excel, PDF).

**¿Por qué?**
<!-- Por qué quieres agregar esta funcionalidad -->
- Cumplir con HU-011 (Historial y Reporte de Adopciones)
- Permitir a los albergues llevar control interno del impacto
- Facilitar la generación de informes oficiales para entidades como la Alcaldía
- Proporcionar métricas de adopción por municipio del Valle de Aburrá
- Mejorar la transparencia y trazabilidad de las adopciones

**¿Cómo funciona?**
<!-- Cómo quieres que funcione la funcionalidad -->

**Flujo principal:**
1. Representante de albergue accede a su panel y selecciona "Métricas"
2. Sistema muestra interfaz de filtros (rango de fechas, municipio, estado) y gráficos generales
3. Usuario configura los filtros deseados y hace clic en "Generar Reporte"
4. Sistema consulta la base de datos con los filtros aplicados
5. Sistema muestra tabla con: fecha de adopción, adoptante, mascota, municipio
6. Sistema genera gráficos de métricas (adopciones por municipio, tendencias)
7. Usuario puede exportar en formato CSV, Excel o PDF
8. Sistema descarga el archivo con todas las métricas

**Casos de uso específicos:**
- Albergue genera reporte mensual para revisión interna
- Albergue exporta reporte anual en PDF para presentar a la Alcaldía
- Albergue consulta métricas de adopciones por municipio en tiempo real
- Albergue filtra adopciones de un periodo específico para análisis
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
- [ ] Definir arquitectura del sistema de reportes
- [ ] Diseñar UI de página de métricas (filtros, tabla, gráficos)
- [ ] Definir estructura de datos para exportación
- [ ] Seleccionar librería para generación de Excel y PDF

### Implementación - Backend
- [ ] Crear servicio `adoption-metric.service.ts` para lógica de métricas
- [ ] Implementar endpoint GET `/api/shelter/metrics/adoptions`
- [ ] Implementar endpoint GET `/api/shelter/metrics/adoptions/export`
- [ ] Agregar queries optimizadas con filtros y agregaciones
- [ ] Implementar generación de archivos CSV
- [ ] Implementar generación de archivos Excel (xlsx)
- [ ] Implementar generación de archivos PDF

### Implementación - Frontend
- [x] Crear página `/app/(dashboard)/shelter/metrics/page.tsx`
- [ ] Crear componente `AdoptionMetricsClient.tsx`
- [ ] Implementar filtros de fecha (date range picker)
- [ ] Implementar filtro por municipio
- [ ] Implementar filtro por estado de adopción
- [ ] Crear tabla de resultados con datos de adopciones
- [ ] Implementar gráficos de métricas (adopciones por municipio, tendencias)
- [ ] Crear botones de exportación (CSV, Excel, PDF)
- [ ] Implementar descarga de archivos generados

### Testing
- [ ] Unit tests para `adoption-report.service.ts`
- [ ] Integration tests para endpoints de reportes
- [ ] Validar generación correcta de archivos CSV, Excel, PDF
- [ ] Validar filtros funcionan correctamente
- [ ] Validar métricas calculadas son precisas

### Finalización
- [ ] Code review
- [ ] Actualizar documentación del proyecto
- [ ] Actualizar `CHANGELOG.md`
- [ ] Validar performance con grandes volúmenes de datos

---

## 🎯 Acceptance Criteria

**Visualización de métricas:**
- [ ] Albergue accede a página "Métricas" desde su panel
- [ ] Sistema muestra filtros: rango de fechas, municipio, estado
- [ ] Sistema muestra tabla con: fecha de adopción, adoptante (nombre), mascota (nombre), municipio
- [ ] Sistema muestra total de adopciones en el periodo seleccionado
- [ ] Sistema muestra gráfico de adopciones por municipio
- [ ] Sistema muestra gráfico de tendencia temporal (opcional)

**Filtrado:**
- [ ] Filtro de fecha permite seleccionar rango personalizado
- [ ] Filtro de municipio permite seleccionar uno o varios municipios del Valle de Aburrá
- [ ] Filtro de estado permite ver solo adopciones "Aprobadas" o todas
- [ ] Botón "Limpiar filtros" restablece a valores por defecto

**Exportación:**
- [ ] Botón "Exportar CSV" genera archivo con extensión .csv
- [ ] Botón "Exportar Excel" genera archivo con extensión .xlsx
- [ ] Botón "Exportar PDF" genera archivo con extensión .pdf
- [ ] Archivos exportados incluyen todos los datos filtrados
- [ ] Archivos exportados incluyen métricas de adopción por municipio
- [ ] Archivos PDF incluyen logo de PawLig y branding
- [ ] Archivos tienen nombre descriptivo: `adopciones_[albergue]_[fecha].ext`

**Datos y métricas:**
- [ ] Solo se muestran adopciones del albergue autenticado
- [ ] Fechas se muestran en formato legible (DD/MM/YYYY)
- [ ] Municipios se muestran con nombres completos (no códigos)
- [ ] Métricas por municipio son precisas y suman correctamente

**Performance:**
- [ ] Generación de reportes con < 1000 registros toma menos de 3 segundos
- [ ] Exportación de archivos no bloquea la UI

---

## 🔧 Tech Spec

**Stack sugerido:**
- **Generación CSV:** Librería nativa de Node.js o `csv-writer`
- **Generación Excel:** `exceljs` o `xlsx`
- **Generación PDF:** `pdfkit` o `jsPDF` con `html2canvas`
- **Gráficos:** `recharts` (ya usado en el proyecto)
- **Date picker:** `react-day-picker` o componente custom

**Estructura de archivos:**
```
app/
├── (dashboard)/
│   └── shelter/
│       └── metrics/
│           └── page.tsx              # Página de métricas (Server Component)
components/
├── shelter/
│   ├── AdoptionMetricsClient.tsx    # Cliente de métricas
│   ├── AdoptionTable.tsx            # Tabla de resultados
│   ├── AdoptionCharts.tsx           # Gráficos de métricas
│   └── ExportButtons.tsx            # Botones de exportación
├── filters/
│   └── AdoptionFilters.tsx          # Componente de filtros
lib/
├── services/
│   └── adoption-report.service.ts   # Lógica de reportes y exportación
├── utils/
│   ├── csv-generator.ts             # Generador de CSV
│   ├── excel-generator.ts           # Generador de Excel
│   └── pdf-generator.ts             # Generador de PDF
types/
└── report.types.ts                  # Tipos para reportes
```

**Endpoints nuevos:**
```typescript
// Obtener métricas de adopciones con filtros
GET /api/shelter/reports/adoptions
Query params: 
  - startDate: string (ISO 8601)
  - endDate: string (ISO 8601)
  - municipality?: Municipality
  - status?: AdoptionStatus

Response: {
  adoptions: Array;
  total: number;
  byMunicipality: Record;
}

// Exportar reporte en formato especificado
GET /api/shelter/reports/adoptions/export
Query params:
  - format: "csv" | "excel" | "pdf"
  - startDate: string
  - endDate: string
  - municipality?: Municipality
  - status?: AdoptionStatus

Response: Archivo descargable (Content-Type según formato)
```

**Dependencies:**
```json
{
  "exceljs": "^4.4.0",
  "pdfkit": "^0.14.0",
  "react-day-picker": "^8.10.0",
  "date-fns": "^3.0.0"
}
```

**Migrations/Schema changes:**
```typescript
// No se requieren cambios en el schema de Prisma
// Los datos ya existen en el modelo Adoption
// Se agregarán índices para optimizar queries de reportes:

@@index([shelterId, createdAt])
@@index([shelterId, status, createdAt])
```

**Ejemplo de generación de CSV:**
```typescript
// lib/utils/csv-generator.ts
export function generateAdoptionCSV(adoptions: AdoptionReport[]) {
  const headers = ["Fecha", "Adoptante", "Mascota", "Municipio"];
  const rows = adoptions.map(a => [
    formatDate(a.adoptionDate),
    a.adopterName,
    a.petName,
    a.municipality,
  ]);
  
  return [headers, ...rows]
    .map(row => row.join(","))
    .join("\n");
}
```

**Consideraciones de seguridad:**
- Solo albergues autenticados pueden acceder a sus reportes
- Validar que el albergue solo accede a sus propias adopciones
- Sanitizar inputs de filtros para prevenir SQL injection
- Rate limiting en endpoints de exportación (máx 10 exportaciones/minuto)

## 📎 Referencias

- **Requerimientos:** RF-017 (Reporte de adopciones por albergue)
- **Historia de Usuario:** HU-011 (Historial y Reporte de Adopciones)
- **Arquitectura:** `08_Arquitectura_del_Software.pdf` (sección 4.2.2 - Reportes)
- **Manual de Usuario:** `19_Manual_del_Usuario.pdf` (sección 5.8 - Generar reportes)
- **Docs exceljs:** https://github.com/exceljs/exceljs
- **Docs pdfkit:** https://pdfkit.org/
- **Similar a:** Sistema de reportes de Stripe Dashboard, Analytics de Vercel

---

**Para Jules:** Implement this email notification system following the tech spec. Prioritize P0 emails first (password reset, adoption status, order status, new order/adoption notifications), then implement P1 emails (account approvals/rejections). Ensure all acceptance criteria are met, templates are responsive, and error handling is robust. Use async/await patterns to prevent blocking API responses.

