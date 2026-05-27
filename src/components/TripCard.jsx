import { Users } from 'lucide-react';

function getBadgeClass(status) {
  if (status === 'Active') return 'badge-active';
  if (status === 'In-Planning') return 'badge-inplanning';
  return 'badge-planned';
}

function TripCard({ trip, onClick }) {
  return (
    <div className="trip-card" onClick={onClick}>
      <div className="trip-card-image">
        <img
          src={trip.image}
          alt={`${trip.title} destination`}
          className="trip-card-img"
        />
        <span className={`trip-badge ${getBadgeClass(trip.status)}`}>
          {trip.status}
        </span>
      </div>
      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.title}</h3>
        <p className="trip-card-dates">{trip.dates}</p>
        <div className="trip-card-footer">
          <span className="trip-members">
            <Users size={16} />
            {trip.members} members
          </span>
          <button className="trip-view-btn">View</button>
        </div>
      </div>
    </div>
  );
}

export { getBadgeClass };
export default TripCard;