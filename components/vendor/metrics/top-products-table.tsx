"use client";

import { TopProductData } from "@/types/report.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TopProductsTableProps {
  products: TopProductData[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-lg">No hay ventas registradas en el período actual.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">Unidades</TableHead>
            <TableHead className="text-right">Ingresos Generados</TableHead>
            <TableHead className="text-right">Negocio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, idx) => (
            <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="text-center font-bold text-gray-400">{idx + 1}</TableCell>
              <TableCell className="font-medium text-primary">{product.name}</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {product.unitsSold}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold text-green-700">
                {formatCurrency(product.revenue)}
              </TableCell>
              <TableCell className="text-right">
                {product.vendorName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Tabla de resultados para visualizar el Top 10 de productos. 
 */
