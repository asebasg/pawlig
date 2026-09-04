"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import UserProfileForm from "@/components/forms/user-profile-form";
import VendorProfileForm from "@/components/forms/vendor-profile-form";
import ShelterProfileForm from "@/components/forms/shelter-profile-form";
import { User, House, Building2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { springUI, springMomentum, reducedMotionTransition } from "@/lib/utils/motion";

interface UnifiedProfileClientProps {
  role: UserRole;
}

export default function UnifiedProfileClient({
  role,
}: UnifiedProfileClientProps) {
  const [activeTab, setActiveTab] = useState<
    "personal" | "business" | "shelter"
  >("personal");

  const shouldReduceMotion = useReducedMotion();
  const transitionUI = shouldReduceMotion ? reducedMotionTransition : springUI;
  const transitionMomentum = shouldReduceMotion ? reducedMotionTransition : springMomentum;

  const hasSecondaryTab = role === UserRole.VENDOR || role === UserRole.SHELTER;

  {/* // TODO: Implementar el sistema de fotos de perfil a la app */}
  return (
    <motion.div 
      layout
      transition={transitionUI}
      className="bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] p-6 sm:p-10 relative overflow-hidden"
    >
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      
      {hasSecondaryTab && (
        <div className="flex border-b border-gray-200/60 mb-8 overflow-x-auto scrollbar-hide gap-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={transitionMomentum}
            onClick={() => setActiveTab("personal")}
            className={`pb-4 font-medium text-[15px] whitespace-nowrap relative transition-colors duration-200 ${
              activeTab === "personal"
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <User className="w-[18px] h-[18px] inline mr-2 opacity-75" />
            Información Personal
            {activeTab === "personal" && (
              <motion.span
                layoutId="activeProfileTab"
                transition={transitionUI}
                className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full"
              />
            )}
          </motion.button>

          {role === UserRole.VENDOR && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={transitionMomentum}
              onClick={() => setActiveTab("business")}
              className={`pb-4 font-medium text-[15px] whitespace-nowrap relative transition-colors duration-200 ${
                activeTab === "business"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Building2 className="w-[18px] h-[18px] inline mr-2 opacity-75" />
              Información de Negocio
              {activeTab === "business" && (
                <motion.span
                  layoutId="activeProfileTab"
                  transition={transitionUI}
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full"
                />
              )}
            </motion.button>
          )}

          {role === UserRole.SHELTER && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={transitionMomentum}
              onClick={() => setActiveTab("shelter")}
              className={`pb-4 font-medium text-[15px] whitespace-nowrap relative transition-colors duration-200 ${
                activeTab === "shelter"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <House className="w-[18px] h-[18px] inline mr-2 opacity-75" />
              Información del Albergue
              {activeTab === "shelter" && (
                <motion.span
                  layoutId="activeProfileTab"
                  transition={transitionUI}
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 rounded-t-full"
                />
              )}
            </motion.button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={transitionUI}
        >
          {activeTab === "personal" && <UserProfileForm />}
          {activeTab === "business" && role === UserRole.VENDOR && (
            <VendorProfileForm />
          )}
          {activeTab === "shelter" && role === UserRole.SHELTER && (
            <ShelterProfileForm />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
