import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Star, MapPin, Info, MessageSquare, Clock, Flag, Check } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './NewTrip.css';

function TripDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const tripInfo = location.state || {};

  const { title = '', destination = '', startDate = '', endDate = '', numPeople = '' } = tripInfo;

  // 1-month leeway around proposed trip dates
  const shiftMonth = (dateStr, months) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };
  const availableMin = shiftMonth(startDate, -1);
  const availableMax = shiftMonth(endDate, 1);

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

  const handleSubmit = async (e) => {
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
      <Sidebar />

      <main className="home-main">
        <nav className="breadcrumbs">
          <span className="breadcrumb-item" onClick={() => navigate('/home')}>Home</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item" onClick={() => navigate('/trips')}>Trips</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item" onClick={() => navigate('/trips/new')}>New Trip</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item breadcrumb-active">Trip Details</span>
        </nav>

        <div className="step2-split">
          {/* Left: Form */}
          <div className="step2-form-panel">
            <h2 className="newtrip-title">Trip Details</h2>
            <p className="newtrip-subtitle">Tell us more about &ldquo;{title}&rdquo; so we can help plan it</p>

            <Form onSubmit={handleSubmit} className="newtrip-form">
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
                  onClick={() => navigate('/trips/new', { state: tripInfo })}
                >
                  <ArrowLeft size={18} style={{ marginRight: '8px' }} />
                  Back
                </Button>
                <Button type="submit" variant="outline-light" className="newtrip-submit" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Itinerary'}
                  {!loading && (
                    <Star size={18} style={{ marginLeft: '8px' }} />
                  )}
                </Button>
              </div>
            </Form>
          </div>

          {/* Right: Generated Itinerary Roadmap */}
          <div className="step2-result-panel">
            {!generatedData && !loading && (
              <div className="result-placeholder">
                <MapPin size={48} strokeWidth={1.2} />
                <h3>Your Itinerary Roadmap</h3>
                <p>Fill in the details and click &ldquo;Generate Itinerary&rdquo; to see your AI-planned trip appear here.</p>
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

                {generatedData.country_info && (
                  <div className="roadmap-info-bar">
                    <span className="info-tag">
                      <Info size={14} />
                      {generatedData.country_info.currency}
                    </span>
                    <span className="info-tag">
                      <MessageSquare size={14} />
                      {generatedData.country_info.language}
                    </span>
                    <span className="info-tag">
                      <Clock size={14} />
                      {generatedData.country_info.timezone}
                    </span>
                  </div>
                )}

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
                            <MapPin size={12} />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="roadmap-stop roadmap-finish">
                    <div className="roadmap-marker">
                      <span className="roadmap-flag">
                        <Flag size={18} />
                      </span>
                    </div>
                    <div className="roadmap-card roadmap-card-finish">
                      <h4 className="roadmap-card-title">Trip Complete!</h4>
                      <p className="roadmap-card-details">End of your {generatedData.destination} adventure.</p>
                    </div>
                  </div>
                </div>

                <button className="roadmap-save-btn" onClick={() => { alert('Trip saved!'); navigate('/home'); }}>
                  Save Trip & Go Home
                  <Check size={18} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TripDetails;