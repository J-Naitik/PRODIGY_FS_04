import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await API.get('/rooms');
      setRooms(data);
    })();
  }, []);

  const createRoom = async () => {
    if (!name.trim()) return;
    const { data } = await API.post('/rooms', { name, isPrivate: false });
    setRooms(prev => [data, ...prev]);
    setName('');
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    header: {
      textAlign: 'center',
      fontSize: '1.5rem',
      color: '#333'
    },
    inputContainer: {
      display: 'flex',
      gap: '8px'
    },
    input: {
      flexGrow: 1,
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px'
    },
    button: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s ease'
    },
    roomList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    roomItemButton: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      backgroundColor: '#fff',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'background-color 0.2s ease'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Rooms</h2>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Room name"
        />
        <button
          style={styles.button}
          onClick={createRoom}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Create
        </button>
      </div>

      <ul style={styles.roomList}>
        {rooms.map(r => (
          <li key={r._id}>
            <button
              style={styles.roomItemButton}
              onClick={() => navigate(`/room/${r._id}`)}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#e6f7ff'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              {r.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
