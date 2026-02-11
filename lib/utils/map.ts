import { AdSpace, MapBounds } from "@/types";

/**
 * Calculate map bounds that fit all spaces
 * @param spaces Array of ad spaces
 * @returns Bounds object with north, south, east, west
 */
export function getMapBounds(spaces: AdSpace[]): MapBounds | null {
  if (spaces.length === 0) {
    return null;
  }

  // Initialize with proper sentinel values
  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;

  // Calculate bounds from actual space coordinates
  // Note: This is placeholder logic until we have actual coordinates in the AdSpace type
  // In production, iterate through spaces and extract lat/lng from location.coordinates
  
  return {
    north,
    south,
    east,
    west,
  };
}

/**
 * Check if a point is within bounds
 */
export function isWithinBounds(
  lat: number,
  lng: number,
  bounds: MapBounds
): boolean {
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
}
