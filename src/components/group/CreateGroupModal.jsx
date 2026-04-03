import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { X } from 'lucide-react';

function CreateGroupModal({ onClose, onCreate }) {
  const [groupName, setGroupName] = useState('');
  const [memberEmails, setMemberEmails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const emails = memberEmails.split(',').map((s) => s.trim()).filter(Boolean);
    onCreate(groupName, emails);
    setGroupName('');
    setMemberEmails('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="group-modal" onClick={(e) => e.stopPropagation()}>
        <div className="group-modal-header">
          <h3>Create New Group</h3>
          <button className="group-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <Form onSubmit={handleSubmit} className="group-modal-form">
          <Form.Group className="mb-4">
            <Form.Label className="group-modal-label">Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. College Friends"
              className="group-modal-input"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
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
              value={memberEmails}
              onChange={(e) => setMemberEmails(e.target.value)}
            />
          </Form.Group>

          <div className="group-modal-actions">
            <Button
              variant="outline-light"
              className="group-modal-cancel"
              onClick={onClose}
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
  );
}

export default CreateGroupModal;