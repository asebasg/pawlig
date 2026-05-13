/**
 * Descripción: Definiciones de tipos para albergues en el mapa.
 * Implementa: ISSUE-91.
 */

export interface MapShelter {
  id: string;
  name: string;
  municipality: string;
  address: string;
  latitude: number;
  longitude: number;
  contactWhatsApp: string | null;
  contactInstagram: string | null;
  petCount: number;
}
