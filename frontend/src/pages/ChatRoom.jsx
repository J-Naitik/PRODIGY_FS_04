import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getSocket, connectSocket } from '../services/socket';
import AuthContext from '../contexts/AuthContext';

export default function ChatRoom() {
  const { id } = useParams(); // room id
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);
    socket.emit('joinRoom', id);
    socket.emit('getRoomMessages', { roomId: id, limit: 200 });

    socket.on('roomMessages', msgs => setMessages(msgs));
    socket.on('newMessage', (msg) => setMessages(prev => [...prev, msg]));

    return () => {
      socket.emit('leaveRoom', id);
      socket.off('roomMessages');
      socket.off('newMessage');
    };
  }, [id, token]);

  const send = () => {
    const socket = getSocket();
    if (!text.trim()) return;
    socket.emit('sendMessage', { roomId: id, text });
    setText('');
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
      flexDirection: 'column'
    },
    header: {
      textAlign: 'center',
      marginBottom: '16px',
      fontSize: '1.5rem',
      color: '#333'
    },
    messages: {
      flexGrow: 1,
      maxHeight: '400px',
      overflowY: 'auto',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '12px',
      backgroundColor: '#fff'
    },
    message: {
      marginBottom: '10px',
      padding: '6px 8px',
      borderRadius: '6px',
      backgroundColor: '#e6f7ff'
    },
    sender: {
      fontWeight: 'bold',
      marginRight: '6px'
    },
    timestamp: {
      fontSize: '10px',
      color: '#888',
      marginTop: '2px'
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
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Room</h3>
      <div style={styles.messages}>
        {messages.map(m => (
          <div key={m._id} style={styles.message}>
            <span style={styles.sender}>{m.sender?.username || (m.sender && m.sender.username)}</span>
            <span>{m.text}</span>
            <div style={styles.timestamp}>{new Date(m.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Message..."
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
        />
        <button
          style={styles.button}
          onClick={send}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Send
        </button>
      </div>
    </div>
  );
}
