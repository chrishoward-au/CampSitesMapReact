import { MapView } from './components/MapView';
import { usePreline } from './utils/preline';
import { MapProvider } from './contexts/MapContext';
import './App.css';

function App() {
  usePreline();
  
  return (
    <MapProvider>
      <div className="h-screen w-screen flex flex-col">
        <header className="bg-white shadow z-10">
          <div className="w-full py-2 px-4">
            <h1 className="text-xl font-bold text-gray-900">Camp Sites Map</h1>
          </div>
        </header>
        <main className="flex-1 relative">
          <MapView />
        </main>
      </div>
    </MapProvider>
  );
}

export default App;