import { X, Star, Trash2 } from 'lucide-react';
import { getBadgeClass } from './TripCard';

function TripModal({ trip, editingDay, editText, onClose, onDelete, onStartEdit, onEditTextChange, onSaveEdit, onCancelEdit }) {
  if (!trip) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          className="modal-hero"
          style={{ backgroundImage: `url(${trip.image})` }}
        >
          <div className="modal-hero-overlay">
            <button className="modal-close" onClick={onClose}>
              <X size={22} />
            </button>
            <div className="modal-hero-info">
              <span className={`trip-badge ${getBadgeClass(trip.status)}`}>
                {trip.status}
              </span>
              <h2 className="modal-title">{trip.title}</h2>
              <p className="modal-dates">{trip.dates} &middot; {trip.members} members</p>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="itinerary-header">
            <h3>
              <Star size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
              AI-Generated Itinerary
            </h3>
            <span className="itinerary-hint">Click any day to edit</span>
          </div>

          <div className="itinerary-timeline">
            {trip.itinerary.map((item, index) => (
              <div key={index} className="itinerary-item">
                <div className="itinerary-marker">
                  <span className="itinerary-dot" />
                  {index < trip.itinerary.length - 1 && <span className="itinerary-line" />}
                </div>
                <div className="itinerary-card">
                  <div className="itinerary-day">{item.day}</div>
                  <h4 className="itinerary-title">{item.title}</h4>
                  {editingDay === index ? (
                    <div className="itinerary-edit">
                      <textarea
                        className="itinerary-textarea"
                        value={editText}
                        onChange={(e) => onEditTextChange(e.target.value)}
                        rows={3}
                      />
                      <div className="itinerary-edit-actions">
                        <button className="edit-save-btn" onClick={onSaveEdit}>Save</button>
                        <button className="edit-cancel-btn" onClick={onCancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className="itinerary-details"
                      onClick={() => onStartEdit(index, item.details)}
                    >
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-delete-btn" onClick={() => onDelete(trip.id)}>
            <Trash2 size={16} />
            Delete Trip
          </button>
          <button className="modal-done-btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default TripModal;