import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import './PlaceAutocomplete.css';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

function PlaceAutocomplete({ value, onChange, placeholder, required, className }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [confirmed, setConfirmed] = useState(!!value);
  const timerRef = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
    setConfirmed(!!value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
        if (!confirmed) {
          setQuery('');
          onChange('');
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [confirmed, onChange]);

  const fetchSuggestions = async (text) => {
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: text,
        format: 'json',
        limit: '6',
        addressdetails: '1',
      });
      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: { 'Accept-Language': 'en' },
      });
      const data = await res.json();
      const seen = new Set();
      const unique = data.filter((item) => {
        const label = formatPlace(item);
        if (seen.has(label)) return false;
        seen.add(label);
        return true;
      });
      setSuggestions(unique.slice(0, 5));
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    setConfirmed(false);
    onChange('');
    setActiveIndex(-1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(text), 350);
    setShowDropdown(true);
  };

  const handleSelect = (place) => {
    const label = formatPlace(place);
    setQuery(label);
    setConfirmed(true);
    onChange(label);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      if (!confirmed) {
        setQuery('');
        onChange('');
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!confirmed && query) {
        setQuery('');
        onChange('');
      }
    }, 200);
  };

  return (
    <div className="place-autocomplete" ref={wrapperRef}>
      <div className="place-input-wrap">
        <input
          ref={inputRef}
          type="text"
          className={`form-control ${className || ''} ${confirmed ? 'place-confirmed' : ''}`}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (confirmed) {
              setQuery('');
              setConfirmed(false);
              onChange('');
              setSuggestions([]);
            } else if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          required={required}
          autoComplete="off"
        />
        {loading && (
          <span className="place-spinner">
            <Loader2 size={16} className="place-spin-icon" />
          </span>
        )}
        {confirmed && !loading && (
          <span className="place-check">
            <MapPin size={14} />
          </span>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="place-dropdown">
          {suggestions.map((place, i) => (
            <li
              key={place.place_id}
              className={`place-dropdown-item ${i === activeIndex ? 'active' : ''}`}
              onMouseDown={() => handleSelect(place)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <MapPin size={14} className="place-dropdown-icon" />
              <span className="place-dropdown-text">{formatPlace(place)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatPlace(place) {
  const addr = place.address || {};
  const parts = [];
  const city = addr.city || addr.town || addr.village || addr.municipality || '';
  const state = addr.state || '';
  const country = addr.country || '';
  if (city) parts.push(city);
  else if (place.display_name) {
    const first = place.display_name.split(',')[0]?.trim();
    if (first) parts.push(first);
  }
  if (state && state !== city) parts.push(state);
  if (country) parts.push(country);
  return parts.join(', ') || place.display_name;
}

export default PlaceAutocomplete;
