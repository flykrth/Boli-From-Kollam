"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Define TypeScript types
interface CityData {
  name: string;
  soilType: string;
  cropsGrown: string[];
  recommendations: string;
}

// Sample data for crop cultivation details
const cityData: Record<string, CityData> = {
  mumbai: {
    name: "Mumbai",
    soilType: "Alluvial Soil",
    cropsGrown: ["Rice", "Wheat", "Sugarcane"],
    recommendations:
      "Use drip irrigation for water efficiency. Rotate crops to maintain soil fertility.",
  },
  delhi: {
    name: "Delhi",
    soilType: "Loamy Soil",
    cropsGrown: ["Wheat", "Mustard", "Vegetables"],
    recommendations:
      "Practice crop rotation and use organic fertilizers to improve soil health.",
  },
  bangalore: {
    name: "Bangalore",
    soilType: "Red Soil",
    cropsGrown: ["Ragi", "Maize", "Coffee"],
    recommendations:
      "Use mulching to retain soil moisture. Plant shade trees for coffee cultivation.",
  },
};

export default function CropCultivationPage() {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  // Handle city selection
  const handleCityClick = (city: string) => {
    setSelectedCity(cityData[city]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#081c15] to-[#40916c] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-center text-[#F7FFF7] mb-8">
          Crop Cultivation in India
        </h1>

        {/* Interactive SVG Map */}
        <div className="relative">
          <svg
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            {/* Mumbai */}
            <path
              id="mumbai"
              d="M200,300 L250,350 L300,300 Z"
              fill="#4ECDC4"
              className="cursor-pointer hover:fill-[#1b4332] transition-colors duration-300"
              onClick={() => handleCityClick("mumbai")}
            />
            <text
              x="220"
              y="330"
              className="text-[#F7FFF7] text-sm cursor-pointer"
              onClick={() => handleCityClick("mumbai")}
            >
              Mumbai
            </text>

            {/* Delhi */}
            <path
              id="delhi"
              d="M400,200 L450,250 L500,200 Z"
              fill="#4ECDC4"
              className="cursor-pointer hover:fill-[#1b4332] transition-colors duration-300"
              onClick={() => handleCityClick("delhi")}
            />
            <text
              x="420"
              y="230"
              className="text-[#F7FFF7] text-sm cursor-pointer"
              onClick={() => handleCityClick("delhi")}
            >
              Delhi
            </text>

            {/* Bangalore */}
            <path
              id="bangalore"
              d="M300,500 L350,550 L400,500 Z"
              fill="#4ECDC4"
              className="cursor-pointer hover:fill-[#1b4332] transition-colors duration-300"
              onClick={() => handleCityClick("bangalore")}
            />
            <text
              x="320"
              y="530"
              className="text-[#F7FFF7] text-sm cursor-pointer"
              onClick={() => handleCityClick("bangalore")}
            >
              Bangalore
            </text>
          </svg>
        </div>

        {/* Side Panel for City Details */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-[#1A535C] p-8 shadow-lg border-l border-[#4ECDC4]/20 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Back Button */}
              <button
                className="text-[#F7FFF7] text-lg mb-4"
                onClick={() => setSelectedCity(null)}
              >
                &larr; Back
              </button>

              {/* Place Name */}
              <h2 className="text-2xl font-bold text-[#F7FFF7] mb-4">
                {selectedCity.name}
              </h2>

              {/* Soil Type */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#F7FFF7] mb-2">
                  Soil Type
                </h3>
                <p className="text-[#F7FFF7]">{selectedCity.soilType}</p>
              </div>

              {/* Crops Grown */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#F7FFF7] mb-2">
                  Crops Grown
                </h3>
                <ul className="list-disc list-inside text-[#F7FFF7]">
                  {selectedCity.cropsGrown.map((crop, index) => (
                    <li key={index}>{crop}</li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-xl font-bold text-[#F7FFF7] mb-2">
                  Recommendations
                </h3>
                <p className="text-[#F7FFF7]">{selectedCity.recommendations}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}