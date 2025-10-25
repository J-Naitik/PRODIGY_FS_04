import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login.js';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import ChatRoom from './pages/ChatRoom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('chat_token');
  return token ? children : <Navigate to="/login" />;
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<PrivateRoute><Rooms/></PrivateRoute>}/>
        <Route path="/room/:id" element={<PrivateRoute><ChatRoom/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
