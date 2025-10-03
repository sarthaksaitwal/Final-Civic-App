import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import App from './App.jsx';
import './index.css';
import './i18n'; // Import the i18n configuration

// Fix Leaflet's default icon paths for deployment
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback='Loading...'>
      <App />
    </Suspense>
  </React.StrictMode>,
);
