'use client';

import { Heart, Clock, CheckCircle, XCircle } from 'lucide-react';

interface UserStatsProps {
  favoritesCount: number;
  pendingAdoptions: number;
  approvedAdoptions: number;
  rejectedAdoptions: number;
}

export default function UserStats({
  favoritesCount,
  pendingAdoptions,
  approvedAdoptions,
  rejectedAdoptions,
}: UserStatsProps) {
  const stats = [
    {
      label: 'Mascotas Favoritas',
      value: favoritesCount,
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      label: 'Postulaciones Pendientes',
      value: pendingAdoptions,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      label: 'Postulaciones Aprobadas',
      value: approvedAdoptions,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Postulaciones Rechazadas',
      value: rejectedAdoptions,
      icon: XCircle,
      color: 'text-gray-600',
      bg: 'bg-gray-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bg} p-3 rounded-full`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
