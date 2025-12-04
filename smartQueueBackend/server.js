const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/queue", require("./routes/queueRoutes"));


// ✅ CREATE SERVER + SOCKET
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// ✅ SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected to socket");

  socket.on("tokenUpdated", () => {
    io.emit("refreshQueue"); // send update to all users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ START SERVER
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
