import { useState, useRef, useEffect } from 'react';
import { Row, Col, Stack } from 'react-bootstrap';
import {
  ChevronLeft, ChevronRight, CalendarDays, LayoutGrid,
  MapPin, Clock, X, Navigation, StickyNote, Tag,
  Home, Plane, Utensils, Camera, Car, Users, Scissors,
  Flag, CheckSquare, Copy, Trash2, Save,
  Bold, Italic, Underline, List, ListOrdered, ListChecks,
  ArrowRight, Globe, MessageCircle, Send, Sparkles, Plus,
  Pencil,
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

const CHAT_SUGGESTIONS = [
  { icon: Utensils, text: 'Best restaurants nearby', category: 'food' },
  { icon: Plane, text: 'Find flights to this destination', category: 'flight' },
  { icon: Camera, text: 'Top attractions to visit', category: 'sightseeing' },
  { icon: Home, text: 'Recommend places to stay', category: 'stay' },
];

const MOCK_RESPONSES = {
  food: [
    { name: 'Karim\'s', desc: 'Legendary Mughlai cuisine since 1913. Famous for seekh kebabs and mutton burra.', time: '7:00 PM - 9:00 PM', location: 'Jama Masjid Area' },
    { name: 'Indian Accent', desc: 'Award-winning modern Indian fine dining. Innovative tasting menus.', time: '8:00 PM - 10:00 PM', location: 'The Lodhi Hotel' },
    { name: 'Paranthe Wali Gali', desc: 'Historic street famous for stuffed paranthas since the 1870s.', time: '9:00 AM - 12:00 PM', location: 'Chandni Chowk' },
  ],
  flight: [
    { name: 'Air India AI-302', desc: 'Direct flight. Economy from $450, Business from $1,200.', time: 'Departs 6:30 AM', location: 'JFK → DEL' },
    { name: 'Emirates EK-510', desc: 'Via Dubai. Premium economy from $680. Excellent service.', time: 'Departs 10:15 PM', location: 'JFK → DXB → DEL' },
  ],
  sightseeing: [
    { name: 'Red Fort', desc: 'UNESCO World Heritage Site. Iconic Mughal architecture and light show in evenings.', time: '9:30 AM - 12:00 PM', location: 'Old Delhi' },
    { name: 'Humayun\'s Tomb', desc: 'Precursor to the Taj Mahal. Stunning Mughal gardens at sunset.', time: '3:00 PM - 5:30 PM', location: 'Nizamuddin' },
    { name: 'Qutub Minar', desc: 'Tallest brick minaret in the world. Also see the Iron Pillar.', time: '10:00 AM - 12:30 PM', location: 'Mehrauli' },
  ],
  stay: [
    { name: 'The Lodhi', desc: '5-star luxury with private plunge pools. Excellent spa and fine dining.', time: 'Check-in 2 PM', location: 'Lodhi Road' },
    { name: 'Zostel Delhi', desc: 'Modern hostel in South Delhi. Great for solo travelers. From $15/night.', time: 'Check-in 1 PM', location: 'Hauz Khas' },
  ],
};

function ChatBotTab({ destination }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I'm your Voyago travel assistant. I can help you find restaurants, flights, attractions, and stays for your trip to **${destination || 'your destination'}**. What are you looking for?` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const detectCategory = (text) => {
    const lower = text.toLowerCase();
    if (/eat|food|restaurant|dinner|lunch|breakfast|cuisine/i.test(lower)) return 'food';
    if (/flight|fly|airline|airport/i.test(lower)) return 'flight';
    if (/see|visit|attraction|sightse|monument|temple|museum|tour/i.test(lower)) return 'sightseeing';
    if (/stay|hotel|hostel|accomm|lodge|airbnb/i.test(lower)) return 'stay';
    return null;
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: text.trim() }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const cat = detectCategory(text);
      const results = cat ? MOCK_RESPONSES[cat] : null;

      if (results) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          text: `Here are my top recommendations:`,
          suggestions: results,
          category: cat,
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          text: `I can help you find **restaurants**, **flights**, **attractions**, or **places to stay**. Try asking something like "Best places to eat near Old Delhi" or "Find flights from New York".`,
        }]);
      }
      setTyping(false);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderMarkdown = (text) =>
    text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chatbot-msg ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="chatbot-avatar-wrap">
                <span className="chatbot-avatar"><Sparkles size={14} /></span>
              </div>
            )}
            <div className="chatbot-bubble-wrap">
              <div className={`chatbot-bubble chatbot-bubble-${msg.role}`}>
                <p dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                {msg.suggestions && (
                  <div className="chatbot-suggestions-list">
                    {msg.suggestions.map((s, j) => (
                      <div key={j} className="chatbot-suggestion-card">
                        <div className="chatbot-suggestion-header">
                          <strong>{s.name}</strong>
                          <button className="chatbot-add-btn" title="Add to itinerary">
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="chatbot-suggestion-desc">{s.desc}</p>
                        <div className="chatbot-suggestion-meta">
                          <span><Clock size={12} /> {s.time}</span>
                          <span><MapPin size={12} /> {s.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="chatbot-msg assistant">
            <div className="chatbot-avatar-wrap">
              <span className="chatbot-avatar"><Sparkles size={14} /></span>
            </div>
            <div className="chatbot-bubble-wrap">
              <div className="chatbot-bubble chatbot-bubble-assistant">
                <div className="chatbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chatbot-quick-actions">
        {CHAT_SUGGESTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <button key={i} className="chatbot-quick-btn" onClick={() => sendMessage(s.text)}>
              <Icon size={14} /> {s.text}
            </button>
          );
        })}
      </div>

      <form className="chatbot-input-bar" onSubmit={handleSubmit}>
        <input
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about restaurants, flights, attractions..."
        />
        <button className="chatbot-send-btn" type="submit" disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function EventDetailPanel({ event, onClose, currentDate, destination }) {
  const [closing, setClosing] = useState(false);
  const [modalTab, setModalTab] = useState('edit');
  const [eventType, setEventType] = useState('event');
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState([...SAMPLE_MEMBERS]);
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/\//g, '/'));
  const descRef = useRef(null);
  const prevEventRef = useRef(null);

  if (event && event !== prevEventRef.current) {
    prevEventRef.current = event;
    const typeId = EVENT_TYPES.find((t) => t.id === (event.category || 'event').toLowerCase())?.id || 'event';
    if (eventType !== typeId) setEventType(typeId);
    if (title !== event.title) setTitle(event.title);
    if (location !== (event.location || '')) setLocation(event.location || '');
    if (description !== (event.notes || '')) setDescription(event.notes || '');
  }

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300);
  };

  if (!event && !closing) return null;

  const { startDT, endDT } = computeDateTime(currentDate, event?.time || '08:00', event?.duration || 1);
  const activeType = EVENT_TYPES.find((t) => t.id === eventType) || EVENT_TYPES[0];

  const removeMember = (idx) => setMembers((m) => m.filter((_, i) => i !== idx));

  const execFormat = (cmd) => {
    document.execCommand(cmd, false, null);
    descRef.current?.focus();
  };

  return (
    <div className={`cal-detail-backdrop ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`cal-drawer ${closing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Top Tab Bar */}
        <div className="cal-modal-tabs">
          <button
            className={`cal-modal-tab ${modalTab === 'edit' ? 'active' : ''}`}
            onClick={() => setModalTab('edit')}
          >
            <Pencil size={16} />
            Edit Event
          </button>
          <button
            className={`cal-modal-tab ${modalTab === 'chat' ? 'active' : ''}`}
            onClick={() => setModalTab('chat')}
          >
            <MessageCircle size={16} />
            ChatBot
            <span className="cal-modal-tab-badge"><Sparkles size={10} /></span>
          </button>
          <div className="cal-modal-tabs-spacer" />
          <button className="cal-modal-close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {modalTab === 'edit' ? (
          <>
            {/* Edit Event Header */}
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

              <div className="cal-modal-section">
                <h4 className="cal-modal-section-title">
                  <CalendarDays size={16} className="cal-modal-section-icon" style={{ color: '#f97316' }} />
                  When
                </h4>
                <Row className="g-2 align-items-center cal-modal-when-row">
                  <Col sm={5}>
                    <Row className="g-2">
                      <Col xs={7}>
                        <input className="cal-modal-input w-100" value={startDT} readOnly />
                      </Col>
                      <Col xs={5}>
                        <select className="cal-modal-select w-100" value={timezone} readOnly>
                          <option>{timezone}</option>
                        </select>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={2} className="text-center">
                    <span className="cal-modal-when-arrow"><ArrowRight size={16} /></span>
                  </Col>
                  <Col sm={5}>
                    <Row className="g-2">
                      <Col xs={7}>
                        <input className="cal-modal-input w-100" value={endDT} readOnly />
                      </Col>
                      <Col xs={5}>
                        <select className="cal-modal-select w-100" value={timezone} readOnly>
                          <option>{timezone}</option>
                        </select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
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

            <Stack direction="horizontal" gap={2} className="cal-modal-footer flex-wrap justify-content-between">
              <Stack direction="horizontal" gap={2}>
                <button className="cal-modal-footer-btn cal-modal-delete-btn">
                  <Trash2 size={15} /> Delete
                </button>
                <button className="cal-modal-footer-btn cal-modal-dup-btn">
                  <Copy size={15} /> Duplicate
                </button>
              </Stack>
              <Stack direction="horizontal" gap={2}>
                <button className="cal-modal-footer-btn cal-modal-cancel-btn" onClick={handleClose}>Cancel</button>
                <button className="cal-modal-footer-btn cal-modal-save-btn" onClick={handleClose}>
                  <Save size={15} /> Save Event
                </button>
              </Stack>
            </Stack>
          </>
        ) : (
          <ChatBotTab destination={destination} />
        )}
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

      <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} currentDate={currentDate} destination={destination} />
    </div>
  );
}

export default ItineraryCalendar;
