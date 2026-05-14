"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SalesTrendData } from "@/types/report.types";

/**
 * Descripción: Gráfico de área para visualizar la tendencia de ventas de un vendedor.
 * Requiere: Datos de tendencia de ventas formateados según SalesTrendData.
 * Implementa: HU-012 (Métricas de Vendedor).
 */

interface SalesChartProps {
  data: SalesTrendData[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        No hay suficientes datos para graficar tendencias.
      </div>
    );
  }

  return (
    <div className="h-80 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Tendencia de Ventas (COP)</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000)}k`} 
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
              formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                const numericValue = Array.isArray(value) ? Number(value[0] || 0) : Number(value || 0);
                return [
                  new Intl.NumberFormat("es-CO", { 
                    style: "currency", 
                    currency: "COP", 
                    maximumFractionDigits: 0 
                  }).format(numericValue),
                  "Ventas"
                ];
              }}
            />
            <Area type="monotone" dataKey="sales" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Gráfico de área interactivo que muestra el volumen de ventas en pesos colombianos.
 *
 * Lógica Clave:
 * - Recharts Tooltip: Se utiliza tipado genérico <number, string> para resolver 
 *   conflictos de tipos con el formateador de moneda.
 * - Gradientes: Uso de linearGradient para un efecto visual premium.
 *
 * Dependencias Externas:
 * - recharts: Librería base para la visualización de datos.
 * - Intl.NumberFormat: Estándar para el formateo de moneda colombiana.
 *
 */
