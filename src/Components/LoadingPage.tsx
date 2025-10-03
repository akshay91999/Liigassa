// components/LoadingPage.tsx
"use client";

import { FC } from "react";
import Image from "next/image";


interface LoadingPageProps {
  message?: string;
}

const LoadingPage: FC<LoadingPageProps> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
      {/* Logo with bounce animation */}
      <div className="mb-6 animate-bounce">
        <Image src="/Ligassalogopng.png" alt="Ligassa Logo" width={120} height={120} />
      </div>

      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mb-4"></div>

      {/* Loading message */}
      <p className="text-white text-lg font-semibold">{message}</p>
    </div>
  );
};

export default LoadingPage;
