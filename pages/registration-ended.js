import React from "react";

export default function RegistrationEnded() {
  return (
    <div className="flex h-screen">
      {/* Left side with image and blue background */}
      <div className="w-full bg-[#0C89E7] flex items-center justify-center relative">
        <img
          src="/Adobe_Express_20240223_1351320.7766580957291365.png"
          alt="Background"
          className="absolute -left-12 object-cover h-full w-1/2"
        />

        <div className="ml-56 mt-20 flex flex-col items-center">
          <h2 className="text-white font-medium text-7xl mb-8">
            Token Registration{" "}
          </h2>
          <h1 className="text-white font-semibold text-7xl mb-8">Ended</h1>
        </div>
      </div>
    </div>
  );
}
