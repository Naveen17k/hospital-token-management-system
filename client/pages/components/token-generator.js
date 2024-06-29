import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useRegistration } from "../registration-toggle-context";

const TokenGenerator = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [tokenNumber, setTokenNumber] = useState(""); // State to store generated token
  const router = useRouter();
  const { registrationActive } = useRegistration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/tokens", {
        name,
        age,
      });
      if (response.status === 201) {
        // Update state with generated token number
        setTokenNumber(response.data.tokenNumber);

        // Redirect to IssueToken page with token number as query parameter
        router.push(`/issue-token?tokenNumber=${response.data.tokenNumber}`);
      } else {
        console.error("Failed to generate token");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  return (
    <div className="flex h-screen">
      {/* Left side with image and blue background */}
      <div className="w-1/2 bg-[#0C89E7] flex items-center justify-center relative">
        <img
          src="/Adobe_Express_20240223_1417090.4986739082110856.png"
          alt="Background"
          className="absolute -left-24 object-cover h-full w-full"
        />
        <h1 className="text-center ml-64  text-white font-semibold text-4xl ">
          Dr. Johnson&apos;s Clinic
        </h1>
      </div>

      {/* Right side with form content */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl text-[#0C89E7] font-bold mb-12 ">Welcome</h1>

        <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <label
              htmlFor="name"
              className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-[#0C89E7]"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name} // Bind value to state variable
              onChange={handleNameChange} // Update state on change
              className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400   sm:text-sm sm:leading-6"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="relative w-[364px] h-[54px]">
            <label
              htmlFor="age"
              className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-[#0C89E7]"
            >
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={age} // Bind value to state variable
              onChange={handleAgeChange} // Update state on change
              className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
              placeholder="Enter your age"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0C89E7] text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
          >
            Get Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default TokenGenerator;

// http://localhost:8080/api/tokens
