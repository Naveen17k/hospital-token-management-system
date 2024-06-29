// registraion-toggle-context.js
import React, { createContext, useContext, useState, useEffect } from "react";

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [registrationActive, setRegistrationActive] = useState(true);
  useEffect(() => {
    console.log("Registration Active:", registrationActive);
  }, [registrationActive]);
  return (
    <RegistrationContext.Provider
      value={{ registrationActive, setRegistrationActive }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
