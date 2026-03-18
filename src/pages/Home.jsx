import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const trips = [
  {
    id: 1,
    title: 'Paris Getaway',
    dates: 'Apr 10 – Apr 17, 2026',
    status: 'Active',
    members: 3,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
  },
];

function Home() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('home');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="home-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-brand">VOYAGO</h1>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${activeMenu === 'home' ? 'active' : ''}`}
            onClick={() => setActiveMenu('home')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </button>

          <button
            className={`sidebar-item ${activeMenu === 'new-trip' ? 'active' : ''}`}
            onClick={() => setActiveMenu('new-trip')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            New Trip
          </button>

          <button
            className={`sidebar-item ${activeMenu === 'active-trips' ? 'active' : ''}`}
            onClick={() => setActiveMenu('active-trips')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Active Trips
          </button>

          <button
            className={`sidebar-item ${activeMenu === 'group' ? 'active' : ''}`}
            onClick={() => setActiveMenu('group')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Group
          </button>
        </nav>

        <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="home-main">
        <header className="home-header">
          <h2>Welcome back!</h2>
          <p className="home-subtitle">Here are your planned trips</p>
        </header>

        <div className="trips-grid">
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card">
              <div
                className="trip-card-image"
                style={{ backgroundImage: `url(${trip.image})` }}
              >
                <span className={`trip-badge ${trip.status === 'Active' ? 'badge-active' : 'badge-planned'}`}>
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
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;