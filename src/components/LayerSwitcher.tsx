import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import "mapbox-gl-style-switcher/styles.css";
import { useMap } from 'react-map-gl/mapbox';
import { useEffect } from 'react';
import type { ControlPosition } from 'react-map-gl/mapbox';

interface LayerSwitcherProps {
  position?: ControlPosition;
}

export const LayerSwitcher = ({ position = 'bottom-right' as ControlPosition }: LayerSwitcherProps) => {
  const { current: map } = useMap();
  
  useEffect(() => {
    if (map) {
      // Create a unique ID for this control to check if it's already added
      const controlId = 'mapbox-style-switcher';
      
      // Check if the control is already added to avoid duplicates
      const existingControl = map._controls?.find(
        (control: any) => control._container?.id === controlId
      );
      
      if (!existingControl) {
        const styleSwitcher = new MapboxStyleSwitcherControl();
        map.addControl(styleSwitcher, position);
        
        // For cleanup when component unmounts
        return () => {
          if (map && styleSwitcher) {
            try {
              map.removeControl(styleSwitcher);
            } catch (e) {
              console.warn('Error removing style switcher control:', e);
            }
          }
        };
      }
    }
  }, [map, position]); // Only run when map or position changes
  
  return null;
};