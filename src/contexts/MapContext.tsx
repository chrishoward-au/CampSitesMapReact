import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MapPoint, MapViewState } from '../types';
import { mapPointsService } from '../services/mapPointsService';
import { settingsService } from '../services/settingsService';
import { useAuth } from './AuthContext';

interface MapContextType {
  mapPoints: MapPoint[];
  loading: boolean;
  error: Error | null;
  viewState: MapViewState;
  setViewState: (viewState: MapViewState) => void;
  selectedPoint: MapPoint | null;
  setSelectedPoint: (point: MapPoint | null) => void;
  refreshMapPoints: () => Promise<void>;
  addMapPoint: (point: Omit<MapPoint, 'id' | 'created_at'>) => Promise<MapPoint>;
  updateMapPoint: (id: string, updates: Partial<MapPoint>) => Promise<MapPoint>;
  deleteMapPoint: (id: string) => Promise<void>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

// Default user ID if no authenticated user is present
const DEFAULT_USER_ID = 'de2e543b-0581-491c-9434-7d65c00dfea9';

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, showLoginModal } = useAuth();
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  // State to track if authentication is needed - commented out as it's not currently used
  // const [needsAuthentication, setNeedsAuthentication] = useState<boolean>(false);
  
  // Initialize with default view state
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: 146.8884086608887,
    latitude: -36.114858138524454,
    zoom: 8
  });
  
  const getUserId = () => {
    return user?.id || DEFAULT_USER_ID;
  };
  
  const loadInitialData = async () => {
    try {
      setLoading(true);
      // setNeedsAuthentication(false);
      
      // Load user settings
      try {
        const settings = await settingsService.getUserSettings(getUserId());
        setViewState({
          longitude: settings.default_longitude,
          latitude: settings.default_latitude,
          zoom: settings.default_zoom
        });
      } catch (err: any) {
        console.warn('Could not load user settings, using defaults:', err);
        
        // If we get an authentication error, prompt for login
        if (err?.message?.includes('authentication') || 
            err?.code === '42501' || // RLS policy violation
            err?.code === '401') {
          // setNeedsAuthentication(true);
          showLoginModal();
        }
        // Continue with defaults
      }
      
      // Load map points
      try {
        const points = await mapPointsService.getMapPoints();
        setMapPoints(points);
      } catch (err: any) {
        // If we get an authentication error, prompt for login
        if (err?.message?.includes('authentication') || 
            err?.code === '42501' || // RLS policy violation
            err?.code === '401') {
          // setNeedsAuthentication(true);
          showLoginModal();
        }
        throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error loading map data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Load data when user changes
  useEffect(() => {
    loadInitialData();
  }, [user]);
  
  const refreshMapPoints = async () => {
    try {
      setLoading(true);
      const points = await mapPointsService.getMapPoints();
      setMapPoints(points);
    } catch (err: any) {
      // If we get an authentication error, prompt for login
      if (err?.message?.includes('authentication') || 
          err?.code === '42501' || // RLS policy violation
          err?.code === '401') {
        // setNeedsAuthentication(true);
        showLoginModal();
      }
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error refreshing map points:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const addMapPoint = async (point: Omit<MapPoint, 'id' | 'created_at'>) => {
    const newPoint = await mapPointsService.createMapPoint(point);
    setMapPoints(prev => [newPoint, ...prev]);
    return newPoint;
  };
  
  const updateMapPoint = async (id: string, updates: Partial<MapPoint>) => {
    const updatedPoint = await mapPointsService.updateMapPoint(id, updates);
    setMapPoints(prev => 
      prev.map(point => point.id === id ? updatedPoint : point)
    );
    
    // Update selected point if it's the one being edited
    if (selectedPoint && selectedPoint.id === id) {
      setSelectedPoint(updatedPoint);
    }
    
    return updatedPoint;
  };
  
  const deleteMapPoint = async (id: string) => {
    await mapPointsService.deleteMapPoint(id);
    setMapPoints(prev => prev.filter(point => point.id !== id));
    
    // Clear selected point if it's the one being deleted
    if (selectedPoint && selectedPoint.id === id) {
      setSelectedPoint(null);
    }
  };
  
  return (
    <MapContext.Provider
      value={{
        mapPoints,
        loading,
        error,
        viewState,
        setViewState,
        selectedPoint,
        setSelectedPoint,
        refreshMapPoints,
        addMapPoint,
        updateMapPoint,
        deleteMapPoint
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
