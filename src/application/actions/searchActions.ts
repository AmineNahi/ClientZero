"use server";

import { NominatimService, SearchResultLead } from '../../infrastructure/osm/NominatimService';

export async function searchLeadsAction(query: string, location: string): Promise<SearchResultLead[]> {
  try {
    const service = new NominatimService();
    const results = await service.searchPlaces(query, location);
    return results;
  } catch (error) {
    console.error("Error in searchLeadsAction:", error);
    return [];
  }
}
