import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 12, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

function TripMap({ destination }) {
  const [coords, setCoords] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!destination) {
      setError('No destination provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en' },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setPlaceName(data[0].display_name);
        } else {
          setError(`Could not find "${destination}" on the map`);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Failed to load map data');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [destination]);

  if (loading) {
    return (
      <div className="trip-map-wrapper">
        <div className="trip-map-loading">
          <div className="loading-spinner" />
          <p>Loading map for {destination}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-map-wrapper">
        <div className="trip-map-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-map-wrapper">
      <div className="trip-map-header">
        <h3 className="trip-map-title">{destination}</h3>
        {placeName && <p className="trip-map-place">{placeName}</p>}
      </div>
      <div className="trip-map-container">
        <MapContainer
          center={coords}
          zoom={12}
          scrollWheelZoom
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coords}>
            <Popup>{destination}</Popup>
          </Marker>
          <FlyToLocation coords={coords} />
        </MapContainer>
      </div>
    </div>
  );
}

export default TripMap;
