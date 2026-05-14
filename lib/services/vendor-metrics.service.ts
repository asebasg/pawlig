/**
 * Descripción: Servicio de negocio para la generación de métricas y reportes de ventas (vendor).
 * Requiere: Prisma client y tipos de reportes estandarizados.
 * Implementa: HU-012.
 */

import { prisma } from "@/lib/utils/db";
import { VendorMetricsFilters, VendorMetricsData, TopProductData } from "@/types/report.types";
import { Prisma } from "@prisma/client";
import { subDays, subMonths, subYears, startOfDay, endOfDay, format } from "date-fns";

export function getPeriodDates(period: string, customStartDate?: string, customEndDate?: string) {
  const now = new Date();
  let startDate = new Date(0);
  let endDate = endOfDay(now);

  switch (period) {
    case "week":
      startDate = startOfDay(subDays(now, 7));
      break;
    case "month":
      startDate = startOfDay(subDays(now, 30));
      break;
    case "3months":
      startDate = startOfDay(subMonths(now, 3));
      break;
    case "6months":
      startDate = startOfDay(subMonths(now, 6));
      break;
    case "year":
      startDate = startOfDay(subYears(now, 1));
      break;
    case "custom":
      if (customStartDate) startDate = startOfDay(new Date(customStartDate));
      if (customEndDate) endDate = endOfDay(new Date(customEndDate));
      break;
  }

  return { startDate, endDate };
}

export async function getVendorMetrics(vendorId: string | null, filters: VendorMetricsFilters): Promise<VendorMetricsData> {
  const { period = "month", startDate: customStart, endDate: customEnd, municipality } = filters;
  const { startDate, endDate } = getPeriodDates(period, customStart, customEnd);

  const whereClause: Prisma.OrderWhereInput = {
    createdAt: { gte: startDate, lte: endDate },
  };
  if (vendorId) {
    whereClause.items = { some: { product: { vendorId } } };
  }

  if (municipality) {
    if (vendorId === null) {
      whereClause.items = { some: { product: { vendor: { municipality } } } };
    } else {
      whereClause.shippingMunicipality = municipality;
    }
  }

  // Agrupaciones base de la orden
  const aggregations = await prisma.order.aggregate({
    where: whereClause,
    _sum: { total: true },
    _count: { id: true },
  });

  // Agrupaciones de los items
  const itemWhere: Prisma.OrderItemWhereInput = { order: whereClause };
  if (vendorId) itemWhere.product = { vendorId };
  
  const itemAggregations = await prisma.orderItem.aggregate({
    where: itemWhere,
    _sum: { quantity: true },
  });

  const totalSales = aggregations._sum.total || 0;
  const totalOrders = aggregations._count.id || 0;
  const totalUnits = itemAggregations._sum.quantity || 0;
  const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

  return {
    totalSales,
    totalOrders,
    totalUnits,
    averageTicket,
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  };
}

export async function getVendorTopProducts(vendorId: string | null, filters: VendorMetricsFilters): Promise<TopProductData[]> {
  const { period = "month", startDate: customStart, endDate: customEnd, municipality } = filters;
  const { startDate, endDate } = getPeriodDates(period, customStart, customEnd);

  const orderWhere: Prisma.OrderWhereInput = {
    createdAt: { gte: startDate, lte: endDate },
  };

  if (municipality) {
    if (vendorId === null) {
      orderWhere.items = { some: { product: { vendor: { municipality } } } };
    } else {
      orderWhere.shippingMunicipality = municipality;
    }
  }

  const itemWhere: Prisma.OrderItemWhereInput = { order: orderWhere };
  if (vendorId) {
    itemWhere.product = { vendorId };
  } else if (municipality) {
    itemWhere.product = { vendor: { municipality } };
  }

  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: itemWhere,
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
  });

  const productIds = grouped.map((g) => g.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { 
      id: true, 
      name: true, 
      price: true,
      vendor: { select: { businessName: true } }
    },
  });

  return grouped.map((g) => {
    const p = products.find((prod) => prod.id === g.productId);
    const units = g._sum.quantity || 0;
    return {
      id: g.productId,
      name: p?.name || "Desconocido",
      vendorName: p?.vendor?.businessName || "Desconocido",
      unitsSold: units,
      revenue: units * (p?.price || 0),
    };
  });
}

export async function getVendorOrders(vendorId: string | null, filters: VendorMetricsFilters) {
  const { period = "month", startDate: customStart, endDate: customEnd, municipality } = filters;
  const { startDate, endDate } = getPeriodDates(period, customStart, customEnd);

  const whereClause: Prisma.OrderWhereInput = {
    createdAt: { gte: startDate, lte: endDate },
  };
  if (vendorId) {
    whereClause.items = { some: { product: { vendorId } } };
  }

  if (municipality) {
    if (vendorId === null) {
      whereClause.items = { some: { product: { vendor: { municipality } } } };
    } else {
      whereClause.shippingMunicipality = municipality;
    }
  }

  const statusGroup = await prisma.order.groupBy({
    by: ["status"],
    where: whereClause,
    _count: { id: true },
  });

  const byStatus: Record<string, number> = {};
  statusGroup.forEach(g => {
    byStatus[g.status] = g._count.id;
  });

  const muniGroup = await prisma.order.groupBy({
    by: ["shippingMunicipality"],
    where: whereClause,
    _count: { id: true },
  });

  const byMunicipality: Record<string, number> = {};
  muniGroup.forEach(g => {
    byMunicipality[g.shippingMunicipality] = g._count.id;
  });

  return { byStatus, byMunicipality };
}

export async function getVendorTrends(vendorId: string | null, filters: VendorMetricsFilters) {
  const { period = "month", startDate: customStart, endDate: customEnd, municipality } = filters;
  const { startDate, endDate } = getPeriodDates(period, customStart, customEnd);

  const whereClause: Prisma.OrderWhereInput = {
    createdAt: { gte: startDate, lte: endDate },
  };
  if (vendorId) {
    whereClause.items = { some: { product: { vendorId } } };
  }

  if (municipality) {
    if (vendorId === null) {
      whereClause.items = { some: { product: { vendor: { municipality } } } };
    } else {
      whereClause.shippingMunicipality = municipality;
    }
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: { createdAt: 'asc' }
  });

  // Agrupar por día
  const trends: Record<string, { sales: number; orders: number }> = {};
  orders.forEach(order => {
    const dateStr = format(order.createdAt, "yyyy-MM-dd");
    if (!trends[dateStr]) trends[dateStr] = { sales: 0, orders: 0 };
    trends[dateStr].sales += order.total;
    trends[dateStr].orders += 1;
  });

  return Object.keys(trends).map(date => ({
    date,
    sales: trends[date].sales,
    orders: trends[date].orders
  }));
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Resuelve cálculos de agregación complejos para las métricas de ventas.
 *
 * Lógica Clave:
 * - groupBy de Prisma para agrupar ventas por producto y obtener el top 10.
 * - getPeriodDates() se encarga de estandarizar la entrada de tiempo "week", "month" etc.
 *
 */
