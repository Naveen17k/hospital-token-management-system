import { useState, useEffect } from "react";
import axios from "axios";
import TokenGenerator from "./token-generator";
import RegistrationEnded from "./registration-ended";
import socket from "./socket-instance"; // Import your existing socket instance

const Home = () => {
  const [registrationActive, setRegistrationActive] = useState(true);

  useEffect(() => {
    socket.on("registrationStatus", (status) => {
      // Update registration status when WebSocket event is received
      setRegistrationActive(status);
    });

    return () => {
      // Clean up WebSocket connection
      socket.off("registrationStatus");
    };
  }, []);
  return (
    <div>{registrationActive ? <TokenGenerator /> : <RegistrationEnded />}</div>
  );
};

export default Home;
