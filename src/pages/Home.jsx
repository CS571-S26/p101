import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import HeroSection from '../components/HeroSection';
import AdventuresSection from '../components/AdventuresSection';
import NewTripModal from '../components/NewTripModal';
import { sampleTrips } from '../data/trips';
import './Home.css';
import './NewTrip.css';

function Home() {
  const navigate = useNavigate();
  const [trips] = useState(sampleTrips);
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [newTripData, setNewTripData] = useState(null);

  const handleTripClick = (trip) => {
    navigate('/trips/details', {
      state: {
        title: trip.title,
        destination: trip.destination,
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
