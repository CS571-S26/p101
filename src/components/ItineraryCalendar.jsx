import { useState, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, CalendarDays, LayoutGrid,
  MapPin, Clock, X, Navigation, StickyNote, Tag,
  Home, Plane, Utensils, Camera, Car, Users, Scissors,
  Flag, CheckSquare, Heart, Copy, Trash2, Save,
  Bold, Italic, Underline, List, ListOrdered, ListChecks,
  ArrowRight, Globe,
} from 'lucide-react';
import './ItineraryCalendar.css';

const HOUR_START = 6;
const HOUR_END = 22;
const HOUR_HEIGHT = 64;

const SAMPLE_ITINERARY = {
  '2026-04-14': [
    { time: '08:00', duration: 1, title: 'Breakfast at Hotel', location: 'Hotel Lobby', color: '#f97316', category: 'Food', notes: 'Buffet breakfast included with room. Try the paranthas and fresh mango lassi.' },
    { time: '10:00', duration: 2, title: 'Red Fort Visit', location: 'Old Delhi', color: '#3b82f6', category: 'Sightseeing', notes: 'UNESCO World Heritage Site. Audio guide available at entrance. Closed on Mondays.' },
    { time: '12:30', duration: 1, title: 'Lunch at Chandni Chowk', location: 'Chandni Chowk', color: '#22c55e', category: 'Food', notes: 'Famous street food lane. Must try: chole bhature at Sita Ram and jalebi at Old Famous.' },
    { time: '14:00', duration: 2, title: 'Jama Masjid & Spice Market', location: 'Old Delhi', color: '#a78bfa', category: 'Culture', notes: 'One of the largest mosques in India. Climb the minaret for panoramic views. Spice market nearby.' },
    { time: '17:00', duration: 1.5, title: 'Rickshaw Ride & Street Food', location: 'Old Delhi', color: '#f43f5e', category: 'Adventure', notes: 'Negotiate price before hopping on. Evening is the best time for the narrow lanes.' },
    { time: '19:30', duration: 1.5, title: 'Dinner at Karim\'s', location: 'Jama Masjid Area', color: '#f97316', category: 'Food', notes: 'Legendary Mughlai restaurant since 1913. Try the mutton burra and seekh kebab.' },
  ],
  '2026-04-15': [
    { time: '07:00', duration: 1, title: 'Yoga & Breakfast', location: 'Hotel', color: '#f97316', category: 'Wellness', notes: 'Morning yoga session at the rooftop. Light breakfast afterwards.' },
    { time: '09:00', duration: 2, title: 'India Gate & Rashtrapati Bhavan', location: 'New Delhi', color: '#3b82f6', category: 'Sightseeing', notes: 'War memorial and presidential residence. Best in morning light for photos.' },
    { time: '11:30', duration: 1.5, title: 'National Museum', location: 'Janpath', color: '#a78bfa', category: 'Culture', notes: 'Extensive collection of Indian art and artifacts. Allow at least 1.5 hours.' },
    { time: '13:00', duration: 1, title: 'Lunch at Connaught Place', location: 'CP', color: '#22c55e', category: 'Food', notes: 'Try Wenger\'s bakery or Saravana Bhavan for South Indian.' },
    { time: '14:30', duration: 2, title: 'Humayun\'s Tomb', location: 'Nizamuddin', color: '#3b82f6', category: 'Sightseeing', notes: 'Precursor to the Taj Mahal. Beautiful Mughal gardens. Sunset is magical here.' },
    { time: '17:00', duration: 1.5, title: 'Lodhi Garden Walk', location: 'Lodhi Road', color: '#22c55e', category: 'Nature', notes: 'Peaceful garden with 15th century tombs. Great for an evening stroll.' },
    { time: '19:00', duration: 2, title: 'Dinner & Live Music', location: 'Hauz Khas Village', color: '#f43f5e', category: 'Nightlife', notes: 'Trendy area with rooftop restaurants. Check out Social or Imperfecto.' },
  ],
  '2026-04-16': [
    { time: '06:30', duration: 1, title: 'Morning Walk at Lodhi Garden', location: 'Lodhi Road', color: '#22c55e', category: 'Nature', notes: 'Early morning is peaceful. Bring water and comfortable shoes.' },
    { time: '08:00', duration: 1, title: 'Breakfast', location: 'Hotel', color: '#f97316', category: 'Food', notes: 'Standard hotel buffet.' },
    { time: '10:00', duration: 2.5, title: 'Qutub Minar Complex', location: 'Mehrauli', color: '#3b82f6', category: 'Sightseeing', notes: 'Tallest brick minaret in the world. Also see the Iron Pillar and Alai Darwaza.' },
    { time: '13:00', duration: 1, title: 'Lunch at Olive Bar', location: 'Mehrauli', color: '#22c55e', category: 'Food', notes: 'Mediterranean cuisine in a beautiful heritage setting.' },
    { time: '15:00', duration: 2, title: 'Dilli Haat Craft Bazaar', location: 'INA', color: '#a78bfa', category: 'Shopping', notes: 'Open-air craft market. Great for souvenirs, textiles, and regional food stalls.' },
    { time: '18:00', duration: 1.5, title: 'Akshardham Temple Visit', location: 'Noida Link Road', color: '#3b82f6', category: 'Sightseeing', notes: 'Spectacular temple complex. No phones/cameras inside. Evening light show.' },
    { time: '20:00', duration: 1.5, title: 'Dinner at Indian Accent', location: 'The Lodhi', color: '#f97316', category: 'Food', notes: 'Award-winning modern Indian cuisine. Reservation required.' },
  ],
  '2026-04-17': [
    { time: '08:00', duration: 1, title: 'Breakfast', location: 'Hotel', color: '#f97316', category: 'Food', notes: 'Last full day breakfast.' },
    { time: '09:30', duration: 2, title: 'Lotus Temple', location: 'Bahapur', color: '#3b82f6', category: 'Sightseeing', notes: 'Iconic Baha\'i House of Worship. Silent meditation inside. Beautiful lotus-shaped architecture.' },
    { time: '12:00', duration: 1.5, title: 'ISKCON Temple & Lunch', location: 'East of Kailash', color: '#22c55e', category: 'Food', notes: 'Visit the temple and enjoy sattvic lunch at Govinda\'s restaurant.' },
    { time: '14:00', duration: 2, title: 'Shopping at Sarojini Nagar', location: 'Sarojini Nagar', color: '#f43f5e', category: 'Shopping', notes: 'Famous for export surplus clothing at bargain prices. Haggle hard!' },
    { time: '17:00', duration: 1.5, title: 'Nehru Place Tech Market', location: 'Nehru Place', color: '#a78bfa', category: 'Shopping', notes: 'Electronics and gadgets market. Be cautious of counterfeit products.' },
    { time: '19:30', duration: 2, title: 'Farewell Dinner', location: 'Bukhara, ITC Maurya', color: '#f97316', category: 'Food', notes: 'Iconic restaurant. Famous for dal bukhara and tandoori dishes. Smart casual dress code.' },
  ],
  '2026-04-18': [
    { time: '07:00', duration: 1, title: 'Breakfast & Packing', location: 'Hotel', color: '#f97316', category: 'Food', notes: 'Early checkout. Pack and settle any extras.' },
    { time: '09:00', duration: 1.5, title: 'Last-minute Souvenir Shopping', location: 'Khan Market', color: '#f43f5e', category: 'Shopping', notes: 'Upscale market. Good for books, teas, and curated gifts.' },
    { time: '11:00', duration: 1, title: 'Check-out & Transfer', location: 'Hotel', color: '#a78bfa', category: 'Transport', notes: 'Hotel will arrange airport transfer. Confirm timing at reception.' },
    { time: '13:00', duration: 1, title: 'Lunch near Airport', location: 'Aerocity', color: '#22c55e', category: 'Food', notes: 'Multiple restaurant options at Aerocity. Allow time for security.' },
    { time: '15:00', duration: 1, title: 'Airport Departure', location: 'IGI Airport T3', color: '#3b82f6', category: 'Transport', notes: 'Arrive 3 hours before international flights. Terminal 3 for international.' },
  ],
};

function getDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function getShortDayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    day: d.getDate(),
  };
}

function formatHour(h) {
  if (h === 0 || h === 24) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function timeToOffset(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return (h - HOUR_START + m / 60) * HOUR_HEIGHT;
}

function durationToHeight(duration) {
  return duration * HOUR_HEIGHT;
}

function formatTimeRange(timeStr, duration) {
  const [h, m] = timeStr.split(':').map(Number);
  const startMin = h * 60 + m;
  const endMin = startMin + duration * 60;
  const fmt = (mins) => {
    const hh = Math.floor(mins / 60);
    const mm = mins % 60;
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
    return mm === 0 ? `${h12} ${suffix}` : `${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
  };
  return `${fmt(startMin)} - ${fmt(endMin)}`;
}

function formatDuration(duration) {
  const h = Math.floor(duration);
  const m = Math.round((duration - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

const EVENT_TYPES = [
  { id: 'event', label: 'Event', icon: CalendarDays, color: '#3b82f6' },
  { id: 'accommodation', label: 'Stay', icon: Home, color: '#8b5cf6' },
  { id: 'flight', label: 'Flight', icon: Plane, color: '#0ea5e9' },
  { id: 'food', label: 'Food', icon: Utensils, color: '#f97316' },
  { id: 'sightseeing', label: 'Sight', icon: Camera, color: '#22c55e' },
  { id: 'transport', label: 'Transport', icon: Car, color: '#64748b' },
  { id: 'group', label: 'Group', icon: Users, color: '#ec4899' },
  { id: 'activity', label: 'Activity', icon: Scissors, color: '#f43f5e' },
  { id: 'milestone', label: 'Flag', icon: Flag, color: '#eab308' },
  { id: 'task', label: 'Task', icon: CheckSquare, color: '#14b8a6' },
];

const SAMPLE_MEMBERS = [
  { initials: 'SN', name: 'Shashwat', color: '#3b82f6' },
  { initials: 'SN', name: 'Sarah', color: '#22c55e' },
  { initials: 'ZC', name: 'Zara', color: '#eab308' },
];

function computeDateTime(dateStr, timeStr, durationH) {
  if (!dateStr || !timeStr) return { startDT: '', endDT: '' };
  const [h, m] = timeStr.split(':').map(Number);
  const endMin = h * 60 + m + durationH * 60;
  const endH = Math.floor(endMin / 60);
  const endM = endMin % 60;
  const pad = (n) => String(n).padStart(2, '0');
  const fmtDT = (hh, mm) => {
    const suffix = hh >= 12 ? 'pm' : 'am';
    const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
    return `${dateStr.replace(/-/g, '/')} ${h12}:${pad(mm)} ${suffix}`;
  };
  return { startDT: fmtDT(h, m), endDT: fmtDT(endH, endM) };
}

function EventDetailPanel({ event, onClose, currentDate }) {
  if (!event) return null;

  const [eventType, setEventType] = useState(
    EVENT_TYPES.find((t) => t.id === (event.category || 'event').toLowerCase())?.id || 'event'
  );
  const [title, setTitle] = useState(event.title);
  const [members, setMembers] = useState([...SAMPLE_MEMBERS]);
  const [allDay, setAllDay] = useState(false);
  const [isOptional, setIsOptional] = useState(false);
  const [location, setLocation] = useState(event.location || '');
  const [description, setDescription] = useState(event.notes || '');
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/\//g, '/'));
  const descRef = useRef(null);

  const { startDT, endDT } = computeDateTime(currentDate, event.time, event.duration);
  const activeType = EVENT_TYPES.find((t) => t.id === eventType) || EVENT_TYPES[0];

  const removeMember = (idx) => setMembers((m) => m.filter((_, i) => i !== idx));

  const execFormat = (cmd) => {
    document.execCommand(cmd, false, null);
    descRef.current?.focus();
  };

  return (
    <div className="cal-detail-backdrop" onClick={onClose}>
      <div className="cal-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cal-modal-header">
          <div className="cal-modal-header-left">
            <span className="cal-modal-header-icon" style={{ background: activeType.color }}>
              <activeType.icon size={18} color="#fff" />
            </span>
            <div>
              <h3 className="cal-modal-title-text">Edit Event</h3>
              <span className="cal-modal-subtitle">{activeType.label}</span>
            </div>
          </div>
          <button className="cal-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Event Type Tabs */}
        <div className="cal-modal-types">
          <span className="cal-modal-type-label">Event</span>
          <div className="cal-modal-type-icons">
            {EVENT_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  className={`cal-modal-type-btn ${eventType === t.id ? 'active' : ''}`}
                  style={eventType === t.id ? { background: t.color, color: '#fff' } : {}}
                  onClick={() => setEventType(t.id)}
                  title={t.label}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="cal-modal-body">
          {/* Title */}
          <div className="cal-modal-section">
            <div className="cal-modal-title-row">
              <span className="cal-modal-emoji" style={{ background: activeType.color + '18', color: activeType.color }}>
                <activeType.icon size={20} />
              </span>
              <input
                className="cal-modal-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event name"
              />
            </div>

            {/* Who's going */}
            <div className="cal-modal-who">
              <span className="cal-modal-who-label">WHO'S GOING?</span>
              <div className="cal-modal-who-list">
                {members.map((m, i) => (
                  <div key={i} className="cal-modal-who-avatar" style={{ background: m.color }}>
                    {m.initials}
                    <button className="cal-modal-who-remove" onClick={() => removeMember(i)}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* When */}
          <div className="cal-modal-section">
            <h4 className="cal-modal-section-title">
              <CalendarDays size={16} className="cal-modal-section-icon" style={{ color: '#f97316' }} />
              When
            </h4>
            <div className="cal-modal-when-row">
              <div className="cal-modal-when-field">
                <input className="cal-modal-input" value={startDT} readOnly />
              </div>
              <div className="cal-modal-when-field">
                <select className="cal-modal-select" value={timezone} readOnly>
                  <option>{timezone}</option>
                </select>
              </div>
              <span className="cal-modal-when-arrow"><ArrowRight size={16} /></span>
              <div className="cal-modal-when-field">
                <input className="cal-modal-input" value={endDT} readOnly />
              </div>
              <div className="cal-modal-when-field">
                <select className="cal-modal-select" value={timezone} readOnly>
                  <option>{timezone}</option>
                </select>
              </div>
            </div>
            <label className="cal-modal-toggle-row">
              <button
                className={`cal-modal-toggle ${allDay ? 'on' : ''}`}
                onClick={() => setAllDay(!allDay)}
                role="switch"
                aria-checked={allDay}
              >
                <span className="cal-modal-toggle-thumb" />
              </button>
              All day event
            </label>
          </div>

          {/* Location */}
          <div className="cal-modal-section">
            <h4 className="cal-modal-section-title">
              <MapPin size={16} className="cal-modal-section-icon" style={{ color: '#22c55e' }} />
              Location
            </h4>
            <div className="cal-modal-location-wrap">
              <MapPin size={16} className="cal-modal-location-icon" />
              <input
                className="cal-modal-input cal-modal-location-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search for a place"
              />
              {location && (
                <a
                  className="cal-modal-map-link"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on Map"
                >
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Optional Event */}
          <div className="cal-modal-section cal-modal-optional-section">
            <div className="cal-modal-optional-left">
              <label className="cal-modal-toggle-row">
                <button
                  className={`cal-modal-toggle ${isOptional ? 'on' : ''}`}
                  onClick={() => setIsOptional(!isOptional)}
                  role="switch"
                  aria-checked={isOptional}
                >
                  <span className="cal-modal-toggle-thumb" />
                </button>
                <div>
                  <span className="cal-modal-optional-title">Optional Event</span>
                  <span className="cal-modal-optional-desc">Let your travel companions vote on this activity</span>
                </div>
              </label>
            </div>
            <button className="cal-modal-vote-btn">
              <Heart size={14} />
              Vote
            </button>
          </div>

          {/* Description */}
          <div className="cal-modal-section">
            <h4 className="cal-modal-section-title">
              <StickyNote size={16} className="cal-modal-section-icon" style={{ color: '#f59e0b' }} />
              Description
            </h4>
            <div className="cal-modal-editor">
              <div className="cal-modal-editor-toolbar">
                <button className="cal-modal-editor-btn" onClick={() => execFormat('bold')} title="Bold"><Bold size={16} /></button>
                <button className="cal-modal-editor-btn" onClick={() => execFormat('italic')} title="Italic"><Italic size={16} /></button>
                <button className="cal-modal-editor-btn" onClick={() => execFormat('underline')} title="Underline"><Underline size={16} /></button>
                <span className="cal-modal-editor-sep" />
                <button className="cal-modal-editor-btn" onClick={() => execFormat('insertUnorderedList')} title="Bullet List"><List size={16} /></button>
                <button className="cal-modal-editor-btn" onClick={() => execFormat('insertOrderedList')} title="Numbered List"><ListOrdered size={16} /></button>
                <button className="cal-modal-editor-btn" title="Checklist"><ListChecks size={16} /></button>
              </div>
              <div
                ref={descRef}
                className="cal-modal-editor-area"
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: description }}
                onBlur={(e) => setDescription(e.currentTarget.innerHTML)}
                data-placeholder="Add notes, details, or instructions..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="cal-modal-footer">
          <div className="cal-modal-footer-left">
            <button className="cal-modal-footer-btn cal-modal-delete-btn">
              <Trash2 size={15} />
              Delete
            </button>
            <button className="cal-modal-footer-btn cal-modal-dup-btn">
              <Copy size={15} />
              Duplicate
            </button>
          </div>
          <div className="cal-modal-footer-right">
            <button className="cal-modal-footer-btn cal-modal-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="cal-modal-footer-btn cal-modal-save-btn" onClick={onClose}>
              <Save size={15} />
              Save Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Day View ── */
function DayView({ activities, onEventClick }) {
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);
  const totalHeight = (HOUR_END - HOUR_START) * HOUR_HEIGHT;

  return (
    <div className="cal-day-view">
      <div className="cal-day-grid" style={{ height: totalHeight }}>
        <div className="cal-day-hours">
          {hours.map((h) => (
            <div key={h} className="cal-hour-label" style={{ height: HOUR_HEIGHT }}>
              <span>{formatHour(h)}</span>
            </div>
          ))}
        </div>
        <div className="cal-day-content" style={{ height: totalHeight }}>
          {hours.map((h) => (
            <div key={h} className="cal-hour-line" style={{ top: (h - HOUR_START) * HOUR_HEIGHT }} />
          ))}
          {activities.map((act, i) => (
            <div
              key={i}
              className="cal-event-block"
              onClick={() => onEventClick(act)}
              style={{
                top: timeToOffset(act.time),
                height: Math.max(durationToHeight(act.duration), 40),
                borderLeftColor: act.color,
              }}
            >
              <div className="cal-event-title">{act.title}</div>
              <div className="cal-event-meta">
                <Clock size={12} />
                {formatTimeRange(act.time, act.duration)}
              </div>
              {act.location && (
                <div className="cal-event-meta">
                  <MapPin size={12} />
                  {act.location}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Week View ── */
function WeekView({ dates, itinerary, onEventClick }) {
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  const getActivityAt = (date, hour) => {
    const activities = itinerary[date] || [];
    return activities.filter((act) => {
      const [ah, am] = act.time.split(':').map(Number);
      const startH = ah + am / 60;
      const endH = startH + act.duration;
      return hour >= startH && hour < endH;
    });
  };

  const isActivityStart = (act, hour) => {
    const [ah, am] = act.time.split(':').map(Number);
    const startH = ah + am / 60;
    return hour >= startH && hour < startH + 1;
  };

  return (
    <div className="cal-week-view">
      <div className="cal-week-grid">
        <div className="cal-week-header">
          <div className="cal-week-corner" />
          {dates.map((date) => {
            const { weekday, day } = getShortDayLabel(date);
            return (
              <div key={date} className="cal-week-col-header">
                <span className="cal-week-weekday">{weekday}</span>
                <span className="cal-week-day">{day}</span>
              </div>
            );
          })}
        </div>
        <div className="cal-week-body">
          {hours.map((h) => (
            <div key={h} className="cal-week-row" style={{ height: HOUR_HEIGHT }}>
              <div className="cal-week-hour-label">
                <span>{formatHour(h)}</span>
              </div>
              {dates.map((date) => {
                const acts = getActivityAt(date, h);
                return (
                  <div key={date} className="cal-week-cell">
                    {acts.map((act, i) =>
                      isActivityStart(act, h) ? (
                        <div
                          key={i}
                          className="cal-week-chip"
                          style={{ backgroundColor: act.color + '22', borderLeftColor: act.color, color: act.color }}
                          onClick={() => onEventClick(act)}
                        >
                          {act.title}
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="cal-week-chip cal-week-chip-cont"
                          style={{ backgroundColor: act.color + '12', borderLeftColor: act.color }}
                        />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Calendar ── */
function ItineraryCalendar({ tripTitle, destination }) {
  const allDates = Object.keys(SAMPLE_ITINERARY).sort();
  const [view, setView] = useState('day');
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const currentDate = allDates[currentDateIndex];
  const currentActivities = SAMPLE_ITINERARY[currentDate] || [];

  const prevDay = () => setCurrentDateIndex((i) => Math.max(0, i - 1));
  const nextDay = () => setCurrentDateIndex((i) => Math.min(allDates.length - 1, i + 1));

  return (
    <div className="cal-container">
      <div className="cal-header">
        <div className="cal-header-info">
          <h2 className="cal-trip-title">{tripTitle}</h2>
          <span className="cal-trip-dest">
            <MapPin size={14} />
            {destination}
          </span>
        </div>
        <div className="cal-header-controls">
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevDay} disabled={currentDateIndex === 0}>
              <ChevronLeft size={18} />
            </button>
            <span className="cal-nav-label">{getDateLabel(currentDate)}</span>
            <button className="cal-nav-btn" onClick={nextDay} disabled={currentDateIndex === allDates.length - 1}>
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="cal-view-toggle">
            <button
              className={`cal-view-btn ${view === 'day' ? 'active' : ''}`}
              onClick={() => setView('day')}
            >
              <CalendarDays size={16} />
              Day
            </button>
            <button
              className={`cal-view-btn ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
              <LayoutGrid size={16} />
              Week
            </button>
          </div>
        </div>
      </div>

      {view === 'day' && (
        <DayView activities={currentActivities} onEventClick={setSelectedEvent} />
      )}

      {view === 'week' && (
        <WeekView dates={allDates} itinerary={SAMPLE_ITINERARY} onEventClick={setSelectedEvent} />
      )}

      <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} currentDate={currentDate} />
    </div>
  );
}

export default ItineraryCalendar;
