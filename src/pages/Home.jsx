import { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import HeroSection from '../components/HeroSection';
import AdventuresSection from '../components/AdventuresSection';
import TripModal from '../components/TripModal';
import './Home.css';

const sampleTrips = [
  {
    id: 1,
    title: 'Trip to New York',
    dates: 'Apr 8 – Apr 15',
    startDate: '2026-04-08',
    endDate: '2026-04-15',
    travelers: 1,
    nights: 7,
    planTier: 'Voyago Free',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
    status: 'Active',
    members: [{ name: 'Shashwat', color: '#f97316' }],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in NYC', details: 'Check in hotel, Times Square walk' },
      { day: 'Day 2', title: 'Manhattan Tour', details: 'Central Park, MoMA, Broadway show' },
      { day: 'Day 3', title: 'Brooklyn Bridge', details: 'Walk across, DUMBO area, pizza' },
    ],
  },
  {
    id: 2,
    title: 'Trip to Delhi',
    dates: 'Apr 4 – Apr 15',
    startDate: '2026-04-04',
    endDate: '2026-04-15',
    travelers: 3,
    nights: 11,
    planTier: 'Voyago Free',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
    status: 'In-Planning',
    members: [
      { name: 'Shashwat', color: '#f97316' },
      { name: 'Sarah', color: '#22c55e' },
      { name: 'Zara', color: '#3b82f6' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Old Delhi', details: 'Red Fort, Chandni Chowk, street food tour' },
      { day: 'Day 2', title: 'New Delhi', details: 'India Gate, Lotus Temple, Qutub Minar' },
    ],
  },
];

function Home() {
  const [trips] = useState(sampleTrips);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [editText, setEditText] = useState('');

  const openModal = (trip) => {
    setSelectedTrip(trip);
    setEditingDay(null);
  };

  const closeModal = () => {
    setSelectedTrip(null);
    setEditingDay(null);
  };

  const handleDelete = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      closeModal();
    }
  };

  const startEdit = (dayIndex, details) => {
    setEditingDay(dayIndex);
    setEditText(details);
  };

  const saveEdit = () => {
    setEditingDay(null);
  };

  return (
    <div className="home-v2">
      <TopNavbar />
      <HeroSection />
      <AdventuresSection trips={trips} onTripClick={openModal} />

      <TripModal
        trip={selectedTrip}
        editingDay={editingDay}
        editText={editText}
        onClose={closeModal}
        onDelete={handleDelete}
        onStartEdit={startEdit}
        onEditTextChange={setEditText}
        onSaveEdit={saveEdit}
        onCancelEdit={() => setEditingDay(null)}
      />
    </div>
  );
}

export default Home;