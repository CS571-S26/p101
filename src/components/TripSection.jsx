import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Plus } from 'lucide-react';
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
        <Row className="g-3">
          {trips.map((trip) => (
            <Col sm={6} lg={4} key={trip.id}>
              <TripCard trip={trip} onClick={() => onTripClick(trip)} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="empty-section">
          <p className="empty-section-text">{emptyMessage}</p>
          <button className="empty-section-btn" onClick={() => navigate('/trips')}>
            <Plus size={16} />
            Plan a Trip
          </button>
        </div>
      )}
    </section>
  );
}

export default TripSection;