import AdventureTripCard from './AdventureTripCard';

function AdventuresSection({ trips, onTripClick }) {
  return (
    <section className="adventures-section">
      <h2 className="adventures-title">Your Adventures</h2>
      <div className="adventures-row">
        {trips.map((trip) => (
          <AdventureTripCard
            key={trip.id}
            trip={trip}
            onClick={() => onTripClick(trip)}
          />
        ))}
      </div>
    </section>
  );
}

export default AdventuresSection;