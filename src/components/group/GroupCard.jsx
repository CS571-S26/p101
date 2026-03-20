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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
            </svg>
            {group.trips} trips
          </span>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;