import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IssueToken({}) {
  const router = useRouter();
  const { tokenNumber } = router.query;

  return (
    <div className="flex h-screen">
      {/* Left side with image and blue background */}
      <div className="w-full bg-[#0C89E7] flex items-center justify-center relative">
        <img
          src="/Adobe_Express_20240225_0005450.2700230072970803.png"
          alt="Background"
          className="absolute -left-48 object-cover h-full w-1/2"
        />

        <div className="ml-56 mt-20 flex flex-col items-center">
          <h2 className="text-white font-medium text-8xl mb-8">Token Number</h2>
          <h1 className="text-white font-semibold text-9xl mb-8">
            {tokenNumber}
          </h1>
          <Link href="/">
            <img
              src="/back-button (2).png"
              alt="Back Button"
              className="w-16 h-16"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
