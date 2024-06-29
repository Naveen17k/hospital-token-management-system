import React, { createContext, useState, useEffect } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokensData, setTokensData] = useState([]);

  const [currentTokenIndex, setCurrentTokenIndex] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const storedCurrentTokenIndex = localStorage.getItem("currentTokenIndex");
      return storedCurrentTokenIndex ? parseInt(storedCurrentTokenIndex) : 0;
    } else {
      return 0;
    }
  });

  const [currentTokenNumber, setCurrentTokenNumber] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const storedCurrentTokenNumber =
        localStorage.getItem("currentTokenNumber");
      return storedCurrentTokenNumber
        ? parseInt(storedCurrentTokenNumber)
        : null;
    } else {
      return null;
    }
  });

  const [callLaterTokens, setCallLaterTokens] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const storedCallLaterTokens = localStorage.getItem("callLaterTokens");
      return storedCallLaterTokens ? JSON.parse(storedCallLaterTokens) : [];
    } else {
      return [];
    }
  });

  const [orderedTokens, setOrderedTokens] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const storedOrderedTokens = localStorage.getItem("orderedTokens");
      return storedOrderedTokens ? JSON.parse(storedOrderedTokens) : [];
    } else {
      return [];
    }
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "currentTokenIndex",
        JSON.stringify(currentTokenIndex)
      );
    }
  }, [currentTokenIndex]);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "currentTokenNumber",
        JSON.stringify(currentTokenNumber)
      );
    }
  }, [currentTokenNumber]);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("callLaterTokens", JSON.stringify(callLaterTokens));
    }
  }, [callLaterTokens]);

  return (
    <TokenContext.Provider
      value={{
        tokensData,
        setTokensData,
        currentTokenIndex,
        setCurrentTokenIndex,
        currentTokenNumber,
        setCurrentTokenNumber,
        callLaterTokens,
        setCallLaterTokens,
        orderedTokens,
        setOrderedTokens,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export default TokenContext;
