import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PlusCircle, Users, Trash2 } from 'lucide-react';
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
            <Plus size={18} />
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
                <PlusCircle size={32} strokeWidth={1.5} />
                <span>Create New Group</span>
              </div>
            </div>
          </div>

          {/* Right: Selected group detail */}
          <div className="group-detail-panel">
            {!selectedGroup ? (
              <div className="group-detail-empty">
                <Users size={48} strokeWidth={1.2} />
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
                    <Trash2 size={16} />
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