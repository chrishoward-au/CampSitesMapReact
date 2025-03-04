import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    console.log('Map',map);
    console.log('Map Container',mapContainerRef.current);
    if (mapContainerRef.current && !map) {
      // Initialize Mapbox access token
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;
      
      // Default coordinates
      const initialCoords: [number, number] = [-119.99959421984575, 38.619551620333496]; 
      
      // Create the map instance
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: initialCoords,
        zoom: 12,
      });
      
      // Add navigation controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Set map state once it's loaded
      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        setMap(mapInstance);
      });
      
      // Clean up on unmount
      return () => {
        mapInstance.remove();
      };
    }
  }, [map]);

  return <div ref={mapContainerRef} className="map-container" />;
};

