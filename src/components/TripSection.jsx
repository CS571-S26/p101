import { useNavigate } from 'react-router-dom';
import TripCard from './TripCard';

function TripSection({ title, dotClass, trips, emptyMessage, onTripClick }) {
  const navigate = useNavigate();

  return (
    <section className="trip-section">
      <h3 className="section-title">
        <span className={`section-dot ${dotClass}`} />
        {title}
      </h3>
      {trips.length > 0 ? (
        <div className="trips-grid">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onClick={() => onTripClick(trip)} />
          ))}
        </div>
      ) : (
        <div className="empty-section">
          <p className="empty-section-text">{emptyMessage}</p>
          <button className="empty-section-btn" onClick={() => navigate('/trips')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Plan a Trip
          </button>
        </div>
      )}
    </section>
  );
}

export default TripSection;