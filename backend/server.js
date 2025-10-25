require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

// --- CORS Setup ---
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// --- Database Connection ---
connectDB(process.env.MONGO_URI).catch(err => { 
  console.error(err); 
  process.exit(1); 
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Helper: get user from token for sockets
function getUserFromToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  const user = getUserFromToken(token);
  if (!user) return next(new Error('Authentication error'));
  socket.user = user;
  next();
});

io.on('connection', (socket) => {
  console.log('user connected', socket.user.username, socket.id);

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('userJoined', { userId: socket.user.id, username: socket.user.username });
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('sendMessage', async ({ roomId, text, meta }) => {
    if (!roomId || !text) return;
    const msg = await Message.create({
      room: roomId,
      sender: socket.user.id,
      text,
      meta
    });

    const outMsg = {
      _id: msg._id,
      room: msg.room,
      text: msg.text,
      createdAt: msg.createdAt,
      sender: { id: socket.user.id, username: socket.user.username }
    };
    io.to(roomId).emit('newMessage', outMsg);
  });

  socket.on('getRoomMessages', async ({ roomId, limit = 50 }) => {
    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .populate('sender', 'username displayName');
    socket.emit('roomMessages', messages);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.user.username);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
