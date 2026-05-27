import AdventureTripCard from './AdventureTripCard';

function AdventuresSection({ trips, onTripClick, onDeleteTrip }) {
  return (
    <section className="adventures-section">
      <h2 className="adventures-title">Your Adventures</h2>
      <div className="adventures-row">
        {trips.map((trip) => (
          <AdventureTripCard
            key={trip.tid}
            trip={trip}
            onClick={() => onTripClick(trip)}
            onDelete={onDeleteTrip}
          />
        ))}
      </div>
    </section>
  );
}

export default AdventuresSection;