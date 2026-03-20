import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatsHeader from '../components/StatsHeader';
import TripSection from '../components/TripSection';
import TripModal from '../components/TripModal';
import './Home.css';

function Home() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [editText, setEditText] = useState('');

  const activeTrips = trips.filter((t) => t.status === 'Active');
  const inPlanningTrips = trips.filter((t) => t.status === 'In-Planning');
  const plannedTrips = trips.filter((t) => t.status === 'Planned');

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
      setTrips(trips.filter((t) => t.id !== tripId));
      closeModal();
    }
  };

  const startEdit = (dayIndex, details) => {
    setEditingDay(dayIndex);
    setEditText(details);
  };

  const saveEdit = () => {
    const updated = { ...selectedTrip };
    updated.itinerary = updated.itinerary.map((item, i) =>
      i === editingDay ? { ...item, details: editText } : item
    );
    setSelectedTrip(updated);
    setTrips(trips.map((t) => (t.id === updated.id ? updated : t)));
    setEditingDay(null);
  };

  return (
    <div className="home-page">
      <Sidebar />

      <main className="home-main">
        <StatsHeader
          activeCount={activeTrips.length}
          inPlanningCount={inPlanningTrips.length}
          plannedCount={plannedTrips.length}
          travelerCount={trips.reduce((sum, t) => sum + t.members, 0)}
        />

        <TripSection
          title="Active Trips"
          dotClass="dot-active"
          trips={activeTrips}
          emptyMessage="You don't have any active trips right now. Time to start an adventure!"
          onTripClick={openModal}
        />

        <TripSection
          title="In-Planning"
          dotClass="dot-inplanning"
          trips={inPlanningTrips}
          emptyMessage="No trips in progress. Start planning your next getaway!"
          onTripClick={openModal}
        />

        <TripSection
          title="Planned Trips"
          dotClass="dot-planned"
          trips={plannedTrips}
          emptyMessage="No upcoming trips planned yet. You should plan one!"
          onTripClick={openModal}
        />
      </main>

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