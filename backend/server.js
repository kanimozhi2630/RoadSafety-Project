const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express App
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for dev/simplicity
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 profile pictures

// Import Routes
const authRoutes = require('./routes/auth');
const telemetryRoutes = require('./routes/telemetry');
const emergencyRoutes = require('./routes/emergency');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/emergency', emergencyRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'LifeLink 2.0 Backend Server'
  });
});

// Initialize Sockets
require('./sockets/telemetrySocket')(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 LifeLink 2.0 Backend running on port ${PORT}`);
  console.log(`📡 Socket.io Server online & listening`);
  console.log(`==================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
});
