"use client";

import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const VIA_TYPES = ["Calle", "Carrera", "Avenida", "Avenida Carrera", "Avenida Calle", "Circular", "Circunvalar", "Diagonal", "Transversal", "Vía"];
const LETRAS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const ORIENTACIONES = ["Sur", "Norte", "Este", "Oeste"];

interface AddressInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function AddressInput({ value, onChange, disabled, error }: AddressInputProps) {
  const [tipoVia, setTipoVia] = useState("Calle");
  const [numeroVia, setNumeroVia] = useState("");
  const [letraVia, setLetraVia] = useState("none");
  const [orientacionVia, setOrientacionVia] = useState("none");
  const [numeroGeneradora, setNumeroGeneradora] = useState("");
  const [letraGeneradora, setLetraGeneradora] = useState("none");
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [complemento, setComplemento] = useState("");

  const [isInternalUpdate, setIsInternalUpdate] = useState(false);

  // Sincronizar de afuera hacia adentro (Autocompletado / Reset)
  useEffect(() => {
    if (!value || isInternalUpdate) {
      setIsInternalUpdate(false);
      return;
    }

    // Regex para desglosar la nomenclatura estándar de PawLig
    // Grupo 1: Tipo, 2: NumVia, 3: LetraVia, 4: Orientacion, 5: NumGen, 6: LetraGen, 7: Placa, 8: Complemento
    const regex = /^(.+?)\s+(\d+)([A-Z])?\s*(Sur|Norte|Este|Oeste)?\s*#(\d+)([A-Z])?-(\d+)(?:,\s*(.*))?$/i;
    const match = value.match(regex);

    if (match) {
      const [, tVia, nVia, lVia, orient, nGen, lGen, nPlaca, comp] = match;
      
      if (VIA_TYPES.includes(tVia)) setTipoVia(tVia);
      setNumeroVia(nVia || "");
      setLetraVia(lVia || "none");
      setOrientacionVia(orient || "none");
      setNumeroGeneradora(nGen || "");
      setLetraGeneradora(lGen || "none");
      setNumeroPlaca(nPlaca || "");
      setComplemento(comp || "");
    }
  }, [value, isInternalUpdate]);

  // Sincronizar de adentro hacia afuera
  useEffect(() => {
    const parsedLetraVia = letraVia === 'none' ? '' : letraVia;
    const parsedOrientacion = orientacionVia === 'none' ? '' : orientacionVia;
    const parsedLetraGen = letraGeneradora === 'none' ? '' : letraGeneradora;

    let addressParts = [
      tipoVia,
      numeroVia + parsedLetraVia,
      parsedOrientacion,
      numeroGeneradora || numeroPlaca ? "#" : "",
      numeroGeneradora + parsedLetraGen,
      numeroPlaca ? "-" : "",
      numeroPlaca
    ].filter(Boolean).join(" ");

    // Clean up spacing around # and -
    addressParts = addressParts.replace(" # ", " #").replace(" - ", "-").replace(" -", "-").replace("- ", "-");

    if (complemento) {
      addressParts += `, ${complemento}`;
    }

    const finalAddress = addressParts.trim();
    
    if (finalAddress !== value) {
      setIsInternalUpdate(true);
      onChange(finalAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoVia, numeroVia, letraVia, orientacionVia, numeroGeneradora, letraGeneradora, numeroPlaca, complemento, value, onChange]);

  return (
    <div className={`space-y-3 p-4 border rounded-xl bg-gray-50/50 ${error ? "border-red-500" : "border-gray-200"}`}>
      {/* 1st Row: Via Principal */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select disabled={disabled} value={tipoVia} onValueChange={setTipoVia}>
          <SelectTrigger className="w-[140px] bg-white text-black"><SelectValue /></SelectTrigger>
          <SelectContent>
            {VIA_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input disabled={disabled} className="w-[80px] bg-white text-black text-center" placeholder="Ej: 10" value={numeroVia} onChange={e => setNumeroVia(e.target.value)} />
        <Select disabled={disabled} value={letraVia} onValueChange={setLetraVia}>
          <SelectTrigger className="w-[80px] bg-white text-black"><SelectValue placeholder="Letra" /></SelectTrigger>
          <SelectContent>
             <SelectItem value="none">---</SelectItem>
             {LETRAS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select disabled={disabled} value={orientacionVia} onValueChange={setOrientacionVia}>
          <SelectTrigger className="w-[110px] bg-white text-black"><SelectValue placeholder="Orientación" /></SelectTrigger>
          <SelectContent>
             <SelectItem value="none">---</SelectItem>
             {ORIENTACIONES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* 2nd Row: Cruce y Placa */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-bold text-gray-500 w-8 text-center text-lg">#</span>
        <Input disabled={disabled} className="w-[80px] bg-white text-black text-center" placeholder="Ej: 43" value={numeroGeneradora} onChange={e => setNumeroGeneradora(e.target.value)} />
        <Select disabled={disabled} value={letraGeneradora} onValueChange={setLetraGeneradora}>
          <SelectTrigger className="w-[80px] bg-white text-black"><SelectValue placeholder="Letra" /></SelectTrigger>
          <SelectContent>
             <SelectItem value="none">---</SelectItem>
             {LETRAS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="font-bold text-gray-500 w-8 text-center text-lg">-</span>
        <Input disabled={disabled} className="w-[80px] bg-white text-black text-center" placeholder="Ej: 12" value={numeroPlaca} onChange={e => setNumeroPlaca(e.target.value)} />
      </div>

      {/* 3rd Row: Complemento */}
      <div className="pt-2">
        <Input disabled={disabled} className="w-full bg-white text-black text-sm" placeholder="Complemento (Ej: Apto 405, Torre 2, etc.) Opcional" value={complemento} onChange={e => setComplemento(e.target.value)} />
      </div>
    </div>
  );
}
