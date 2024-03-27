// TokenContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [currentTokenNumber, setCurrentTokenNumber] = useState(null);

  useEffect(() => {
    const fetchCurrentToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/current-token"
        );
        if (response.status === 200) {
          setCurrentTokenNumber(response.data.tokenNumber);
        } else {
          console.error("Failed to fetch current token");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const intervalId = setInterval(fetchCurrentToken, 5000); // Polling every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <TokenContext.Provider value={{ currentTokenNumber }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
