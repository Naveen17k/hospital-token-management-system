import React, { useState, useEffect } from "react";
import socket from "./socket-instance";

export default function DisplayToken() {
  const [currentTokenNumber, setCurrentTokenNumber] = useState(null);

  useEffect(() => {
    socket.on("currentTokenNumber", (currentTokenNumber) => {
      setCurrentTokenNumber(currentTokenNumber);
    });
    return () => {
      socket.off("currentTokenNumber");
    };
  }, []);

  return (
    <div
      className="flex justify-end items-right h-screen bg-cover"
      style={{
        backgroundImage: "url('/[GetPaidStock.com]-65d83f15a7c9b.jpg')",
      }}
    >
      {/* Overlay with text */}

      <div className="text-black ">
        <h1 className="text-7xl mr-44 mt-12 font-semibold">
          Token Number{" "}
          <span className="text-9xl font-bold">{currentTokenNumber}</span>
        </h1>
        <p className="mt-4 text-lg"></p>
      </div>
    </div>
  );
}
