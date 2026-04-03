import { useNavigate } from 'react-router-dom';
import { X, MapPin } from 'lucide-react';

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
                  <X size={14} />
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
        <MapPin size={18} />
        Plan a Trip with this Group
      </button>
    </div>
  );
}

export default GroupMemberList;