import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './Groups.css';

const sampleGroups = [
  {
    id: 1,
    name: 'College Friends',
    members: [
      { name: 'You', email: 'you@email.com', role: 'Admin' },
      { name: 'Alex Johnson', email: 'alex@email.com', role: 'Member' },
      { name: 'Sarah Lee', email: 'sarah@email.com', role: 'Member' },
    ],
    trips: 2,
    color: '#90b8f8',
  },
  {
    id: 2,
    name: 'Family Vacations',
    members: [
      { name: 'You', email: 'you@email.com', role: 'Admin' },
      { name: 'Mom', email: 'mom@email.com', role: 'Member' },
      { name: 'Dad', email: 'dad@email.com', role: 'Member' },
      { name: 'Sibling', email: 'sib@email.com', role: 'Member' },
    ],
    trips: 1,
    color: '#34d399',
  },
  {
    id: 3,
    name: 'Work Team',
    members: [
      { name: 'You', email: 'you@email.com', role: 'Member' },
      { name: 'Manager', email: 'manager@email.com', role: 'Admin' },
    ],
    trips: 0,
    color: '#f59e0b',
  },
];

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(sampleGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create group form state
  const [newGroupName, setNewGroupName] = useState('');
  const [newMemberEmails, setNewMemberEmails] = useState('');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const emails = newMemberEmails.split(',').map((s) => s.trim()).filter(Boolean);
    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      members: [
        { name: 'You', email: 'you@email.com', role: 'Admin' },
        ...emails.map((email) => ({ name: email.split('@')[0], email, role: 'Member' })),
      ],
      trips: 0,
      color: ['#90b8f8', '#34d399', '#f59e0b', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)],
    };
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setNewMemberEmails('');
    setShowCreateModal(false);
  };

  const handleRemoveMember = (groupId, email) => {
    setGroups(groups.map((g) => {
      if (g.id !== groupId) return g;
      return { ...g, members: g.members.filter((m) => m.email !== email) };
    }));
    if (selectedGroup && selectedGroup.id === groupId) {
      setSelectedGroup({
        ...selectedGroup,
        members: selectedGroup.members.filter((m) => m.email !== email),
      });
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter((g) => g.id !== groupId));
      setSelectedGroup(null);
    }
  };

  return (
    <div className="home-page">
      <Sidebar />

      <main className="home-main">
        <nav className="breadcrumbs">
          <span className="breadcrumb-item" onClick={() => navigate('/home')}>Home</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item breadcrumb-active">Groups</span>
        </nav>

        <div className="groups-header">
          <div>
            <h2 className="groups-page-title">Your Groups</h2>
            <p className="groups-page-subtitle">Manage your travel groups and members</p>
          </div>
          <button className="groups-create-btn" onClick={() => setShowCreateModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Group
          </button>
        </div>

        {/* Groups Grid */}
        <div className="groups-layout">
          {/* Left: Group cards */}
          <div className="groups-list">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`group-card ${selectedGroup?.id === group.id ? 'group-card-selected' : ''}`}
                onClick={() => setSelectedGroup(group)}
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
            ))}

            {/* Add group card */}
            <div className="group-card group-card-add" onClick={() => setShowCreateModal(true)}>
              <div className="group-card-add-content">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <span>Create New Group</span>
              </div>
            </div>
          </div>

          {/* Right: Selected group detail */}
          <div className="group-detail-panel">
            {!selectedGroup ? (
              <div className="group-detail-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3>Select a Group</h3>
                <p>Click on a group to view its members and details.</p>
              </div>
            ) : (
              <div className="group-detail-content">
                <div className="group-detail-header">
                  <div className="group-detail-title-row">
                    <div className="group-detail-icon" style={{ background: selectedGroup.color }}>
                      {selectedGroup.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="group-detail-name">{selectedGroup.name}</h3>
                      <p className="group-detail-meta">
                        {selectedGroup.members.length} members &middot; {selectedGroup.trips} trips
                      </p>
                    </div>
                  </div>
                  <button
                    className="group-delete-btn"
                    onClick={() => handleDeleteGroup(selectedGroup.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                <div className="group-members-section">
                  <h4 className="group-members-title">Members</h4>
                  <div className="group-members-list">
                    {selectedGroup.members.map((member, i) => (
                      <div key={i} className="group-member-row">
                        <span className="group-member-avatar" style={{ background: selectedGroup.color }}>
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
                            onClick={() => handleRemoveMember(selectedGroup.id, member.email)}
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
            )}
          </div>
        </div>
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="group-modal" onClick={(e) => e.stopPropagation()}>
            <div className="group-modal-header">
              <h3>Create New Group</h3>
              <button className="group-modal-close" onClick={() => setShowCreateModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <Form onSubmit={handleCreateGroup} className="group-modal-form">
              <Form.Group className="mb-4">
                <Form.Label className="group-modal-label">Group Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. College Friends"
                  className="group-modal-input"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="group-modal-label">Invite Members (emails, comma-separated)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="friend1@email.com, friend2@email.com"
                  className="group-modal-input group-modal-textarea"
                  value={newMemberEmails}
                  onChange={(e) => setNewMemberEmails(e.target.value)}
                />
              </Form.Group>

              <div className="group-modal-actions">
                <Button
                  variant="outline-light"
                  className="group-modal-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="outline-light" className="group-modal-submit">
                  Create Group
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;