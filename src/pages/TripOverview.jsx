import { useNavigate } from 'react-router-dom';
import { Users, PlusCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Home.css';

const inPlanningTrips = [
  {
    id: 2,
    title: 'Tokyo Adventure',
    dates: 'May 5 – May 15, 2026',
    members: 2,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
  },
  {
    id: 3,
    title: 'Bali Retreat',
    dates: 'Jun 1 – Jun 10, 2026',
    members: 5,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
  },
];

function TripOverview() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Sidebar />

      <main className="home-main">
        <nav className="breadcrumbs">
          <span className="breadcrumb-item" onClick={() => navigate('/home')}>Home</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item breadcrumb-active">Trips</span>
        </nav>

        <h2 className="newtrip-title">Your Trips</h2>
        <p className="newtrip-subtitle">Trips currently being planned</p>

        <div className="trips-grid" style={{ marginTop: '1.5rem' }}>
          {inPlanningTrips.map((trip) => (
            <div key={trip.id} className="trip-card" onClick={() => navigate('/home')}>
              <div
                className="trip-card-image"
                style={{ backgroundImage: `url(${trip.image})` }}
              >
                <span className="trip-badge badge-inplanning">In-Planning</span>
              </div>
              <div className="trip-card-body">
                <h3 className="trip-card-title">{trip.title}</h3>
                <p className="trip-card-dates">{trip.dates}</p>
                <div className="trip-card-footer">
                  <span className="trip-members">
                    <Users size={16} />
                    {trip.members} members
                  </span>
                  <button className="trip-view-btn">View</button>
                </div>
              </div>
            </div>
          ))}

          <div className="trip-card add-trip-card" onClick={() => navigate('/trips/new')}>
            <div className="add-trip-content">
              <div className="add-trip-icon">
                <PlusCircle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="add-trip-label">Plan a New Trip</h3>
              <p className="add-trip-hint">Start planning your next adventure</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TripOverview;