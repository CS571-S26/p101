function getBadgeClass(status) {
  if (status === 'Active') return 'badge-active';
  if (status === 'In-Planning') return 'badge-inplanning';
  return 'badge-planned';
}

function TripCard({ trip, onClick }) {
  return (
    <div className="trip-card" onClick={onClick}>
      <div
        className="trip-card-image"
        style={{ backgroundImage: `url(${trip.image})` }}
      >
        <span className={`trip-badge ${getBadgeClass(trip.status)}`}>
          {trip.status}
        </span>
      </div>
      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.title}</h3>
        <p className="trip-card-dates">{trip.dates}</p>
        <div className="trip-card-footer">
          <span className="trip-members">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
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