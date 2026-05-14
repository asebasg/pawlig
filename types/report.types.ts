/**
 * Descripción: Tipos e interfaces estandarizadas para el sistema de métricas y reportes.
 * Requiere: Tipos de Prisma para extender información sin usar `any`.
 * Implementa: HU-011 y HU-012.
 */

import { Municipality, AdoptionStatus } from "@prisma/client";

export type TimePeriod = "week" | "month" | "3months" | "6months" | "year" | "custom";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface BaseReportFilters extends Partial<DateRange> {
  municipality?: Municipality;
}

export interface AdoptionReportFilters extends BaseReportFilters {
  status?: AdoptionStatus;
}

export interface VendorMetricsFilters extends BaseReportFilters {
  period?: TimePeriod;
}

export interface AdoptionReportData {
  id: string;
  adoptionDate: Date;
  adopterName: string;
  petName: string;
  shelterName?: string;
  municipality: Municipality;
  status: AdoptionStatus;
}

export interface TopProductData {
  id: string;
  name: string;
  vendorName: string;
  unitsSold: number;
  revenue: number;
}

export interface SalesTrendData {
  date: string;
  sales: number;
  orders: number;
}

export interface VendorMetricsData {
  totalSales: number;
  totalOrders: number;
  totalUnits: number;
  averageTicket: number;
  period: DateRange;
}

export interface ExportOptions<T> {
  data: T[];
  headers: { key: keyof T; label: string }[];
  filename?: string;
  title?: string;
  subtitle?: string;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Archivo central para compartir tipos fuertes entre los servicios de backend
 * y componentes del cliente, garantizando la eliminación absoluta del tipo `any`.
 *
 * Lógica Clave:
 * - ExportOptions<T>: Generics utilizado en los generadores (CSV, Excel, PDF)
 *   para garantizar tipado fuerte en las columnas dinámicas.
 *
 */
