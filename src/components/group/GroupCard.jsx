import { MapPin } from 'lucide-react';

function GroupCard({ group, isSelected, onClick }) {
  return (
    <div
      className={`group-card ${isSelected ? 'group-card-selected' : ''}`}
      onClick={onClick}
    >
      <div className="group-card-accent" style={{ background: group.color }} />
      <div className="group-card-body">
        <div className="group-card-top">
          <h3 className="group-card-name">{group.name}</h3>
          <span className="group-card-badge">{group.members.length} members</span>
        </div>
        <div className="group-card-bottom">
          <div className="group-avatars">
            {group.members.slice(0, 4).map((m, i) => (
              <span key={i} className="group-avatar" style={{ background: group.color }}>
                {m.name.charAt(0).toUpperCase()}
              </span>
            ))}
            {group.members.length > 4 && (
              <span className="group-avatar group-avatar-more">
                +{group.members.length - 4}
              </span>
            )}
          </div>
          <span className="group-card-trips">
            <MapPin size={14} />
            {group.trips} trips
          </span>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;