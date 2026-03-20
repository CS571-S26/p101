import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './NewTrip.css';

function NewTripForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numPeople, setNumPeople] = useState('');
  const [groupOption, setGroupOption] = useState('individual');
  const [groupName, setGroupName] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/trips/new/details', {
      state: { title, destination, startDate, endDate, numPeople, groupOption, groupName, inviteEmails },
    });
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
          <span className="breadcrumb-item breadcrumb-active">New Trip</span>
        </nav>

        <div className="newtrip-form-container">
          <h2 className="newtrip-title">Create a New Trip</h2>
          <p className="newtrip-subtitle">Start by filling in the basics</p>

          <Form onSubmit={handleSubmit} className="newtrip-form">
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
      </main>
    </div>
  );
}

export default NewTripForm;