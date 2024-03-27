import socketIOClient from "socket.io-client";
import react from "react";
const socket = socketIOClient("http://localhost:8080", {
  transports: ["websocket"],
});

export default socket;
