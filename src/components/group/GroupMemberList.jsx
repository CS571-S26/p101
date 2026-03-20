import { useNavigate } from 'react-router-dom';

function GroupMemberList({ group, onRemoveMember }) {
  const navigate = useNavigate();

  return (
    <div className="group-detail-left">
      <div className="group-members-section">
        <h4 className="group-members-title">Members</h4>
        <div className="group-members-list">
          {group.members.map((member, i) => (
            <div key={i} className="group-member-row">
              <span className="group-member-avatar" style={{ background: group.color }}>
                {member.name.charAt(0).toUpperCase()}
              </span>
              <div className="group-member-info">
                <span className="group-member-name">{member.name}</span>
                <span className="group-member-email">{member.email}</span>
              </div>
              <span className={`group-member-role ${member.role === 'Admin' ? 'role-admin' : ''}`}>
                {member.role}
              </span>
              {member.role !== 'Admin' && (
                <button
                  className="group-member-remove"
                  onClick={() => onRemoveMember(group.id, member.email)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        className="group-plan-trip-btn"
        onClick={() => navigate('/trips/new')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
        </svg>
        Plan a Trip with this Group
      </button>
    </div>
  );
}

export default GroupMemberList;