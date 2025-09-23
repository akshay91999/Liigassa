// components/Footer.tsx
import React from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import LigassaLogo from "../../public/Ligassalogopng.png"; // adjust path to your logo

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-4 px-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left: Logo */}
        <div className="mb-4 md:mb-0">
          <img
            src={LigassaLogo.src}
            alt="Ligassa Logo"
            className="w-32"
          />
        </div>

        {/* Center: Description */}
        <div className="text-center max-w-md md:max-w-lg mb-4 md:mb-0">
          <p className="text-gray-400">
            The last tournament was crowned by <span className="text-white font-semibold">United FC Anthoor</span>. 
            Who will lift the trophy this time? Stay tuned for exciting updates!
          </p>
        </div>

        {/* Right: Social Links */}
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com/your_instagram_handle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-pink-500 transition-colors duration-300"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.facebook.com/your_facebook_handle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-blue-500 transition-colors duration-300"
          >
            <FaFacebook size={24} />
          </a>
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center mt-6 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Ligassa. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
