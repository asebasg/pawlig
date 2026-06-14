"use client";

import React, { useState, useRef } from "react";
import { PaginationSystem } from "@/components/ui/pagination-system";

interface Log {
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface DevLog {
  version: string;
  date: string;
  title: string;
  description: string;
  type: string;
  logs: Log[];
}

interface DevNotesClientProps {
  devLogs: DevLog[];
}

export default function DevNotesClient({ devLogs }: DevNotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(devLogs.length / itemsPerPage);

  const listRef = useRef<HTMLDivElement>(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = devLogs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll al inicio de la página
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const categoryStyles: Record<string, string> = {
    feat: "bg-indigo-100 text-indigo-700 border-indigo-200 pointer-events-none",
    fix: "bg-red-100 text-red-700 border-red-200 pointer-events-none",
    refactor: "bg-amber-100 text-amber-700 border-amber-200 pointer-events-none",
    chore: "bg-slate-100 text-slate-700 border-slate-200 pointer-events-none",
    improvement: "bg-emerald-100 text-emerald-700 border-emerald-200 pointer-events-none",
    docs: "bg-blue-100 text-blue-700 border-blue-200 pointer-events-none",
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl" ref={listRef}>
      {/* Timeline */}
      <div className="space-y-12 min-h-[500px]">
        {currentLogs.map((entry) => (
          <section
            key={entry.version}
            className="relative pl-8 border-l border-slate-100 animate-in fade-in slide-in-from-left-4 duration-500"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-slate-300 ring-4 ring-white" />

            <div className="flex flex-col gap-6">
              <header>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono font-bold text-slate-400 tracking-tighter">
                    {entry.version}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">
                    /
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {entry.date}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {entry.title}
                </h2>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-3xl">
                  {entry.description}
                </p>
              </header>

              <div className="grid grid-cols-1 gap-3">
                {entry.logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="mt-1 shrink-0">
                      {log.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyles[log.category] || "bg-slate-100"}`}>
                          {log.category.toUpperCase()}
                        </span>
                        <h4 className="text-sm font-bold text-slate-700">
                          {log.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Paginación */}
      <PaginationSystem
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={devLogs.length}
        itemsPerPage={itemsPerPage}
        className="mt-12"
      />

    </div>
  );
}
