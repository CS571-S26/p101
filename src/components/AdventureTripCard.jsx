import { Calendar, Users } from 'lucide-react';
import AvatarGroup from './AvatarGroup';

function AdventureTripCard({ trip, onClick }) {
  const daysToGo = () => {
    if (!trip.startDate) return null;
    const diff = Math.ceil((new Date(trip.startDate) - new Date()) / 86400000);
    if (diff < 0) return null;
    return diff;
  };

  const days = daysToGo();

  return (
    <div className="adventure-card" onClick={onClick}>
      <div
        className="adventure-card-image"
        style={{ backgroundImage: `url(${trip.image})` }}
      >
        <div className="adventure-card-avatars">
          <AvatarGroup members={trip.members} max={3} size={30} />
        </div>
        {days !== null && (
          <div className="adventure-card-countdown">
            <Calendar size={14} />
            {days} days to go
          </div>
        )}
      </div>
      <div className="adventure-card-body">
        <h3 className="adventure-card-title">{trip.title}</h3>
        <div className="adventure-card-meta">
          <span className="adventure-card-dates">
            <Calendar size={14} />
            {trip.dates}
          </span>
          <span className="adventure-card-travelers">
            <Users size={14} />
            {trip.travelers} travelers
          </span>
        </div>
        <div className="adventure-card-footer">
          <span className="adventure-card-nights">{trip.nights} nights</span>
          <span className="adventure-card-tier">{trip.planTier}</span>
        </div>
      </div>
    </div>
  );
}

export default AdventureTripCard;