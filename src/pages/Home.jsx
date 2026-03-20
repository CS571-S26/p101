import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [editText, setEditText] = useState('');

  const openModal = (trip) => {
    setSelectedTrip(trip);
    setEditingDay(null);
  };

  const closeModal = () => {
    setSelectedTrip(null);
    setEditingDay(null);
  };

  const handleDelete = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter((t) => t.id !== tripId));
      closeModal();
    }
  };

  const startEdit = (dayIndex, details) => {
    setEditingDay(dayIndex);
    setEditText(details);
  };

  const saveEdit = () => {
    const updated = { ...selectedTrip };
    updated.itinerary = updated.itinerary.map((item, i) =>
      i === editingDay ? { ...item, details: editText } : item
    );
    setSelectedTrip(updated);
    setTrips(trips.map((t) => (t.id === updated.id ? updated : t)));
    setEditingDay(null);
  };

  const activeTrips = trips.filter((t) => t.status === 'Active');
  const inPlanningTrips = trips.filter((t) => t.status === 'In-Planning');
  const plannedTrips = trips.filter((t) => t.status === 'Planned');

  const getBadgeClass = (status) => {
    if (status === 'Active') return 'badge-active';
    if (status === 'In-Planning') return 'badge-inplanning';
    return 'badge-planned';
  };

  const renderTripCard = (trip) => (
    <div key={trip.id} className="trip-card" onClick={() => openModal(trip)}>
      <div
        className="trip-card-image"
        style={{ backgroundImage: `url(${trip.image})` }}
      >
        <span className={`trip-badge ${getBadgeClass(trip.status)}`}>
          {trip.status}
        </span>
      </div>
      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.title}</h3>
        <p className="trip-card-dates">{trip.dates}</p>
        <div className="trip-card-footer">
          <span className="trip-members">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            {trip.members} members
          </span>
          <button className="trip-view-btn">View</button>
        </div>
      </div>
    </div>
  );

  const renderEmptySection = (message) => (
    <div className="empty-section">
      <p className="empty-section-text">{message}</p>
      <button className="empty-section-btn" onClick={() => navigate('/trips')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Plan a Trip
      </button>
    </div>
  );

  return (
    <div className="home-page">
      <Sidebar />

      {/* Main Content */}
      <main className="home-main">
        <header className="home-header">
          <div className="header-top">
            <div>
              <h2>Welcome back!</h2>
              <p className="home-subtitle">Here's an overview of your travel plans</p>
            </div>
            <button className="header-new-trip-btn" onClick={() => navigate('/trips')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Trip
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon stat-icon-active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div>
                <span className="stat-number">{activeTrips.length}</span>
                <span className="stat-label">Active</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-planning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </div>
              <div>
                <span className="stat-number">{inPlanningTrips.length}</span>
                <span className="stat-label">In-Planning</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-planned">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <span className="stat-number">{plannedTrips.length}</span>
                <span className="stat-label">Planned</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-members">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <span className="stat-number">{trips.reduce((sum, t) => sum + t.members, 0)}</span>
                <span className="stat-label">Travelers</span>
              </div>
            </div>
          </div>
        </header>

        {/* Active Trips */}
        <section className="trip-section">
          <h3 className="section-title">
            <span className="section-dot dot-active" />
            Active Trips
          </h3>
          {activeTrips.length > 0
            ? <div className="trips-grid">{activeTrips.map(renderTripCard)}</div>
            : renderEmptySection('You don\'t have any active trips right now. Time to start an adventure!')
          }
        </section>

        {/* In-Planning Trips */}
        <section className="trip-section">
          <h3 className="section-title">
            <span className="section-dot dot-inplanning" />
            In-Planning
          </h3>
          {inPlanningTrips.length > 0
            ? <div className="trips-grid">{inPlanningTrips.map(renderTripCard)}</div>
            : renderEmptySection('No trips in progress. Start planning your next getaway!')
          }
        </section>

        {/* Planned Trips */}
        <section className="trip-section">
          <h3 className="section-title">
            <span className="section-dot dot-planned" />
            Planned Trips
          </h3>
          {plannedTrips.length > 0
            ? <div className="trips-grid">{plannedTrips.map(renderTripCard)}</div>
            : renderEmptySection('No upcoming trips planned yet. You should plan one!')
          }
        </section>
      </main>

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-hero"
              style={{ backgroundImage: `url(${selectedTrip.image})` }}
            >
              <div className="modal-hero-overlay">
                <button className="modal-close" onClick={closeModal}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div className="modal-hero-info">
                  <span className={`trip-badge ${getBadgeClass(selectedTrip.status)}`}>
                    {selectedTrip.status}
                  </span>
                  <h2 className="modal-title">{selectedTrip.title}</h2>
                  <p className="modal-dates">{selectedTrip.dates} &middot; {selectedTrip.members} members</p>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="itinerary-header">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  AI-Generated Itinerary
                </h3>
                <span className="itinerary-hint">Click any day to edit</span>
              </div>

              <div className="itinerary-timeline">
                {selectedTrip.itinerary.map((item, index) => (
                  <div key={index} className="itinerary-item">
                    <div className="itinerary-marker">
                      <span className="itinerary-dot" />
                      {index < selectedTrip.itinerary.length - 1 && <span className="itinerary-line" />}
                    </div>
                    <div className="itinerary-card">
                      <div className="itinerary-day">{item.day}</div>
                      <h4 className="itinerary-title">{item.title}</h4>
                      {editingDay === index ? (
                        <div className="itinerary-edit">
                          <textarea
                            className="itinerary-textarea"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                          />
                          <div className="itinerary-edit-actions">
                            <button className="edit-save-btn" onClick={saveEdit}>Save</button>
                            <button className="edit-cancel-btn" onClick={() => setEditingDay(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p
                          className="itinerary-details"
                          onClick={() => startEdit(index, item.details)}
                        >
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-delete-btn" onClick={() => handleDelete(selectedTrip.id)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete Trip
              </button>
              <button className="modal-done-btn" onClick={closeModal}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;