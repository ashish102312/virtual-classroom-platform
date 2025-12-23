const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Support both Vite ports
    credentials: true,
  })
);

app.use(express.json());

/* ================= ROUTES ================= */
/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/polls", require("./routes/pollRoutes"));

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

/* ================= SERVER + SOCKET ================= */
const server = http.createServer(app);
const Message = require("./models/Message"); // Import Message model

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"], // Support both Vite ports
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join Class Room & WebRTC
  socket.on("joinClass", (classId) => {
    socket.join(classId);
    console.log(`User registered to class room: ${classId}`);

    // Get other users in room for WebRTC mesh
    const room = io.sockets.adapter.rooms.get(classId);
    const otherUsers = room ? Array.from(room).filter(id => id !== socket.id) : [];
    socket.emit("allUsers", otherUsers);
  });

  // WebRTC Signaling
  socket.on("sendingSignal", payload => {
    io.to(payload.userToSignal).emit('userJoined', { signal: payload.signal, callerID: payload.callerID });
  });

  socket.on("returningSignal", payload => {
    io.to(payload.callerID).emit('receivingReturnedSignal', { signal: payload.signal, id: socket.id });
  });

  // Whiteboard Signaling
  socket.on("draw", (data) => {
    socket.to(data.classId).emit("draw", data);
  });

  socket.on("clearBoard", (data) => {
    socket.to(data.classId).emit("clearBoard");
  });

  // Handle Send Message
  socket.on("sendMessage", async (data) => {
    const { classId, user, userName, userRole, text } = data;

    // Save to DB
    try {
      if (classId) {
        await Message.create({
          class: classId,
          user,
          userName,
          userRole,
          text,
        });
      }
    } catch (err) {
      console.error("Error saving message:", err);
    }

    // Emit to room
    if (classId) {
      io.to(classId).emit("receiveMessage", data);
    } else {
      // Fallback for global chat (if any)
      io.emit("receiveMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// make io available in controllers
app.set("io", io);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
