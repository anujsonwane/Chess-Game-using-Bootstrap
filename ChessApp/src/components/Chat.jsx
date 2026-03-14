import React, { useState } from 'react';

// simple chat panel placeholder
function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, time: new Date() }]);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-panel d-flex flex-column">
      <h5 className="mb-2">Chat</h5>
      <div className="flex-grow-1 overflow-auto mb-2" style={{ fontSize: '0.9rem' }}>
        {messages.map((m, idx) => (
          <div key={idx} className="mb-1">
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
              {m.time.toLocaleTimeString()}{' '}
            </span>
            {m.text}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Type message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary btn-sm" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
