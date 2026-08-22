'use client';

import { useState } from 'react';
import { UserRole } from '@prisma/client';
import UserProfileForm from '@/components/forms/user-profile-form';
import VendorProfileForm from '@/components/forms/vendor-profile-form';
import ShelterProfileForm from '@/components/forms/shelter-profile-form';

interface UnifiedProfileClientProps {
  role: UserRole;
}

export default function UnifiedProfileClient({ role }: UnifiedProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'shelter'>('personal');

  const hasSecondaryTab = role === UserRole.VENDOR || role === UserRole.SHELTER;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      {hasSecondaryTab && (
        <div className="flex border-b mb-8 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Información Personal
          </button>
          
          {role === UserRole.VENDOR && (
            <button
              onClick={() => setActiveTab('business')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'business'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Información de Negocio
            </button>
          )}

          {role === UserRole.SHELTER && (
            <button
              onClick={() => setActiveTab('shelter')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'shelter'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Información del Albergue
            </button>
          )}
        </div>
      )}

      <div>
        {activeTab === 'personal' && <UserProfileForm />}
        {activeTab === 'business' && role === UserRole.VENDOR && <VendorProfileForm />}
        {activeTab === 'shelter' && role === UserRole.SHELTER && <ShelterProfileForm />}
      </div>
    </div>
  );
}
