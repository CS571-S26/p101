import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

function TripSearchCard() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/trips/new', { state: { destination, startDate: date } });
  };

  return (
    <form className="search-card" onSubmit={handleSubmit}>
      <div className="search-card-row">
        <div className="search-input-group search-input-destination">
          <MapPin size={18} className="search-input-icon" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      <p className="search-hint">Planning a multi-stop trip? You can add more destinations later.</p>
      <div className="search-card-bottom">
        <div className="search-input-group search-input-date">
          <Calendar size={18} className="search-input-icon" />
          <input
            type="date"
            placeholder="Select dates"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="search-cta-btn">
          Start Planning
          <ChevronRight size={18} />
        </button>
      </div>
    </form>
  );
}

export default TripSearchCard;