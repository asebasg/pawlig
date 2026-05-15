"use client";

import { useState, useEffect } from "react";
import { VendorMetricsFilters, VendorMetricsData, TopProductData, SalesTrendData } from "@/types/report.types";
import { MetricsFilters } from "./metrics-filters";
import { MetricsCards } from "./metrics-cards";
import { TopProductsTable } from "./top-products-table";
import { SalesChart } from "./sales-chart";
import { OrdersByStatusChart } from "./orders-by-status-chart";
import { ExportButtons } from "@/components/shelter/metrics/export-buttons";
import Loader from "@/components/ui/loader";

interface VendorMetricsClientProps {
  isAdmin?: boolean;
}

export function VendorMetricsClient({ isAdmin = false }: VendorMetricsClientProps) {
  const [filters, setFilters] = useState<VendorMetricsFilters>({ period: "month" });
  
  const [metrics, setMetrics] = useState<VendorMetricsData | null>(null);
  const [products, setProducts] = useState<TopProductData[]>([]);
  const [ordersStatus, setOrdersStatus] = useState<Record<string, number>>({});
  const [trends, setTrends] = useState<SalesTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = isAdmin ? "/api/admin/metrics/sales" : "/api/vendor/metrics";
  const exportUrl = isAdmin ? "/api/admin/metrics/sales/export" : "/api/vendor/metrics/export";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.period) params.set("period", filters.period);
        if (filters.startDate) params.set("startDate", filters.startDate);
        if (filters.endDate) params.set("endDate", filters.endDate);
        if (filters.municipality) params.set("municipality", filters.municipality);

        const qs = params.toString();

        const [resMetrics, resProducts, resOrders, resTrends] = await Promise.all([
          fetch(`${baseUrl}?${qs}`),
          fetch(`${baseUrl}/products?${qs}`),
          fetch(`${baseUrl}/orders?${qs}`),
          fetch(`${baseUrl}/trends?${qs}`),
        ]);

        if (resMetrics.ok) setMetrics(await resMetrics.json());
        if (resProducts.ok) setProducts((await resProducts.json()).products);
        if (resOrders.ok) setOrdersStatus((await resOrders.json()).byStatus);
        if (resTrends.ok) setTrends((await resTrends.json()).data);
        
      } catch (error) {
        console.error("Error cargando métricas de ventas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, baseUrl]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isAdmin ? "Visión Global de Ventas" : "Resumen de tu Negocio"}
          </h2>
          <p className="text-sm text-gray-500">Métricas clave en el período seleccionado</p>
        </div>
        <ExportButtons filters={filters} exportUrl={exportUrl} />
      </div>

      <MetricsFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <Loader />
        </div>
      ) : (
        <div className="space-y-6">
          <MetricsCards metrics={metrics} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <SalesChart data={trends} />
            </div>
            <div className="space-y-4">
              <OrdersByStatusChart byStatus={ordersStatus} />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Top 10 Productos Más Vendidos</h3>
            <TopProductsTable products={products} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Cliente principal para la gestión de métricas de ventas. Fetching paralelo
 * para mejorar el rendimiento.
 */
