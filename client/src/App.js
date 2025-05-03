import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Login from './components/login';

const socket = io('http://localhost:5000'); // Connect to the server

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, `${data.username}: ${data.message}`]);
    });

    // Listen for typing indicator
    socket.on('typing', (data) => {
      setTyping(data);
      setTimeout(() => setTyping(''), 2000); // Clear typing indicator after 2 seconds
    });

    return () => {
      socket.off('receive_message');
      socket.off('typing');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', { username, message });
      setMessage(''); // Clear the input field without appending the message locally
    }
  };

  const handleTyping = () => {
    socket.emit('typing', `${username} is typing...`);
  };

  if (!username) {
    return <Login setUsername={setUsername} />;
  }

  return (
    <div className="App">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.startsWith(username) ? 'right' : 'left'}`}
            >
              {msg}
            </div>
          ))}
        </div>
        {typing && <p className="typing-indicator">{typing}</p>}
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
