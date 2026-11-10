/**
 * Utilitários de Geolocalização e Cálculo de Raio (PostGIS / Haversine)
 * Compatível com consultas geográficas de proximidade (ST_DWithin).
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export const BRAZIL_CITY_COORDINATES: Record<string, Coordinates> = {
  'São Paulo': { lat: -23.55052, lng: -46.633308 },
  'Rio de Janeiro': { lat: -22.906847, lng: -43.172896 },
  'Belo Horizonte': { lat: -19.916681, lng: -43.934493 },
  'Salvador': { lat: -12.977749, lng: -38.50163 },
  'Brasília': { lat: -15.7975, lng: -47.8919 },
  'Curitiba': { lat: -25.4284, lng: -49.2733 },
  'Porto Alegre': { lat: -30.0346, lng: -51.2177 },
  'Recife': { lat: -8.0476, lng: -34.877 },
  'Fortaleza': { lat: -3.7319, lng: -38.5267 },
  'Manaus': { lat: -3.119, lng: -60.0217 },
  'Campinas': { lat: -22.9099, lng: -47.0626 },
  'Santos': { lat: -23.9608, lng: -46.3336 },
  'Goiânia': { lat: -16.6869, lng: -49.2648 }
};

/**
 * Calcula a distância em quilômetros entre dois pontos geográficos usando a fórmula Haversine.
 * Equivalente matemático de precisão ao ST_DistanceSphere / ST_DWithin no PostgreSQL/PostGIS.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Arredonda para 1 casa decimal
  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m`;
  }
  return `${km.toFixed(1).replace('.', ',')} km`;
}

function stripAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Resolve coordenadas aproximadas para cidades brasileiras ou CEP
 */
export function resolveLocationQuery(query: string): Coordinates | null {
  const normalized = stripAccents(query.trim());
  if (!normalized) return null;
  
  for (const [cityName, coords] of Object.entries(BRAZIL_CITY_COORDINATES)) {
    const normalizedCity = stripAccents(cityName);
    if (normalizedCity.includes(normalized) || normalized.includes(normalizedCity)) {
      return coords;
    }
  }

  // Fallback para CEP ou padrão São Paulo se consulta contiver dígitos de CEP
  if (/\d{5}-?\d{3}/.test(query)) {
    if (query.startsWith('0')) return BRAZIL_CITY_COORDINATES['São Paulo'];
    if (query.startsWith('2')) return BRAZIL_CITY_COORDINATES['Rio de Janeiro'];
    if (query.startsWith('3')) return BRAZIL_CITY_COORDINATES['Belo Horizonte'];
    if (query.startsWith('4')) return BRAZIL_CITY_COORDINATES['Salvador'];
    if (query.startsWith('7')) return BRAZIL_CITY_COORDINATES['Brasília'];
    if (query.startsWith('8')) return BRAZIL_CITY_COORDINATES['Curitiba'];
    if (query.startsWith('9')) return BRAZIL_CITY_COORDINATES['Porto Alegre'];
    return BRAZIL_CITY_COORDINATES['São Paulo'];
  }

  return null;
}
