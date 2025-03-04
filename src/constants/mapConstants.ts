/**
 * Map style constants for Mapbox
 */
export const MAP_STYLES = {
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  streets: 'mapbox://styles/mapbox/streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11'
};

export const DEFAULT_STYLE = MAP_STYLES.outdoors;

/**
 * Map control positions
 */
export const CONTROL_POSITIONS = {
  topRight: 'top-right',
  topLeft: 'top-left',
  bottomRight: 'bottom-right',
  bottomLeft: 'bottom-left'
};

/**
 * Map configuration
 */
export const MAP_CONFIG = {
  maxZoom: 18,
  minZoom: 3,
  maxPitch: 85,
  projection: { name: 'mercator' as const }
};

/**
 * Map point type colors
 */
export const POINT_TYPE_COLORS = {
  Campsite: '#FF5733',
  HikingTrail: '#33FF57',
  Default: '#3357FF'
};
