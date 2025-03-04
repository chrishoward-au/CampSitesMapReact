import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Map } from './components/Map';
import { usePreline } from './utils/preline';

function App() {
  usePreline();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Camp Sites Map</h1>
        </div>
      </header>
      <main>
        <Map />
      </main>
    </div>
  );
}

export default App;