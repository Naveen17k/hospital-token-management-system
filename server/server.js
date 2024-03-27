const tokens = require("./routes/tokens");
const connection = require("./db");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  transports: ["websocket"], // Set WebSocket as the only transport
});

connection();

app.use(express.json());

// Apply CORS middleware
app.use(
  cors({
    origin: "*", // Update with your frontend URL
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/tokens", tokens);

io.on("connection", (socket) => {
  console.log("Client connected");

  let prevTokenNumber = null; // Initialize previous token number

  // Send current token number to clients when DoctorPanel updates
  socket.on("updateCurrentToken", (currentTokenNumber) => {
    if (currentTokenNumber !== prevTokenNumber) {
      io.emit("currentTokenNumber", currentTokenNumber);
      prevTokenNumber = currentTokenNumber; // Update previous token number
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
// server.js

// Add a state variable to track token registration status
let tokenRegistrationActive = true;

app.post("/api/toggle-registration", (req, res) => {
  tokenRegistrationActive = !tokenRegistrationActive;
  res.sendStatus(200);

  // Send updated registration status via WebSocket
  io.emit("registrationStatus", tokenRegistrationActive);
});

app.get("/api/registration-status", (req, res) => {
  res.json({ registrationActive: tokenRegistrationActive });
});

const port = 8080;
server.listen(port, () => console.log(`Listening on port ${port}`));
