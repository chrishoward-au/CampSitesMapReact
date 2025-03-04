import mapboxgl from 'mapbox-gl';

export const initMap = (container: HTMLDivElement, coords: [number, number], zoom?: number) => {
  return new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: coords,
    zoom: zoom || 12,
    accessToken: import.meta.env.PUBLIC_MAPBOX_ACCESS_TOKEN as string,
  });
};