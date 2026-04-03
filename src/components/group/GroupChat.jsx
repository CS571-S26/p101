import { MessageSquare, Send } from 'lucide-react';

function GroupChat({ messages, chatInput, onInputChange, onSend }) {
  return (
    <div className="group-detail-right">
      <div className="group-chat-header">
        <MessageSquare size={16} />
        <span>Group Chat</span>
      </div>

      <div className="group-chat-messages">
        {messages.length === 0 ? (
          <div className="group-chat-empty">
            <MessageSquare size={36} strokeWidth={1.2} />
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
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default GroupChat;