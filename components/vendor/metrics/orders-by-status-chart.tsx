"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface OrdersByStatusChartProps {
  byStatus: Record<string, number>;
}

const COLORS = {
  PENDING: '#F59E0B',    // Yellow
  CONFIRMED: '#3B82F6',  // Blue
  SHIPPED: '#8B5CF6',    // Purple
  DELIVERED: '#10B981',  // Green
  CANCELLED: '#EF4444',  // Red
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export function OrdersByStatusChart({ byStatus }: OrdersByStatusChartProps) {
  const data = Object.entries(byStatus).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: COLORS[status as keyof typeof COLORS] || '#6B7280'
  }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        No hay órdenes para mostrar estados.
      </div>
    );
  }

  return (
    <div className="h-80 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Órdenes por Estado</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Gráfico de pie usando Recharts para desglosar el estado de las órdenes.
 */
