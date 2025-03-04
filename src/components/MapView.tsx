
import Map, { useMap, Marker, Popup, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl } from 'react-map-gl/mapbox';
import type { MapMouseEvent } from 'mapbox-gl';
import * as React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from '../contexts/MapContext';
import type { MapPoint, MapViewState } from '../types';
import type { MapRef } from 'react-map-gl/mapbox';
import { AddMapPointForm } from './AddMapPointForm';
import { MAP_STYLES, DEFAULT_STYLE, CONTROL_POSITIONS, MAP_CONFIG, POINT_TYPE_COLORS } from '../constants';
import { MapboxStyleSwitcherControl } from "mapbox-gl-style-switcher";
import { LayerSwitcher } from './LayerSwitcher';
import "mapbox-gl-style-switcher/styles.css";
import { mapPointsService } from '../services/mapPointsService';
import { Button, Modal } from 'antd';

export const MapView = () => {
  const {
    mapPoints,
    loading,
    viewState,
    setViewState,
    selectedPoint,
    setSelectedPoint
  } = useMapContext();
  
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<MapPoint | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>(DEFAULT_STYLE);
  const popoverButtonRef = useRef<HTMLButtonElement>(null);

  // When selectedPoint changes, update the map view to center on it
  React.useEffect(() => {
    if (selectedPoint) {
      setViewState({
        longitude: selectedPoint.longitude,
        latitude: selectedPoint.latitude,
        zoom: 12
      });
      setPopupInfo(selectedPoint);
    }
  }, [selectedPoint, setViewState]);
  
  // Handle map click events
  const handleMapClick = (event: MapMouseEvent) => {
    // Only trigger on cmd/ctrl + click
    if (event.originalEvent.metaKey || event.originalEvent.ctrlKey) {
      setClickedLocation({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng
      });
      
      // Trigger the popover
//      if (popoverButtonRef.current) {
//        popoverButtonRef.current.click();
        <Modal title="Add New Map Point">blah blah</Modal>
//      }
    }
  };
  
  // Fly to a location with animation
  const flyToLocation = useCallback((latitude: number, longitude: number, zoom = 14) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom,
        duration: 2000,
        essential: true
      });
    }
  }, []);
  
  
  return (
    <div id="map-container">
      {loading ? (
        <div className="loading-overlay">
          <div className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
      

            
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={currentMapStyle}
        reuseMaps
        {...MAP_CONFIG}
      >
        {/* Map Controls */}
        <NavigationControl position={CONTROL_POSITIONS.topRight} showCompass={false} showZoom={true} visualizePitch={true} />
        <GeolocateControl position={CONTROL_POSITIONS.topRight} positionOptions={{enableHighAccuracy: true}} trackUserLocation={true} />
        <ScaleControl position={CONTROL_POSITIONS.bottomRight} unit="metric" />
        <LayerSwitcher position={CONTROL_POSITIONS.topRight} />


        {mapPoints.map(point => (
          <Marker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
            color={point.type === 'Campsite' ? POINT_TYPE_COLORS.Campsite : point.type === 'Hiking Trail' ? POINT_TYPE_COLORS.HikingTrail : POINT_TYPE_COLORS.Default}
            scale={selectedPoint?.id === point.id ? 1.2 : 0.8}
            pitchAlignment="map"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(point);
              // Fly to the clicked point with animation
              flyToLocation(point.latitude, point.longitude, 15);
            }}
          />
        ))}
        
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="map-popup"
            maxWidth="300px"
            offset={15}
          >
            <div className="popup-content p-2">
              <h3 className="text-lg font-bold mb-2">{popupInfo.name}</h3>
              {popupInfo.description && <p className="text-sm mb-2">{popupInfo.description}</p>}
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {popupInfo.type}
                </span>
                {popupInfo.amenities && popupInfo.amenities.map((amenity, index) => (
                  <span key={index} className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {amenity}
                  </span>
                ))}
              </div>
              <Button type="primary" >Start route</Button><Button type="primary" >End route</Button>
            </div>
          </Popup>
        )}
        
      </Map>
    </div>
  );
};

