import { MapView } from './components/MapView';
import { MapProvider } from './contexts/MapContext';
import './App.css';

function App() {
  
  return (
    <MapProvider>
      <div className="h-screen w-screen flex flex-col">
        <main className="flex-1 relative">
          <MapView />
        </main>
      </div>
    </MapProvider>
  );
}

export default App;