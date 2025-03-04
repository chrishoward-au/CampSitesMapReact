import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from '../contexts/MapContext';
import type { MapPoint } from '../types';
import { AddMapPointForm } from './AddMapPointForm';

const DEFAULT_STYLE = 'mapbox://styles/mapbox/outdoors-v12';

export const MapView = () => {
  const {
    mapPoints,
    loading,
    viewState,
    setViewState,
    selectedPoint,
    setSelectedPoint
  } = useMapContext();
  
  const [popupInfo, setPopupInfo] = React.useState<MapPoint | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

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

  return (
    <div id="map-container">
      {loading ? (
        <div className="loading-overlay">
          <span>Loading map data...</span>
        </div>
      ) : null}
      
      {/* Add Point Button */}
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Add Point
        </button>
      </div>
      
      {/* Add Point Form Modal */}
      {showAddForm && (
        <AddMapPointForm onClose={() => setShowAddForm(false)} />
      )}
      
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={DEFAULT_STYLE}
        reuseMaps
      >
        <NavigationControl position="top-right" />
        
        {mapPoints.map(point => (
          <Marker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
            color="#FF5733"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(point);
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
          >
            <div className="popup-content">
              <h3>{popupInfo.name}</h3>
              {popupInfo.description && <p>{popupInfo.description}</p>}
              <p>Type: {popupInfo.type}</p>
              {popupInfo.rating && <p>Rating: {popupInfo.rating}/5</p>}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

