import { useNavigate } from 'react-router-dom';
import { Plus, Activity, Pencil, Calendar, Users } from 'lucide-react';

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
          <Plus size={18} />
          New Trip
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon stat-icon-active">
            <Activity size={20} />
          </div>
          <div>
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-planning">
            <Pencil size={20} />
          </div>
          <div>
            <span className="stat-number">{inPlanningCount}</span>
            <span className="stat-label">In-Planning</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-planned">
            <Calendar size={20} />
          </div>
          <div>
            <span className="stat-number">{plannedCount}</span>
            <span className="stat-label">Planned</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-members">
            <Users size={20} />
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