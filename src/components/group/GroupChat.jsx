function GroupChat({ messages, chatInput, onInputChange, onSend }) {
  return (
    <div className="group-detail-right">
      <div className="group-chat-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Group Chat</span>
      </div>

      <div className="group-chat-messages">
        {messages.length === 0 ? (
          <div className="group-chat-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.sender === 'You' ? 'chat-bubble-self' : ''}`}>
              <div className="chat-bubble-header">
                <span className="chat-bubble-sender">{msg.sender}</span>
                <span className="chat-bubble-time">{msg.time}</span>
              </div>
              <p className="chat-bubble-text">{msg.text}</p>
            </div>
          ))
        )}
      </div>

      <form className="group-chat-input-bar" onSubmit={onSend}>
        <input
          type="text"
          className="group-chat-input"
          placeholder="Type a message..."
          value={chatInput}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <button type="submit" className="group-chat-send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default GroupChat;