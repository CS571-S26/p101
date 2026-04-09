import { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import PlaceAutocomplete from './PlaceAutocomplete';

function TripSearchCard({ onStartPlan }) {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleClick = () => {
    onStartPlan({ destination: destination || '', startDate: date || '' });
  };

  return (
    <div className="search-card">
      <div className="search-card-row">
        <PlaceAutocomplete
          value={destination}
          onChange={setDestination}
          placeholder="Search destinations..."
          className="search-input-hero"
        />
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
        <button type="button" className="search-cta-btn" onClick={handleClick}>
          Start Planning
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default TripSearchCard;
