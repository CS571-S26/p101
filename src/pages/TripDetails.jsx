import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Nav } from 'react-bootstrap';
import {
  Calendar, DollarSign, MapPin, Settings,
  UserPlus, Pencil, ChevronLeft, X, Crown, Mail, Users,
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import AvatarGroup from '../components/AvatarGroup';
import ItineraryCalendar from '../components/ItineraryCalendar';
import TripMap from '../components/TripMap';
import TripSettings from '../components/TripSettings';
import BudgetTracker from '../components/BudgetTracker';
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
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
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
  const [showTripInfo, setShowTripInfo] = useState(false);

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

      <Row className="tripdetails-page g-3">
        <Col lg={3}>
          <aside className="td-sidebar">
            <div className="td-sidebar-card">
              <div className="td-sidebar-image" style={{ backgroundImage: `url(${tripImage})` }}>
                <button className="td-sidebar-edit-btn" onClick={() => setShowTripInfo(true)}>
                  <Pencil size={14} />
                </button>
              </div>

              {showTripInfo && (
                <div className="td-info-overlay" onClick={() => setShowTripInfo(false)}>
                  <div className="td-info-popup" onClick={(e) => e.stopPropagation()}>
                    <div className="td-info-header">
                      <h3 className="td-info-title">Trip Details</h3>
                      <button className="td-info-close" onClick={() => setShowTripInfo(false)}>
                        <X size={16} />
                      </button>
                    </div>

                    <div className="td-info-body">
                      <div className="td-info-row">
                        <span className="td-info-label">Trip Name</span>
                        <span className="td-info-value">{tripTitle}</span>
                      </div>
                      <div className="td-info-row">
                        <span className="td-info-label"><MapPin size={14} /> Destination</span>
                        <span className="td-info-value">{destination}</span>
                      </div>
                      {dateRange && (
                        <div className="td-info-row">
                          <span className="td-info-label"><Calendar size={14} /> Dates</span>
                          <span className="td-info-value">{dateRange}</span>
                        </div>
                      )}
                      <div className="td-info-row">
                        <span className="td-info-label"><Users size={14} /> Travelers</span>
                        <span className="td-info-value">{guestCount} people</span>
                      </div>

                      <div className="td-info-divider" />

                      <h4 className="td-info-section-title">Members</h4>
                      <div className="td-info-members">
                        {members.map((m, i) => (
                          <div key={i} className="td-info-member">
                            <span className="td-info-member-avatar" style={{ background: m.color }}>
                              {m.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="td-info-member-details">
                              <span className="td-info-member-name">
                                {m.name}
                                {i === 0 && <span className="td-info-admin-badge"><Crown size={10} /> Admin</span>}
                              </span>
                              <span className="td-info-member-email">
                                <Mail size={11} />
                                {m.email || `${m.name.toLowerCase().replace(/\s+/g, '')}@email.com`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {tripData.inviteEmails && (
                        <>
                          <div className="td-info-divider" />
                          <div className="td-info-row">
                            <span className="td-info-label"><Mail size={14} /> Invited</span>
                            <span className="td-info-value td-info-value-wrap">{tripData.inviteEmails}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

            <Nav className="td-sidebar-nav flex-lg-column flex-row">
              {sidebarNav.map(({ id, label, icon: Icon }) => (
                <Nav.Item key={id}>
                  <button
                    className={`td-sidebar-nav-item ${activeNav === id ? 'active' : ''}`}
                    onClick={() => setActiveNav(id)}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                </Nav.Item>
              ))}
            </Nav>
          </aside>
        </Col>

        <Col lg={9}>
          <div className="td-main">
            <button className="tripdetails-back" onClick={() => navigate('/trips')}>
              <ChevronLeft size={18} />
              Back to Trips
            </button>

            {activeNav === 'calendar' && (
              <ItineraryCalendar tripTitle={tripTitle} destination={destination} />
            )}
            {activeNav === 'budget' && (
              <BudgetTracker
                members={members}
                tripId={String(tripData.id || tripTitle)}
                totalBudget={tripData.budget || 5000}
                budgetCurrency="USD"
              />
            )}
            {activeNav === 'map' && (
              <TripMap destination={destination} />
            )}
            {activeNav === 'settings' && (
              <TripSettings
                tripData={tripData}
                onRegenerate={(updated) => {
                  navigate('/trips/details', { state: updated, replace: true });
                  setActiveNav('calendar');
                }}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TripDetails;
