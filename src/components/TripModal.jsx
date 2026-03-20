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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete Trip
          </button>
          <button className="modal-done-btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default TripModal;