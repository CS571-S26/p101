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
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (val) => {
    setStartDate(val);
    if (endDate && val > endDate) setEndDate('');
  };
  const [numPeople, setNumPeople] = useState('');
  const [groupOption, setGroupOption] = useState('individual');
  const [groupName, setGroupName] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');

  // Step 2 fields
  const [currentLocation, setCurrentLocation] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [budget, setBudget] = useState('');
  const [tripType, setTripType] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [transport, setTransport] = useState('');
  const [notes, setNotes] = useState('');
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  // 1-month leeway around proposed trip dates
  const shiftMonth = (dateStr, months) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };
  const availableMin = shiftMonth(startDate, -1);
  const availableMax = shiftMonth(endDate, 1);

  const interestOptions = [
    'Museums', 'Food & Dining', 'Adventure', 'Nightlife',
    'Nature & Hiking', 'Shopping', 'History', 'Beach',
    'Photography', 'Local Culture',
  ];

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

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
          current_location: currentLocation,
          budget,
          trip_type: tripType,
          accommodation,
          transport,
          interests: interests.join(', '),
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to generate itinerary');
      }
      const data = await res.json();
      setGeneratedData(data);
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
                    <Form.Label className="newtrip-label">Start Date (tentative)</Form.Label>
                    <Form.Control
                      type="date"
                      className="newtrip-input"
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
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
                      min={startDate || undefined}
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

        {/* Step 2: Trip Details (split layout) */}
        {step === 2 && (
          <div className="step2-split">
            {/* Left: Form */}
            <div className="step2-form-panel">
              <h2 className="newtrip-title">Trip Details</h2>
              <p className="newtrip-subtitle">Tell us more about "{title}" so we can help plan it</p>

              <Form onSubmit={handleStep2Submit} className="newtrip-form">
                <Form.Group className="mb-4">
                  <Form.Label className="newtrip-label">Destination</Form.Label>
                  <Form.Control
                    type="text"
                    className="newtrip-input newtrip-input-readonly"
                    value={destination}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="newtrip-label">Your Current Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. New York, USA"
                    className="newtrip-input"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="proposed-dates-bar">
                  <span className="proposed-dates-label">Proposed trip dates:</span>
                  <span className="proposed-dates-value">{startDate} to {endDate}</span>
                </div>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="newtrip-label">Your Available From</Form.Label>
                      <Form.Control
                        type="date"
                        className="newtrip-input"
                        value={availableFrom}
                        min={availableMin}
                        max={availableMax}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="newtrip-label">Your Available Until</Form.Label>
                      <Form.Control
                        type="date"
                        className="newtrip-input"
                        value={availableTo}
                        min={availableFrom || availableMin}
                        max={availableMax}
                        onChange={(e) => setAvailableTo(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

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
                  <Form.Label className="newtrip-label">Interests</Form.Label>
                  <div className="interests-grid">
                    {interestOptions.map((interest) => (
                      <span
                        key={interest}
                        className={`interest-chip ${interests.includes(interest) ? 'active' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </Form.Group>

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
                    {loading ? 'Generating...' : 'Generate Itinerary'}
                    {!loading && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                  </Button>
                </div>
              </Form>
            </div>

            {/* Right: Generated Itinerary Roadmap */}
            <div className="step2-result-panel">
              {!generatedData && !loading && (
                <div className="result-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                  </svg>
                  <h3>Your Itinerary Roadmap</h3>
                  <p>Fill in the details and click "Generate Itinerary" to see your AI-planned trip appear here.</p>
                </div>
              )}

              {loading && (
                <div className="result-placeholder">
                  <div className="loading-spinner" />
                  <h3>Planning your trip...</h3>
                  <p>Our AI is crafting a personalized itinerary for you.</p>
                </div>
              )}

              {generatedData && !loading && (
                <div className="roadmap-container">
                  {/* Destination header */}
                  {generatedData.image_url && (
                    <div className="roadmap-hero" style={{ backgroundImage: `url(${generatedData.image_url})` }}>
                      <div className="roadmap-hero-overlay">
                        <h3>{generatedData.trip_title}</h3>
                        <p>{generatedData.destination}</p>
                      </div>
                    </div>
                  )}
                  {!generatedData.image_url && (
                    <div className="roadmap-header">
                      <h3>{generatedData.trip_title}</h3>
                      <p className="roadmap-dest">{generatedData.destination}</p>
                    </div>
                  )}

                  {/* Country Info */}
                  {generatedData.country_info && (
                    <div className="roadmap-info-bar">
                      <span className="info-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {generatedData.country_info.currency}
                      </span>
                      <span className="info-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        {generatedData.country_info.language}
                      </span>
                      <span className="info-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {generatedData.country_info.timezone}
                      </span>
                    </div>
                  )}

                  {/* Roadmap Timeline */}
                  <div className="roadmap-timeline">
                    {generatedData.itinerary.map((item, index) => (
                      <div key={index} className="roadmap-stop">
                        <div className="roadmap-marker">
                          <span className="roadmap-number">{index + 1}</span>
                          {index < generatedData.itinerary.length - 1 && (
                            <span className="roadmap-line" />
                          )}
                        </div>
                        <div className="roadmap-card">
                          <div className="roadmap-day-badge">{item.day}</div>
                          <h4 className="roadmap-card-title">{item.title}</h4>
                          <p className="roadmap-card-details">{item.details}</p>
                          {item.location && (
                            <span className="roadmap-location">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="10" r="3" />
                                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                              </svg>
                              {item.location}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Final destination marker */}
                    <div className="roadmap-stop roadmap-finish">
                      <div className="roadmap-marker">
                        <span className="roadmap-flag">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                            <line x1="4" y1="22" x2="4" y2="15" />
                          </svg>
                        </span>
                      </div>
                      <div className="roadmap-card roadmap-card-finish">
                        <h4 className="roadmap-card-title">Trip Complete!</h4>
                        <p className="roadmap-card-details">End of your {generatedData.destination} adventure.</p>
                      </div>
                    </div>
                  </div>

                  {/* Save button */}
                  <button className="roadmap-save-btn" onClick={() => { alert('Trip saved!'); navigate('/home'); }}>
                    Save Trip & Go Home
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default NewTrip;