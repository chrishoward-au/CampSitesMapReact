import mapboxgl from 'mapbox-gl';

export const initMap = (container: HTMLDivElement, coords: [number, number]) => {
  return new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: coords,
    zoom: 10,
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string,
  });
};