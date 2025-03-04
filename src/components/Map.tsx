import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { initMap } from '../utils/initMap';

export const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !map) {
      // Default coordinates (can be changed to your preferred location)
      const initialCoords: [number, number] = [-122.4194, 37.7749]; // San Francisco
      
      const mapInstance = initMap(mapContainerRef.current, initialCoords);
      setMap(mapInstance);
      
      // Clean up on unmount
      return () => {
        mapInstance.remove();
      };
    }
  }, [map]);

  return <div ref={mapContainerRef} className="map-container" />;
};