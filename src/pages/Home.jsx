import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import HeroSection from '../components/HeroSection';
import AdventuresSection from '../components/AdventuresSection';
import NewTripModal from '../components/NewTripModal';
import './Home.css';
import './NewTrip.css';

const sampleTrips = [
  {
    id: 1,
    title: 'Trip to New York',
    dates: 'Apr 8 – Apr 15',
    startDate: '2026-04-08',
    endDate: '2026-04-15',
    travelers: 1,
    nights: 7,
    planTier: 'Voyago Sample',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
    status: 'Active',
    members: [{ name: 'Shashwat', color: '#f97316' }],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in NYC', details: 'Check in hotel, Times Square walk' },
      { day: 'Day 2', title: 'Manhattan Tour', details: 'Central Park, MoMA, Broadway show' },
      { day: 'Day 3', title: 'Brooklyn Bridge', details: 'Walk across, DUMBO area, pizza' },
    ],
  }
];

function Home() {
  const navigate = useNavigate();
  const [trips] = useState(sampleTrips);
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [newTripData, setNewTripData] = useState(null);

  const handleTripClick = (trip) => {
    navigate('/trips/details', {
      state: {
        title: trip.title,
        destination: trip.title.replace('Trip to ', ''),
        startDate: trip.startDate,
        endDate: trip.endDate,
        numPeople: trip.travelers,
        members: trip.members,
        image: trip.image,
        planTier: trip.planTier,
      },
    });
  };

  const handleStartPlan = (data) => {
    setNewTripData(data);
    setNewTripOpen(true);
  };

  return (
    <div className="home-v2">
      <TopNavbar />
      <HeroSection onStartPlan={handleStartPlan} />
      <AdventuresSection trips={trips} onTripClick={handleTripClick} />

      <NewTripModal
        isOpen={newTripOpen}
        onClose={() => setNewTripOpen(false)}
        initialData={newTripData}
      />
    </div>
  );
}

export default Home;
