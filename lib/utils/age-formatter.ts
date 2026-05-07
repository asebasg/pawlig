/**
 * lib/utils/age-formatter.ts
 * Descripción: Utilidad para formatear la edad de las mascotas en años y meses.
 */

/**
 * Formatea la edad de una mascota a una cadena legible en español.
 * 
 * @param years - Número de años
 * @param months - Número de meses (0-11)
 * @returns Cadena formateada (ej. "2 años y 3 meses", "6 meses", "1 año")
 */
export function formatAge(years: number | null | undefined, months: number | null | undefined): string {
  const hasYears = years !== null && years !== undefined && years > 0;
  const hasMonths = months !== null && months !== undefined && months > 0;

  if (!hasYears && !hasMonths) {
    if (years === 0 || months === 0) {
      if (years === 0 && months === 0) return "Recién nacido";
      if (years === 0 && !hasMonths) return "Menos de un año";
      if (months === 0 && (years === null || years === undefined)) return "Menos de un año";
      if (months === 0 && !hasYears) return "Menos de un año";
    }
    return "Edad desconocida";
  }

  const yearsStr = hasYears ? `${years} ${years === 1 ? "año" : "años"}` : "";
  const monthsStr = hasMonths ? `${months} ${months === 1 ? "mes" : "meses"}` : "";

  if (hasYears && hasMonths) {
    return `${yearsStr} y ${monthsStr}`;
  }

  return yearsStr || monthsStr;
}
