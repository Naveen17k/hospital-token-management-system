import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiShutDownLine } from "react-icons/ri";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
import socket from "../socket-instance";
import ConfirmationDialog from "../confirmation-dialog";

export default function DoctorPanel() {
  const [tokensData, setTokensData] = useState([]);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [currentTokenNumber, setCurrentTokenNumber] = useState(null);
  const [callLaterTokens, setCallLaterTokens] = useState([]);
  const [orderedTokens, setOrderedTokens] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(false);

  const remainingTokensCount =
    orderedTokens.length + callLaterTokens.length - (currentTokenIndex + 1);

  const getNextTokenNumber = () => {
    if (currentTokenIndex < orderedTokens.length - 1) {
      return orderedTokens[currentTokenIndex + 1].tokenNumber;
    } else {
      const nextCallLaterToken = callLaterTokens.find(
        (token) => token.tokenNumber > currentTokenNumber
      );
      return nextCallLaterToken ? nextCallLaterToken.tokenNumber : "";
    }
  };

  const nextTokenNumber = getNextTokenNumber();

  const stats = [
    { id: 1, name: "Total Tokens :", value: tokensData.length },
    {
      id: 2,
      name: "Remaining Tokens :",
      value: remainingTokensCount >= 0 ? remainingTokensCount : 0,
    },
    {
      id: 3,
      name: "Next Token :",
      value: nextTokenNumber,
    },
  ];

  const toggleRegistration = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/toggle-registration");
      if (response.status === 200) {
        setRegistrationStatus(!registrationStatus);
      }
    } catch (error) {
      console.error("Error toggling registration:", error);
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tokens");
        if (response.status === 200) {
          const updatedTokens = response.data.map((token, index) => ({
            ...token,
            serialNumber: index + 1,
          }));
          setTokensData(updatedTokens);
          setOrderedTokens(updatedTokens);
          setCurrentTokenNumber(updatedTokens[0].tokenNumber);
        } else {
          console.error("Failed to fetch tokens");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchRegistrationStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/registration-status");
        if (response.status === 200) {
          setRegistrationStatus(response.data.status);
        } else {
          console.error("Failed to fetch registration status");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTokens();
    fetchRegistrationStatus();
  }, []);

  useEffect(() => {
    socket.emit("updateCurrentToken", currentTokenNumber);
  }, [currentTokenNumber]);

  const currentToken = orderedTokens[currentTokenIndex];

  const handleNextToken = () => {
    if (currentTokenIndex < orderedTokens.length - 1) {
      setCurrentTokenIndex((prevIndex) => prevIndex + 1);
      setCurrentTokenNumber(orderedTokens[currentTokenIndex + 1].tokenNumber);
    }
  };

  const handlePreviousToken = () => {
    if (currentTokenIndex > 0) {
      setCurrentTokenIndex((prevIndex) => prevIndex - 1);
      setCurrentTokenNumber(orderedTokens[currentTokenIndex - 1].tokenNumber);
    }
  };

  const handleCallLaterToken = () => {
    if (currentToken) {
      setCallLaterTokens([currentToken, ...callLaterTokens]);
      const updatedOrderedTokens = orderedTokens.filter(
        (token) => token !== currentToken
      );
      setOrderedTokens(updatedOrderedTokens);
      if (currentTokenIndex === orderedTokens.length - 1) {
        setCurrentTokenIndex((prevIndex) => prevIndex - 1);
      }
    }
  };

  const handleCallNowFromCallLater = (token) => {
    const updatedCallLaterTokens = callLaterTokens.filter((t) => t !== token);
    const updatedOrderedTokens = [
      ...orderedTokens.slice(0, currentTokenIndex + 1),
      token,
      ...orderedTokens.slice(currentTokenIndex + 1),
    ];
    setCallLaterTokens(updatedCallLaterTokens);
    setOrderedTokens(updatedOrderedTokens);
    setCurrentTokenNumber(token.tokenNumber);
    setCurrentTokenIndex(currentTokenIndex + 1);
  };

  const handleShutdownConfirmation = async () => {
    try {
      await axios.post("http://localhost:8080/api/toggle-registration");
      setRegistrationStatus(!registrationStatus);
    } catch (error) {
      console.error("Error toggling registration:", error);
    }
    setShowConfirmation(false);
  };

  const handleShutdownCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="bg-white">
      {/* Doctor Panel Header */}
      <div className="flex items-center justify-between bg-[#0C89E7] text-white font-semibold text-xl p-8">
        <h1 className="mx-auto inline-block">Dr. Johnson Clinic</h1>
        <button onClick={() => setShowConfirmation(true)}>
          <RiShutDownLine className="inline-block" />
        </button>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message={
            registrationStatus
              ? "Are you sure you want to end the token registration?"
              : "Are you sure you want to start the token registration?"
          }
          onConfirm={handleShutdownConfirmation}
          onCancel={handleShutdownCancel}
          isRegistrationActive={registrationStatus}
        />
      )}
      {/* Doctor Panel Content */}
      <div className="bg-white">
        {/* Stats Section */}
        <div className="mx-auto  px-6 lg:px-8">
          <div className="mx-auto w-full">
            <dl className="mt-10 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
              {/* Stats */}
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex  bg-[#dcdcdc] bg-opacity-40 p-8"
                >
                  <dt className="text-4xl mt-2  font-regular leading-6 text-black">
                    {stat.value}{" "}
                  </dt>
                  <dd className="ml-12 order-first text-4xl font-regular tracking-tight text-black">
                    {stat.name}&nbsp;
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {/* Current Token Section */}
        <div className="absolute grid-cols-1 ml-60">
          <div className="flex flex-col items-center">
            <h1 className="font-semibold text-5xl mt-12 mb-2 ml-2">
              Current Token
            </h1>
            <div className="flex items-center mb-2">
              <button
                onClick={handlePreviousToken}
                className="text-7xl font-normal mt-8 mr-4 flex-shrink-0"
              >
                <IoArrowBackCircleOutline />
              </button>
              <h1 className="text-7xl mt-8 font-semibold text-center w-20">
                {currentToken && currentToken.tokenNumber}
              </h1>
              <button
                onClick={handleNextToken}
                className="text-7xl font-normal mt-8 ml-4 flex-shrink-0"
              >
                <IoArrowForwardCircleOutline />
              </button>
            </div>
          </div>
          <div className="ml-2.5">
            <h1 className="  mt-7 font-semibold">
              Name:
              <span className="ml-2 font-normal">
                {currentToken && currentToken.name}
              </span>
            </h1>
            <h1 className=" mt-2 font-semibold">
              Age:
              <span className="ml-2 font-normal">
                {currentToken && currentToken.age}
              </span>
            </h1>

            <button
              onClick={handleCallLaterToken}
              className="bg-blue-500 items-center mx-auto block text-white px-8 py-2 rounded-md mt-6"
            >
              Call Later
            </button>
          </div>
          {/* Current Token Info */}
        </div>
      </div>
      {/* Token Table Section */}
      <div className="absolute right-0 px-4 w-1/2 sm:px-6 lg:px-8 overflow-hidden">
        <div className="sm:flex sm:items-center"></div>
        <div className="mt-8 flow-root overflow-x-auto">
          <div className="inline-block min-w-full py-2 text-center align-middle sm:px-6 lg:px-8">
            {/* Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto max-w-max h-[451px]  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <table className="min-w-full">
                <thead className="sticky top-0 z-10 bg-[#0C89E7] bg-opacity-90">
                  <tr className=" bg-[#0C89E7] bg-opacity-40">
                    <th
                      scope="col"
                      className="py-3.5 pl- pr- text-center text-sm font-semibold text-white w-1/3"
                    >
                      Token No
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-white w-1/3"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-white w-1/3"
                    >
                      Age
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-3 pr-6 text-center text-sm font-semibold text-white w-1/4" // Adjust width to fit the button
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0C89E7] bg-opacity-20 divide-y-2 divide-white">
                  {orderedTokens.map((token, index) => (
                    <tr
                      key={token.id}
                      className={
                        token === currentToken
                          ? "bg-[#0C89E7] bg-opacity-30"
                          : ""
                      }
                    >
                      <td className="py-4 pl-4 pr-3 text-center text-sm font-medium text-black sm:pl-3">
                        {token.tokenNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                        {token.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                        {token.age}
                      </td>
                      {/* Empty cell for the "Actions" column */}
                      <td></td>
                    </tr>
                  ))}
                  {/* Placeholder row for empty actions */}
                  <tr className="bg-[#0C89E7] bg-opacity-20"></tr>
                  {/* Display recalled tokens */}
                  {callLaterTokens.map((token, index) => (
                    <tr key={index}>
                      <td className="py-4 pl-4 pr-3 text-center text-sm font-medium text-black sm:pl-3">
                        {token.tokenNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                        {token.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                        {token.age}
                      </td>
                      {/* Call Now button */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-black">
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => handleCallNowFromCallLater(token)}
                            className="bg-[#0C89E7] text-white px-4 py-2 rounded-md"
                          >
                            Call Now
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
