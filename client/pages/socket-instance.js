import socketIOClient from "socket.io-client";
import React, { useEffect } from "react";

const socket = socketIOClient("http://localhost:8080", {
  transports: ["websocket"],
});

const SocketWrapper = () => {
  useEffect(() => {
    console.log("Attempting to connect to the socket server...");

    socket.on("connect", () => {
      console.log("Socket connected successfully!");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  return null; // or any component if necessary
};

export default socket;
