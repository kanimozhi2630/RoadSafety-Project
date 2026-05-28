module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected to Socket.io: ${socket.id}`);

    // Join a user-specific room
    socket.on('join_session', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`👤 Client ${socket.id} joined session room: ${userId}`);
      }
    });

    // Handle telemetry update from client simulator
    socket.on('vehicle_telemetry_update', (data) => {
      const { userId, telemetry } = data;
      if (userId) {
        // Broadcast to all clients in the user's room except sender
        socket.to(userId).emit('telemetry_update', telemetry);
      }
    });

    // Handle emergency SOS trigger
    socket.on('emergency_sos_trigger', (data) => {
      const { userId, emergency } = data;
      if (userId) {
        socket.to(userId).emit('sos_triggered', emergency);
        console.log(`🚨 SOS Triggered Event broadcasted for user: ${userId}`);
      }
    });

    // Handle risk scoring updates
    socket.on('risk_update', (data) => {
      const { userId, risk } = data;
      if (userId) {
        socket.to(userId).emit('risk_score_update', risk);
      }
    });

    // Handle accident detection events
    socket.on('accident_detected', (data) => {
      const { userId, accident } = data;
      if (userId) {
        socket.to(userId).emit('accident_event', accident);
        console.log(`💥 Accident Detected Event broadcasted for user: ${userId}`);
      }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected from Socket.io: ${socket.id}`);
    });
  });
};
