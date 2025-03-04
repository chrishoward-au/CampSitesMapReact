import Map from 'react-map-gl/mapbox';
import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

const DEFAULT_LAT = -36.114858138524454;
const DEFAULT_LNG = 146.8884086608887;
const DEFAULT_STYLE = 'mapbox://styles/mapbox/streets-v12';

export const MapView = () => {
  const [viewState, setViewState] = React.useState({
    longitude: DEFAULT_LNG,
    latitude: DEFAULT_LAT,
    zoom: 8
  });

  return (
    <div id="map-container">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={DEFAULT_STYLE}
      />
    </div>
  );
};

