import { MapView } from './components/MapView';
import { usePreline } from './utils/preline';
import './App.css';

function App() {
  usePreline();
  
  return (
    <div className="h-screen w-screen flex flex-col">
      <main className="flex-1 relative">
        <MapView />
      </main>
    </div>
  );
}

export default App;