import { useState } from 'react';
import {
  Save, Trash2, Upload, Bell, Share2, Download, FileText,
  Calendar, Lock, Shield, Users, RefreshCw, AlertCircle,
  ChevronDown,
} from 'lucide-react';
import PlaceAutocomplete from './PlaceAutocomplete';

/* ── small reusable toggle ── */
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`ts-toggle ${checked ? 'ts-toggle-on' : ''}`}
    >
      <span className="ts-toggle-thumb" />
    </button>
  );
}

/* ── pill-style segment control ── */
function SegmentControl({ options, value, onChange }) {
  return (
    <div className="ts-segment">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`ts-segment-btn ${value === opt.value ? 'ts-segment-active' : ''}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const interestOptions = [
  'Museums', 'Food & Dining', 'Adventure', 'Nightlife',
  'Nature & Hiking', 'Shopping', 'History', 'Beach',
  'Photography', 'Local Culture',
];

const tripTypeOptions = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'relaxation', label: 'Relaxation' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'road-trip', label: 'Road Trip' },
  { value: 'business', label: 'Business' },
];

const accommodationOptions = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'resort', label: 'Resort' },
  { value: 'camping', label: 'Camping' },
];

const transportOptions = [
  { value: 'flight', label: 'Flight' },
  { value: 'train', label: 'Train' },
  { value: 'car', label: 'Rental Car' },
  { value: 'bus', label: 'Bus' },
  { value: 'mixed', label: 'Mixed' },
];

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Shanghai',
  'Australia/Sydney', 'Pacific/Auckland',
];

function TripSettings({ tripData, onRegenerate }) {
  /* ── Trip Information ── */
  const [title, setTitle] = useState(tripData.title || '');
  const [description, setDescription] = useState(tripData.description || '');
  const [startDate, setStartDate] = useState(tripData.startDate || '');
  const [endDate, setEndDate] = useState(tripData.endDate || '');
  const [timezone, setTimezone] = useState(tripData.timezone || 'America/Chicago');
  const [destination, setDestination] = useState(tripData.destination || '');
  const [tripStatus, setTripStatus] = useState(tripData.status || 'planning');

  /* ── Preferences ── */
  const [numPeople, setNumPeople] = useState(tripData.numPeople || '');
  const [currentLocation, setCurrentLocation] = useState(tripData.currentLocation || '');
  const [budget, setBudget] = useState(tripData.budget || '');
  const [tripType, setTripType] = useState(tripData.tripType || '');
  const [accommodation, setAccommodation] = useState(tripData.accommodation || '');
  const [transport, setTransport] = useState(tripData.transport || '');
  const [interests, setInterests] = useState(
    tripData.interests ? tripData.interests.split(', ').filter(Boolean) : []
  );
  const [notes, setNotes] = useState(tripData.notes || '');

  /* ── Privacy & Permissions ── */
  const [privacyLevel, setPrivacyLevel] = useState('members-only');
  const [canInviteGuests, setCanInviteGuests] = useState('all-members');
  const [canEditItinerary, setCanEditItinerary] = useState('all-members');
  const [canManageBudget, setCanManageBudget] = useState('organizer-only');

  /* ── Notifications & Sharing ── */
  const [weeklyEmails, setWeeklyEmails] = useState(false);
  const [makeShareable, setMakeShareable] = useState(false);

  /* ── UI state ── */
  const [saved, setSaved] = useState(false);
  const [interestError, setInterestError] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const members = tripData.members || [];

  const toggleInterest = (interest) => {
    setInterests((prev) => {
      const next = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];
      if (next.length >= 3) setInterestError('');
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRegenerate = () => {
    if (interests.length < 3) {
      setInterestError('Select at least 3 interests to regenerate');
      return;
    }
    setInterestError('');
    const updated = {
      ...tripData,
      title, destination, startDate, endDate, numPeople,
      currentLocation, budget, tripType, accommodation, transport,
      interests: interests.join(', '), notes,
    };
    if (onRegenerate) onRegenerate(updated);
  };

  const privacyOptions = [
    {
      value: 'members-only',
      label: 'Members Only',
      desc: 'Only invited members can view and edit this trip',
    },
    {
      value: 'anyone-with-link',
      label: 'Anyone with Link',
      desc: 'Anyone with the link can view, members can edit',
    },
    {
      value: 'public',
      label: 'Public',
      desc: 'Anyone can discover and view this trip',
    },
  ];

  const statusOptions = ['planning', 'confirmed', 'in-progress', 'completed'];

  return (
    <div className="ts-page">
      {/* ── Page header ── */}
      <div className="ts-page-header">
        <div className="ts-page-header-left">
          <h2 className="ts-page-title">Trip Settings</h2>
          <p className="ts-page-subtitle">
            Manage your trip information, notifications, sharing options, and more.
          </p>
        </div>
      </div>

      {/* ── Trip Information ── */}
      <section className="ts-card">
        <div className="ts-card-heading">
          <Calendar size={18} />
          <h3>Trip Information</h3>
        </div>

        {/* Cover image */}
        <div className="ts-field">
          <label className="ts-label">Trip Image</label>
          <div className="ts-cover-wrap">
            {tripData.image ? (
              <img src={tripData.image} alt="Trip cover" className="ts-cover-img" />
            ) : (
              <div className="ts-cover-placeholder" />
            )}
            <div className="ts-cover-overlay">
              <Upload size={20} />
              <span>Click to change</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="ts-field">
          <label className="ts-label">Title</label>
          <input
            type="text"
            className="ts-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Trip title"
          />
        </div>

        {/* Description */}
        <div className="ts-field">
          <label className="ts-label">Description</label>
          <textarea
            className="ts-textarea"
            rows={3}
            maxLength={600}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Trip Description"
          />
          <span className="ts-char-count">{description.length}/600</span>
        </div>

        {/* Dates + Timezone */}
        <div className="ts-grid-2">
          <div className="ts-field">
            <label className="ts-label">Dates</label>
            <div className="ts-date-row">
              <input
                type="date"
                className="ts-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="ts-date-sep">–</span>
              <input
                type="date"
                className="ts-input"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="ts-field">
            <label className="ts-label">Timezone</label>
            <div className="ts-select-wrap">
              <select
                className="ts-select"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <ChevronDown size={14} className="ts-select-arrow" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="ts-field">
          <label className="ts-label">Location</label>
          <PlaceAutocomplete
            value={destination}
            onChange={setDestination}
            placeholder="e.g. Tokyo, Japan"
            className="ts-input"
          />
        </div>

        {/* Trip Status */}
        <div className="ts-field">
          <label className="ts-label">Trip Status</label>
          <div className="ts-status-row">
            {statusOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTripStatus(s)}
                className={`ts-status-btn ${tripStatus === s ? 'ts-status-active' : ''}`}
              >
                {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy Controls ── */}
      <section className="ts-card">
        <div className="ts-card-heading">
          <Lock size={18} />
          <h3>Privacy Controls</h3>
        </div>
        <label className="ts-label" style={{ marginBottom: '0.6rem' }}>
          Who can view this trip?
        </label>
        <div className="ts-radio-group">
          {privacyOptions.map((opt) => (
            <label
              key={opt.value}
              className={`ts-radio-option ${privacyLevel === opt.value ? 'ts-radio-active' : ''}`}
            >
              <input
                type="radio"
                name="ts-privacy"
                value={opt.value}
                checked={privacyLevel === opt.value}
                onChange={() => setPrivacyLevel(opt.value)}
                className="ts-radio-input"
              />
              <div className="ts-radio-dot" />
              <div>
                <span className="ts-radio-label">{opt.label}</span>
                <span className="ts-radio-desc">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* ── Permissions ── */}
      <section className="ts-card">
        <div className="ts-card-heading">
          <Shield size={18} />
          <h3>Permissions</h3>
        </div>

        <div className="ts-permission-row">
          <label className="ts-label">Who can invite guests?</label>
          <SegmentControl
            options={[
              { value: 'organizer-only', label: 'Organizer Only' },
              { value: 'all-members', label: 'All Members' },
            ]}
            value={canInviteGuests}
            onChange={setCanInviteGuests}
          />
        </div>

        <div className="ts-permission-row">
          <label className="ts-label">Who can edit the itinerary?</label>
          <SegmentControl
            options={[
              { value: 'organizer-only', label: 'Organizer Only' },
              { value: 'all-members', label: 'All Members' },
            ]}
            value={canEditItinerary}
            onChange={setCanEditItinerary}
          />
        </div>

        <div className="ts-permission-row">
          <label className="ts-label">Who can manage the budget?</label>
          <SegmentControl
            options={[
              { value: 'organizer-only', label: 'Organizer Only' },
              { value: 'all-members', label: 'All Members' },
            ]}
            value={canManageBudget}
            onChange={setCanManageBudget}
          />
        </div>
      </section>

      {/* ── Notifications ── */}
      <section className="ts-card">
        <div className="ts-card-heading">
          <Bell size={18} />
          <h3>Notifications</h3>
        </div>
        <div className="ts-toggle-row">
          <ToggleSwitch checked={weeklyEmails} onChange={setWeeklyEmails} />
          <div>
            <span className="ts-toggle-label">Receive weekly update emails</span>
            <span className="ts-toggle-desc">
              Get a weekly summary of suggested experiences from the AI Travel Planner
            </span>
          </div>
        </div>
      </section>

      {/* ── Sharing ── */}
      <section className="ts-card">
        <div className="ts-card-heading">
          <Share2 size={18} />
          <h3>Sharing</h3>
        </div>
        <div className="ts-toggle-row">
          <ToggleSwitch checked={makeShareable} onChange={setMakeShareable} />
          <div>
            <span className="ts-toggle-label">Make this trip shareable</span>
            <span className="ts-toggle-desc">
              This will allow anyone with the link to view your trip details, including dates, location, and guests.
            </span>
          </div>
        </div>
      </section>

      {/* ── Integrations ── */}
      <section className="ts-card">
        <div className="ts-card-heading">
          <Download size={18} />
          <h3>Integrations</h3>
        </div>
        <div className="ts-integration-list">
          <button
            type="button"
            className="ts-integration-btn"
            onClick={() => alert('Exporting to PDF…')}
          >
            <div className="ts-integration-left">
              <FileText size={18} className="ts-integration-icon" />
              <div>
                <span className="ts-integration-title">Export to PDF</span>
                <span className="ts-integration-desc">Download a PDF version of your trip itinerary</span>
              </div>
            </div>
            <Download size={16} className="ts-integration-dl" />
          </button>

          <button
            type="button"
            className="ts-integration-btn"
            onClick={() => alert('Exporting to iCal…')}
          >
            <div className="ts-integration-left">
              <Calendar size={18} className="ts-integration-icon" />
              <div>
                <span className="ts-integration-title">Export to iCal</span>
                <span className="ts-integration-desc">
                  Import events into your calendar app (Apple Calendar, Google Calendar, etc.)
                </span>
              </div>
            </div>
            <Download size={16} className="ts-integration-dl" />
          </button>
        </div>
      </section>

      {/* ── Trip Guests ── */}
      {members.length > 0 && (
        <section className="ts-card">
          <div className="ts-card-heading">
            <Users size={18} />
            <h3>Trip Guests</h3>
          </div>
          <div className="ts-member-list">
            {members.map((m, i) => (
              <div key={i} className="ts-member-row">
                <span
                  className="ts-member-avatar"
                  style={{ background: m.color || '#6366f1' }}
                >
                  {(m.name || '?').charAt(0).toUpperCase()}
                </span>
                <div className="ts-member-info">
                  <span className="ts-member-name">{m.name}</span>
                  <span className="ts-member-email">
                    {m.email || `${(m.name || '').toLowerCase().replace(/\s+/g, '')}@example.com`}
                  </span>
                </div>
                <span className={`ts-member-badge ${i === 0 ? 'ts-badge-organizer' : 'ts-badge-member'}`}>
                  {i === 0 ? 'Organizer' : 'Member'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── AI Preferences (collapsible) ── */}
      <section className="ts-card">
        <button
          type="button"
          className="ts-collapsible-header"
          onClick={() => setShowPreferences((v) => !v)}
        >
          <div className="ts-card-heading" style={{ margin: 0 }}>
            <RefreshCw size={18} />
            <h3>AI Itinerary Preferences</h3>
          </div>
          <ChevronDown
            size={16}
            className={`ts-chevron ${showPreferences ? 'ts-chevron-open' : ''}`}
          />
        </button>

        {showPreferences && (
          <div className="ts-preferences-body">
            {/* Number of people */}
            <div className="ts-field">
              <label className="ts-label">
                Number of People <span className="ts-required">*</span>
              </label>
              <input
                type="number"
                min="1"
                className="ts-input"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
              />
            </div>

            {/* Current location */}
            <div className="ts-field">
              <label className="ts-label">
                Your Current Location <span className="ts-required">*</span>
              </label>
              <PlaceAutocomplete
                value={currentLocation}
                onChange={setCurrentLocation}
                placeholder="e.g. New York, USA"
                className="ts-input"
              />
            </div>

            <div className="ts-grid-2">
              {/* Budget */}
              <div className="ts-field">
                <label className="ts-label">
                  Budget (per person) <span className="ts-required">*</span>
                </label>
                <input
                  type="text"
                  className="ts-input"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $2,000"
                />
              </div>

              {/* Trip type */}
              <div className="ts-field">
                <label className="ts-label">
                  Trip Type <span className="ts-required">*</span>
                </label>
                <div className="ts-select-wrap">
                  <select
                    className="ts-select"
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                  >
                    <option value="">Select type…</option>
                    {tripTypeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="ts-select-arrow" />
                </div>
              </div>
            </div>

            <div className="ts-grid-2">
              {/* Accommodation */}
              <div className="ts-field">
                <label className="ts-label">
                  Accommodation <span className="ts-required">*</span>
                </label>
                <div className="ts-select-wrap">
                  <select
                    className="ts-select"
                    value={accommodation}
                    onChange={(e) => setAccommodation(e.target.value)}
                  >
                    <option value="">Select preference…</option>
                    {accommodationOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="ts-select-arrow" />
                </div>
              </div>

              {/* Transportation */}
              <div className="ts-field">
                <label className="ts-label">
                  Transportation <span className="ts-required">*</span>
                </label>
                <div className="ts-select-wrap">
                  <select
                    className="ts-select"
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                  >
                    <option value="">Select preference…</option>
                    {transportOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="ts-select-arrow" />
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="ts-field">
              <div className="ts-label-row">
                <label className="ts-label">
                  Interests <span className="ts-required">*</span>
                </label>
                <span className={`ts-interest-count ${interests.length >= 3 ? 'valid' : ''}`}>
                  {interests.length}/3 min
                </span>
              </div>
              <div className="ts-interests-grid">
                {interestOptions.map((interest) => (
                  <span
                    key={interest}
                    className={`ts-chip ${interests.includes(interest) ? 'ts-chip-active' : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </span>
                ))}
              </div>
              {interestError && <p className="ts-field-error">{interestError}</p>}
            </div>

            {/* Notes */}
            <div className="ts-field">
              <label className="ts-label">Additional Notes</label>
              <textarea
                className="ts-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests, must-see places, dietary needs…"
              />
            </div>

            {/* Regenerate */}
            <div className="ts-regen-row">
              <button type="button" className="ts-regen-btn" onClick={handleRegenerate}>
                <RefreshCw size={16} />
                Re-generate Itinerary
              </button>
              <p className="ts-regen-warning">
                <AlertCircle size={13} />
                Re-generating will replace your current itinerary with a new one.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Action buttons ── */}
      <div className="ts-actions">
        <button type="button" className="ts-save-btn" onClick={handleSave}>
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Trip'}
        </button>

        {!showDeleteConfirm ? (
          <button
            type="button"
            className="ts-delete-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={18} />
            Delete Trip
          </button>
        ) : (
          <div className="ts-delete-confirm">
            <p className="ts-delete-warning">
              Are you sure? This will permanently delete the trip and all its data.
            </p>
            <div className="ts-delete-confirm-actions">
              <button type="button" className="ts-delete-confirm-btn">
                <Trash2 size={15} />
                Yes, Delete
              </button>
              <button
                type="button"
                className="ts-cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripSettings;
