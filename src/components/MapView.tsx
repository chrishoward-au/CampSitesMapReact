
import Map, { Marker, Popup, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl } from 'react-map-gl/mapbox';
import type { MapLayerMouseEvent } from 'react-map-gl';
import * as React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from '../contexts/MapContext';
import type { MapPoint, MapViewState } from '../types';
import type { MapRef } from 'react-map-gl/mapbox';
import { AddMapPointForm } from './AddMapPointForm';

// Map style options
const MAP_STYLES = {
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  streets: 'mapbox://styles/mapbox/streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11'
};

const DEFAULT_STYLE = MAP_STYLES.outdoors;

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
  const handleMapClick = (event: MapLayerMouseEvent) => {
    // Only trigger on cmd/ctrl + click
    if (event.originalEvent.metaKey || event.originalEvent.ctrlKey) {
      setClickedLocation({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng
      });
      
      // Trigger the popover
      if (popoverButtonRef.current) {
        popoverButtonRef.current.click();
      }
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
  
  // Change map style
  const changeMapStyle = useCallback((styleName: keyof typeof MAP_STYLES) => {
    setCurrentMapStyle(MAP_STYLES[styleName]);
  }, []);

  return (
    <div id="map-container">
      {loading ? (
        <div className="loading-overlay">
          <span>Loading map data...</span>
        </div>
      ) : null}
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div className="bg-white rounded shadow p-2">
          <select 
            className="block w-full px-2 py-1 text-sm rounded border border-gray-300"
            value={currentMapStyle}
            onChange={(e) => setCurrentMapStyle(e.target.value)}
          >
            <option value={MAP_STYLES.outdoors}>Outdoors</option>
            <option value={MAP_STYLES.satellite}>Satellite</option>
            <option value={MAP_STYLES.streets}>Streets</option>
            <option value={MAP_STYLES.light}>Light</option>
            <option value={MAP_STYLES.dark}>Dark</option>
          </select>
        </div>
      </div>
      
      {/* Hidden button to trigger Preline popover */}
      <button
        ref={popoverButtonRef}
        type="button"
        className="hidden"
        data-hs-overlay="#add-point-modal"
      >
        Open modal
      </button>
      
      {/* Preline Modal for Add Point Form */}
      <div id="add-point-modal" className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Add New Map Point
              </h3>
              <button type="button" className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800" data-hs-overlay="#add-point-modal">
                <span className="sr-only">Close</span>
                <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {clickedLocation && (
                <AddMapPointForm 
                  onClose={() => {
                    document.querySelector('[data-hs-overlay="#add-point-modal"]')?.dispatchEvent(new Event('click'));
                  }} 
                  initialLocation={clickedLocation}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Map
        ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle={currentMapStyle}
        reuseMaps
        maxZoom={18}
        minZoom={3}
        maxPitch={85}
        projection={{name: 'mercator'}}
      >
        {/* Map Controls */}
        <NavigationControl position="top-right" showCompass={true} showZoom={true} visualizePitch={true} />
        <GeolocateControl position="top-right" positionOptions={{enableHighAccuracy: true}} trackUserLocation={true} />
        <FullscreenControl position="top-right" />
        <ScaleControl position="bottom-left" unit="metric" />
        
        {mapPoints.map(point => (
          <Marker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
            color={point.type === 'Campsite' ? '#FF5733' : point.type === 'Hiking Trail' ? '#33FF57' : '#3357FF'}
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
              {popupInfo.rating && (
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-1">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < popupInfo.rating ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

