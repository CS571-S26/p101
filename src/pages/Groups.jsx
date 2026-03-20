import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GroupCard from '../components/group/GroupCard';
import GroupMemberList from '../components/group/GroupMemberList';
import GroupChat from '../components/group/GroupChat';
import CreateGroupModal from '../components/group/CreateGroupModal';
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

const GROUP_COLORS = ['#90b8f8', '#34d399', '#f59e0b', '#f472b6', '#a78bfa'];

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(sampleGroups);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState({});

  const groupMessages = selectedGroup ? (messages[selectedGroup.id] || []) : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedGroup) return;
    const msg = {
      id: Date.now(),
      sender: 'You',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedGroup.id]: [...(prev[selectedGroup.id] || []), msg],
    }));
    setChatInput('');
  };

  const handleCreateGroup = (name, emails) => {
    const newGroup = {
      id: Date.now(),
      name,
      members: [
        { name: 'You', email: 'you@email.com', role: 'Admin' },
        ...emails.map((email) => ({ name: email.split('@')[0], email, role: 'Member' })),
      ],
      trips: 0,
      color: GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)],
    };
    setGroups([...groups, newGroup]);
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

        <div className="groups-layout">
          {/* Left: Group cards list */}
          <div className="groups-list">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isSelected={selectedGroup?.id === group.id}
                onClick={() => setSelectedGroup(group)}
              />
            ))}

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

                <div className="group-detail-split">
                  <GroupMemberList
                    group={selectedGroup}
                    onRemoveMember={handleRemoveMember}
                  />
                  <GroupChat
                    messages={groupMessages}
                    chatInput={chatInput}
                    onInputChange={setChatInput}
                    onSend={handleSendMessage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}

export default Groups;