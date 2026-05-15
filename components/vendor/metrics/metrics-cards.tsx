"use client";

import { VendorMetricsData } from "@/types/report.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";

interface MetricsCardsProps {
  metrics: VendorMetricsData | null;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  if (!metrics) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-500">Ventas Totales</CardTitle>
          <div className="p-2 bg-green-100 text-green-600 rounded-full">
            <DollarSign className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(metrics.totalSales)}</div>
          <p className="text-xs text-gray-400 mt-1">Ingresos del período seleccionado</p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-500">Total Órdenes</CardTitle>
          <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">{metrics.totalOrders}</div>
          <p className="text-xs text-gray-400 mt-1">Pedidos recibidos</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-500">Unidades Vendidas</CardTitle>
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
            <Package className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">{metrics.totalUnits}</div>
          <p className="text-xs text-gray-400 mt-1">Total de productos despachados</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-gray-500">Ticket Promedio</CardTitle>
          <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
            <TrendingUp className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(metrics.averageTicket)}</div>
          <p className="text-xs text-gray-400 mt-1">Valor promedio por orden</p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Tarjetas de KPIs principales (Ventas, Órdenes, Unidades, Ticket).
 */
