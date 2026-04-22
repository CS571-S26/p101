import { useState } from 'react';
import { Stack } from 'react-bootstrap';
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
      <Stack direction="horizontal" gap={3} className="search-card-bottom flex-wrap">
        <div className="search-input-group search-input-date flex-grow-1">
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
      </Stack>
    </div>
  );
}

export default TripSearchCard;
