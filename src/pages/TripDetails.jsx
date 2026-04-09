import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, DollarSign, MapPin, Settings,
  UserPlus, Pencil, ChevronLeft,
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import AvatarGroup from '../components/AvatarGroup';
import ItineraryCalendar from '../components/ItineraryCalendar';
import TripMap from '../components/TripMap';
import './Home.css';
import './NewTrip.css';

const defaultImage = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80';

const sidebarNav = [
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'map', label: 'Map', icon: MapPin },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function formatDateRange(start, end) {
  if (!start) return '';
  const fmt = (d) => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const s = new Date(start + 'T00:00:00');
  const e = end ? new Date(end + 'T00:00:00') : null;
  const nights = e ? Math.round((e - s) / 86400000) : 0;
  const range = end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
  return nights > 0 ? `${range} (${nights} nights)` : range;
}

function TripDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const tripData = location.state || {};
  const [activeNav, setActiveNav] = useState('calendar');

  const tripTitle = tripData.title || 'Delhi Trip';
  const destination = tripData.destination || 'Delhi, India';
  const tripImage = tripData.image || defaultImage;
  const members = tripData.members || [
    { name: 'Shashwat', color: '#f97316' },
    { name: 'Sarah', color: '#22c55e' },
    { name: 'Zara', color: '#3b82f6' },
  ];
  const guestCount = tripData.numPeople || members.length;
  const dateRange = formatDateRange(tripData.startDate, tripData.endDate);

  return (
    <div className="home-v2">
      <TopNavbar />

      <div className="tripdetails-page">
        <aside className="td-sidebar">
          <div className="td-sidebar-card">
            <div className="td-sidebar-image" style={{ backgroundImage: `url(${tripImage})` }}>
              <button className="td-sidebar-edit-btn"><Pencil size={14} /></button>
            </div>

            <div className="td-sidebar-info">
              <h3 className="td-sidebar-title">{tripTitle}</h3>
              {dateRange && (
                <p className="td-sidebar-meta">
                  <Calendar size={14} />
                  {dateRange}
                </p>
              )}
              <p className="td-sidebar-meta">
                <MapPin size={14} />
                {destination}
              </p>

              <div className="td-sidebar-members">
                <AvatarGroup members={members} max={4} size={32} />
                <span className="td-sidebar-guest-count">{guestCount} guests</span>
              </div>

              <button className="td-sidebar-invite">
                <UserPlus size={16} />
                Invite Guests
              </button>
            </div>
          </div>

          <nav className="td-sidebar-nav">
            {sidebarNav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`td-sidebar-nav-item ${activeNav === id ? 'active' : ''}`}
                onClick={() => setActiveNav(id)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="td-main">
          <button className="tripdetails-back" onClick={() => navigate('/home')}>
            <ChevronLeft size={18} />
            Back to Home
          </button>

          {activeNav === 'calendar' && (
            <ItineraryCalendar tripTitle={tripTitle} destination={destination} />
          )}
          {activeNav === 'budget' && (
            <div className="td-placeholder">
              <DollarSign size={40} />
              <h3>Budget</h3>
              <p>Track and manage your trip expenses</p>
            </div>
          )}
          {activeNav === 'map' && (
            <TripMap destination={destination} />
          )}
          {activeNav === 'settings' && (
            <div className="td-placeholder">
              <Settings size={40} />
              <h3>Trip Settings</h3>
              <p>Manage trip preferences and sharing options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripDetails;
