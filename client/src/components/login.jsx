import React, { useState } from 'react';
import './login.css';

function Login({ setUsername }) {
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim()) {
      setUsername(name);
    }
  };

  return (
    <div className="login-container">
      <h2>Enter Your Username</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Username"
      />
      <button onClick={handleLogin}>Join Chat</button>
    </div>
  );
}

export default Login;