import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import "mapbox-gl-style-switcher/styles.css";
import { useMap } from 'react-map-gl/mapbox';
import { useEffect } from 'react';
import type { ControlPosition } from 'react-map-gl/mapbox';
import { MAP_STYLES, DEFAULT_STYLE } from '../constants';

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
        // Format the styles for the style switcher
        const styles = [
          { title: "Outdoors", uri: MAP_STYLES.outdoors },
          { title: "Satellite", uri: MAP_STYLES.satellite },
          { title: "Streets", uri: MAP_STYLES.streets }
        ];
        
        const styleSwitcher = new MapboxStyleSwitcherControl(styles, DEFAULT_STYLE);
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