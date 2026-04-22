import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Users, PlusCircle, ArrowLeft } from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import NewTripModal from '../components/NewTripModal';
import { useState } from 'react';
import { sampleTrips } from '../data/trips';
import './Home.css';
import './NewTrip.css';

function TripOverview() {
  const navigate = useNavigate();
  const [newTripOpen, setNewTripOpen] = useState(false);

  const handleTripClick = (trip) => {
    navigate('/trips/details', {
      state: {
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        numPeople: trip.travelers,
        members: trip.members,
        image: trip.image,
        planTier: trip.planTier,
      },
    });
  };

  return (
    <div className="home-v2">
      <TopNavbar />

      <Container className="py-4" style={{ maxWidth: 1200 }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="tripdetails-back" onClick={() => navigate('/home')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="newtrip-title" style={{ marginBottom: 0 }}>Your Trips</h2>
            <p className="newtrip-subtitle" style={{ marginBottom: 0 }}>Trips currently being planned</p>
          </div>
        </div>

        <Row className="g-4">
          {sampleTrips.map((trip) => (
            <Col sm={6} lg={4} key={trip.id}>
              <div className="trip-card" onClick={() => handleTripClick(trip)} style={{ cursor: 'pointer' }}>
                <div
                  className="trip-card-image"
                  style={{ backgroundImage: `url(${trip.image})` }}
                >
                  <span className={`trip-badge ${trip.status === 'Active' ? 'badge-active' : 'badge-inplanning'}`}>
                    {trip.status}
                  </span>
                </div>
                <div className="trip-card-body">
                  <h3 className="trip-card-title">{trip.title}</h3>
                  <p className="trip-card-dates">{trip.dates}</p>
                  <div className="trip-card-footer">
                    <span className="trip-members">
                      <Users size={16} />
                      {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
                    </span>
                    <button className="trip-view-btn">View</button>
                  </div>
                </div>
              </div>
            </Col>
          ))}

          <Col sm={6} lg={4}>
            <div className="trip-card add-trip-card" onClick={() => setNewTripOpen(true)} style={{ cursor: 'pointer' }}>
              <div className="add-trip-content">
                <div className="add-trip-icon">
                  <PlusCircle size={40} strokeWidth={1.5} />
                </div>
                <h3 className="add-trip-label">Plan a New Trip</h3>
                <p className="add-trip-hint">Start planning your next adventure</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <NewTripModal
        isOpen={newTripOpen}
        onClose={() => setNewTripOpen(false)}
      />
    </div>
  );
}

export default TripOverview;
