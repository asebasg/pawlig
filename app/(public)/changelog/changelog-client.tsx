"use client";

import React, { useState, useRef } from "react";
import {
  Calendar,
  History,
  Heart,
  Bug,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { PaginationSystem } from "@/components/ui/pagination-system";

interface Update {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bg: string;
}

interface Version {
  version: string;
  date: string;
  title: string;
  description: string;
  color: string;
  updates: Update[];
}

interface ChangelogClientProps {
  versions: Version[];
  lastUpdate: string;
}

export default function ChangelogClient({ versions, lastUpdate }: ChangelogClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(versions.length / itemsPerPage);

  const listRef = useRef<HTMLDivElement>(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVersions = versions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll al inicio del contenedor de la lista
    if (listRef.current) {
      const offset = 100; // Espacio para no quedar pegado al borde superior
      const elementPosition = listRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleSidebarClick = (e: React.MouseEvent<HTMLAnchorElement>, versionId: string, index: number) => {
    e.preventDefault();
    const targetPage = Math.floor(index / itemsPerPage) + 1;

    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
      // Necesitamos esperar a que el DOM se actualice antes de scrollear al elemento
      setTimeout(() => {
        const element = document.getElementById(versionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(versionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 -mt-20 relative z-20 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navegación Lateral (Sticky) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <History size={14} /> Historial
            </h3>
            <nav className="flex flex-col gap-2">
              {versions.map((v, i) => {
                const targetPage = Math.floor(i / itemsPerPage) + 1;
                const isCurrentPage = targetPage === currentPage;

                return (
                  <a
                    key={v.version}
                    href={`#${v.version}`}
                    onClick={(e) => handleSidebarClick(e, v.version, i)}
                    className={`group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all ${
                      isCurrentPage ? "bg-slate-50/50" : ""
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-tr ${v.color} shadow-sm group-hover:scale-125 transition-transform duration-300 ${
                        isCurrentPage ? "scale-110 ring-2 ring-purple-100" : "opacity-60"
                      }`}
                    />
                    <span className={`text-sm font-bold transition-colors ${
                      isCurrentPage ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                    }`}>
                      {v.version}
                    </span>
                  </a>
                );
              })}
            </nav>
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center font-medium">
                Última actualización: <br />{" "}
                <span className="text-slate-600 font-bold">{lastUpdate}</span>
              </p>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <div className="lg:col-span-9 space-y-16" ref={listRef}>
          <div className="space-y-16 min-h-[600px]">
            {currentVersions.map((v, i) => (
              <section
                key={v.version}
                id={v.version}
                className="scroll-mt-32 group animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="relative pl-8 md:pl-0">
                  {/* Timeline Line (Mobile/Tablet) */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-200 to-transparent md:hidden rounded-full" />

                  {/* Version Header */}
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-8 relative">
                    <div
                      className={`hidden md:flex absolute -left-[4.5rem] top-2 w-12 h-12 rounded-full bg-gradient-to-br ${v.color} items-center justify-center shadow-lg text-white font-bold text-sm ring-4 ring-slate-50 z-10`}
                    >
                      {startIndex + i + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h2
                          className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${v.color}`}
                        >
                          {v.version}
                        </h2>
                        <span className="px-4 py-1.5 bg-white shadow-sm border border-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          {v.date}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {v.title}
                      </h3>
                      <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                        {v.description}
                      </p>
                    </div>
                  </div>

                  {/* Updates Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {v.updates.map((update, idx) => (
                      <div
                        key={idx}
                        className="relative p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        <div
                          className={`absolute top-0 right-0 w-24 h-24 ${update.bg} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}
                        />

                        <div className="flex items-start gap-4 relative z-10">
                          <div
                            className={`p-3 ${update.bg} rounded-2xl shadow-md text-white shrink-0`}
                          >
                            {update.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg mb-1">
                              {update.title}
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                              {update.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Sistema de Paginación */}
          <PaginationSystem
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={versions.length}
            itemsPerPage={itemsPerPage}
          />

          {/* Feedback Section */}
          <section
            id="feedback"
            className="scroll-mt-32 relative overflow-hidden p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-full shadow-inner">
                <Heart
                  className="text-pink-500 fill-pink-500 animate-pulse"
                  size={48}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold mb-3">
                  Tu opinión construye PawLig
                </h2>
                <p className="text-slate-300 leading-relaxed text-lg mb-6">
                  ¿Encontraste un error o tienes una idea genial? Somos todo
                  oídos. Ayúdanos a crear la mejor plataforma para el cuidado
                  animal.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <Link
                    href="https://github.com/asebasg/pawlig/issues/new/choose"
                    className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg flex items-center gap-2"
                  >
                    <Bug size={18} />
                    Reportar Error
                  </Link>
                  <Link
                    href="https://github.com/asebasg/pawlig/discussions"
                    className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10 flex items-center gap-2"
                  >
                    <Sparkles size={18} />
                    Sugerir Idea
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
