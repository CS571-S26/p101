import { useNavigate } from 'react-router-dom';

function StatsHeader({ activeCount, inPlanningCount, plannedCount, travelerCount }) {
  const navigate = useNavigate();

  return (
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
            <span className="stat-number">{activeCount}</span>
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
            <span className="stat-number">{inPlanningCount}</span>
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
            <span className="stat-number">{plannedCount}</span>
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
            <span className="stat-number">{travelerCount}</span>
            <span className="stat-label">Travelers</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StatsHeader;