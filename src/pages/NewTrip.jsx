import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './Home.css';
import './NewTrip.css';

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

function Sidebar({ navigate }) {
  return (
    <aside className="sidebar">
      <h1 className="sidebar-brand">VOYAGO</h1>
      <nav className="sidebar-nav">
        <button className="sidebar-item" onClick={() => navigate('/home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </button>
        <button className="sidebar-item active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          New Trip
        </button>
        <button className="sidebar-item" onClick={() => navigate('/home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Active Trips
        </button>
        <button className="sidebar-item" onClick={() => navigate('/home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Group
        </button>
      </nav>
      <button className="sidebar-item sidebar-logout" onClick={() => navigate('/login')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </aside>
  );
}

function NewTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = overview, 1 = basic info, 2 = details

  // Step 1 fields
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [groupOption, setGroupOption] = useState('individual');
  const [groupName, setGroupName] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');

  // Step 2 fields
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [tripType, setTripType] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [transport, setTransport] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          destination,
          start_date: startDate,
          end_date: endDate,
          num_people: parseInt(numPeople) || 1,
          budget,
          trip_type: tripType,
          accommodation,
          transport,
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to generate itinerary');
      }
      const data = await res.json();
      const summary = data.itinerary
        .map((d) => `${d.day} - ${d.title}\n${d.details}`)
        .join('\n\n');
      alert(`Itinerary for "${data.trip_title}":\n\n${summary}`);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Sidebar navigate={navigate} />

      <main className="home-main">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <span className="breadcrumb-item" onClick={() => navigate('/home')}>Home</span>
          <span className="breadcrumb-sep">/</span>
          <span
            className={`breadcrumb-item ${step === 0 ? 'breadcrumb-active' : ''}`}
            onClick={() => setStep(0)}
          >
            Trips
          </span>
          {step >= 1 && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span
                className={`breadcrumb-item ${step === 1 ? 'breadcrumb-active' : ''}`}
                onClick={() => setStep(1)}
              >
                New Trip
              </span>
            </>
          )}
          {step === 2 && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-item breadcrumb-active">Trip Details</span>
            </>
          )}
        </nav>

        {/* Step 0: In-Planning Overview */}
        {step === 0 && (
          <>
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

              {/* + Add New Trip Card */}
              <div className="trip-card add-trip-card" onClick={() => setStep(1)}>
                <div className="add-trip-content">
                  <div className="add-trip-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  <h3 className="add-trip-label">Plan a New Trip</h3>
                  <p className="add-trip-hint">Start planning your next adventure</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="newtrip-form-container">
            <h2 className="newtrip-title">Create a New Trip</h2>
            <p className="newtrip-subtitle">Start by filling in the basics</p>

            <Form onSubmit={handleStep1Submit} className="newtrip-form">
              <Form.Group className="mb-4">
                <Form.Label className="newtrip-label">Trip Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Summer in Europe"
                  className="newtrip-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="newtrip-label">Start Date (tentative)</Form.Label>
                    <Form.Control
                      type="date"
                      className="newtrip-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="newtrip-label">End Date (tentative)</Form.Label>
                    <Form.Control
                      type="date"
                      className="newtrip-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="newtrip-label">Number of People</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  placeholder="How many travelers?"
                  className="newtrip-input"
                  value={numPeople}
                  onChange={(e) => setNumPeople(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="newtrip-label">Travel With</Form.Label>
                <div className="group-toggle">
                  <button
                    type="button"
                    className={`group-toggle-btn ${groupOption === 'individual' ? 'active' : ''}`}
                    onClick={() => setGroupOption('individual')}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    className={`group-toggle-btn ${groupOption === 'group' ? 'active' : ''}`}
                    onClick={() => setGroupOption('group')}
                  >
                    Add to Group
                  </button>
                </div>
              </Form.Group>

              {groupOption === 'group' && (
                <Form.Group className="mb-4">
                  <Form.Label className="newtrip-label">Group Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. College Friends"
                    className="newtrip-input"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-4">
                <Form.Label className="newtrip-label">Invite Members (emails, comma-separated)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="friend1@email.com, friend2@email.com"
                  className="newtrip-input newtrip-textarea"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="outline-light" className="newtrip-submit">
                Invite Members & Create Plan
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </Form>
          </div>
        )}

        {/* Step 2: Trip Details */}
        {step === 2 && (
          <div className="newtrip-form-container">
            <h2 className="newtrip-title">Trip Details</h2>
            <p className="newtrip-subtitle">Tell us more about "{title}" so we can help plan it</p>

            <Form onSubmit={handleStep2Submit} className="newtrip-form">
              <Form.Group className="mb-4">
                <Form.Label className="newtrip-label">Destination</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Paris, France"
                  className="newtrip-input"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="newtrip-label">Budget (per person)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. $2,000"
                      className="newtrip-input"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="newtrip-label">Trip Type</Form.Label>
                    <Form.Select
                      className="newtrip-input newtrip-select"
                      value={tripType}
                      onChange={(e) => setTripType(e.target.value)}
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="adventure">Adventure</option>
                      <option value="relaxation">Relaxation</option>
                      <option value="cultural">Cultural</option>
                      <option value="road-trip">Road Trip</option>
                      <option value="business">Business</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="newtrip-label">Accommodation</Form.Label>
                    <Form.Select
                      className="newtrip-input newtrip-select"
                      value={accommodation}
                      onChange={(e) => setAccommodation(e.target.value)}
                    >
                      <option value="">Select preference...</option>
                      <option value="hotel">Hotel</option>
                      <option value="airbnb">Airbnb</option>
                      <option value="hostel">Hostel</option>
                      <option value="resort">Resort</option>
                      <option value="camping">Camping</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="newtrip-label">Transportation</Form.Label>
                    <Form.Select
                      className="newtrip-input newtrip-select"
                      value={transport}
                      onChange={(e) => setTransport(e.target.value)}
                    >
                      <option value="">Select preference...</option>
                      <option value="flight">Flight</option>
                      <option value="train">Train</option>
                      <option value="car">Rental Car</option>
                      <option value="bus">Bus</option>
                      <option value="mixed">Mixed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="newtrip-label">Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Any special requests, must-see places, dietary needs..."
                  className="newtrip-input newtrip-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Group>

              <div className="newtrip-actions">
                <Button
                  variant="outline-light"
                  className="newtrip-back-btn"
                  onClick={() => setStep(1)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Back
                </Button>
                <Button type="submit" variant="outline-light" className="newtrip-submit" disabled={loading}>
                  {loading ? 'Generating...' : 'Create Trip'}
                  {!loading && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </main>
    </div>
  );
}

export default NewTrip;