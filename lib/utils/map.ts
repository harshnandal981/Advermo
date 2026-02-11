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

  // For now, we'll use mock data since spaces don't have coordinates yet
  // This will be updated when we integrate with the database
  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  // Calculate bounds
  // Note: This is placeholder logic until we have actual coordinates
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
