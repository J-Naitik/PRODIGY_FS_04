import React, { useState, useContext } from 'react';
import API from '../api/api';
import AuthContext from '../contexts/AuthContext';
import { connectSocket } from '../services/socket';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { username, password });
      login(data);
      connectSocket(data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // Inline styles
  const styles = {
    form: {
      maxWidth: '400px',
      margin: '80px auto',
      padding: '40px',
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    },
    heading: {
      textAlign: 'center',
      marginBottom: '24px',
      color: '#333'
    },
    input: {
      padding: '12px',
      marginBottom: '16px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px'
    },
    button: {
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    }
  };

  return (
    <form style={styles.form} onSubmit={submit}>
      <h2 style={styles.heading}>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />
      <button
        type="submit"
        style={styles.button}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#007bff'}
      >
        Login
      </button>
    </form>
  );
}
