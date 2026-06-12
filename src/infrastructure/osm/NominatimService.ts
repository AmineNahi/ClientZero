export interface SearchResultLead {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export class NominatimService {
  /**
   * Search for businesses using OpenStreetMap's Nominatim API.
   * This is a 100% free API, but requires a custom User-Agent.
   */
  async searchPlaces(query: string, location: string): Promise<SearchResultLead[]> {
    if (!query || !location) return [];

    try {
      // 1. Get Bounding Box from Nominatim for the location
      const nomUrl = new URL('https://nominatim.openstreetmap.org/search');
      nomUrl.searchParams.append('q', location);
      nomUrl.searchParams.append('format', 'json');
      nomUrl.searchParams.append('limit', '1');

      const nomRes = await fetch(nomUrl.toString(), {
        headers: { 'User-Agent': 'ClientZero-SaaS-MVP/1.0' },
        next: { revalidate: 86400 } // Cache the bounding box for 24 hours
      });
      if (!nomRes.ok) throw new Error('Nominatim geocoding failed');
      const nomData = await nomRes.json();
      
      if (!nomData || nomData.length === 0) {
        return []; // Location not found
      }

      // Nominatim bbox is [south, north, west, east]
      const [south, north, west, east] = nomData[0].boundingbox;

      // 2. Map keywords to OSM tags for better results
      const keywordMap: Record<string, string> = {
        'restaurant': '"amenity"="restaurant"',
        'boulangerie': '"shop"="bakery"',
        'café': '"amenity"="cafe"',
        'cafe': '"amenity"="cafe"',
        'bar': '"amenity"="bar"',
        'pharmacie': '"amenity"="pharmacy"',
        'supermarché': '"shop"="supermarket"',
        'coiffeur': '"shop"="hairdresser"',
        'banque': '"amenity"="bank"',
        'hôtel': '"tourism"="hotel"',
        'hotel': '"tourism"="hotel"',
        'plombier': '"craft"="plumber"',
        'électricien': '"craft"="electrician"',
        'garage': '"shop"="car_repair"',
        'dentiste': '"healthcare"="dentist"',
        'médecin': '"healthcare"="doctor"',
        'docteur': '"healthcare"="doctor"',
        'avocat': '"office"="lawyer"',
        'agence': '"office"="company"',
      };

      const normalizedQuery = query.toLowerCase().trim();
      const typeFilter = keywordMap[normalizedQuery] ? `[${keywordMap[normalizedQuery]}]` : `["name"~"${query}",i]`;

      // 3. Query Overpass API
      // We request 300 places and filter in JavaScript for contact info, which is MUCH faster than unioning 6 times in Overpass.
      const overpassQuery = `
        [out:json][timeout:25][bbox:${south},${west},${north},${east}];
        (
          node${typeFilter};
          way${typeFilter};
        );
        out center 300;
      `;

      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const overpassRes = await fetch(overpassUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ClientZero-SaaS-MVP/1.0',
          'Accept': 'application/json'
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!overpassRes.ok) throw new Error('Overpass API failed');
      const overpassData = await overpassRes.json();

      if (!overpassData.elements) return [];

      return overpassData.elements.map((item: any) => {
        const tags = item.tags || {};
        return {
          id: item.id.toString(),
          name: tags.name || query,
          website: tags.website || tags['contact:website'] || tags.url || null,
          phone: tags.phone || tags['contact:phone'] || null,
          email: tags.email || tags['contact:email'] || null,
          address: `${tags['addr:street'] ? tags['addr:housenumber'] + ' ' + tags['addr:street'] + ', ' : ''}${tags['addr:city'] || location}`,
        };
      }).filter((lead: any) => lead.website || lead.phone || lead.email);

    } catch (error) {
      console.error("Error fetching data from OSM:", error);
      return [];
    }
  }
}
