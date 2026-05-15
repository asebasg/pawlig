"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdoptionChartsProps {
  byMunicipality: Record<string, number>;
}

export function AdoptionCharts({ byMunicipality }: AdoptionChartsProps) {
  const data = Object.entries(byMunicipality).map(([name, count]) => ({
    name,
    count
  }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        No hay datos suficientes para generar gráficos.
      </div>
    );
  }

  return (
    <div className="h-80 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Adopciones por Municipio</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
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
 * Gráfico de barras usando Recharts para mostrar las adopciones por municipio.
 * Responsivo y con colores definidos según los lineamientos.
 */
