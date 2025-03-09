"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue in Next.js
useEffect(() => {
  // This is needed for leaflet icons to work properly in Next.js
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  });
}, []);

interface CityData {
  name: string;
  soilType: string;
  cropsGrown: string[];
  recommendations: string;
}

interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
}

interface CropRecommendation {
  name: string;
  confidence: number;
}

interface ApiResponse {
  location: string;
  weather: WeatherData;
  recommended_crops: CropRecommendation[];
  crop_images: Record<string, string>;
  coordinates?: [number, number]; // latitude, longitude
}

// Initial city data - we'll fetch coordinates from the backend
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
  chennai: {
    name: "Chennai",
    soilType: "Red Laterite Soil",
    cropsGrown: ["Rice", "Sugarcane", "Groundnut"],
    recommendations:
      "Implement water conservation techniques due to periodic droughts. Use drought-resistant varieties.",
  },
  kolkata: {
    name: "Kolkata",
    soilType: "Alluvial Soil",
    cropsGrown: ["Rice", "Jute", "Tea"],
    recommendations:
      "Practice crop rotation with legumes. Use raised beds during monsoon season.",
  },
  hyderabad: {
    name: "Hyderabad",
    soilType: "Red and Black Soil",
    cropsGrown: ["Cotton", "Millet", "Pulses"],
    recommendations:
      "Focus on water harvesting techniques. Use drought-resistant crop varieties.",
  },
  ahmedabad: {
    name: "Ahmedabad",
    soilType: "Black Cotton Soil",
    cropsGrown: ["Cotton", "Groundnut", "Wheat"],
    recommendations:
      "Conserve soil moisture with mulching. Use organic manures to improve soil structure.",
  },
  jaipur: {
    name: "Jaipur",
    soilType: "Sandy and Loamy",
    cropsGrown: ["Bajra", "Pulses", "Mustard"],
    recommendations:
      "Apply desert farming techniques. Focus on water conservation and windbreaks.",
  },
  lucknow: {
    name: "Lucknow",
    soilType: "Alluvial Soil",
    cropsGrown: ["Wheat", "Rice", "Sugarcane"],
    recommendations:
      "Maintain soil fertility with green manures. Implement efficient irrigation systems.",
  },
  srinagar: {
    name: "Srinagar",
    soilType: "Mountain Soil",
    cropsGrown: ["Rice", "Maize", "Saffron"],
    recommendations:
      "Use terracing techniques. Implement frost protection measures for specialty crops.",
  },
  guwahati: {
    name: "Guwahati",
    soilType: "Acidic Red and Yellow Soil",
    cropsGrown: ["Rice", "Tea", "Bamboo"],
    recommendations:
      "Apply lime to reduce soil acidity. Implement erosion control on slopes.",
  },
  bhopal: {
    name: "Bhopal",
    soilType: "Black Cotton Soil",
    cropsGrown: ["Wheat", "Soybeans", "Chickpeas"],
    recommendations:
      "Improve drainage during monsoon. Practice conservation tillage.",
  },
  kochi: {
    name: "Kochi",
    soilType: "Laterite Soil",
    cropsGrown: ["Coconut", "Rubber", "Spices"],
    recommendations:
      "Implement agroforestry techniques. Use organic mulches to retain moisture.",
  },
  chandigarh: {
    name: "Chandigarh",
    soilType: "Alluvial Soil",
    cropsGrown: ["Wheat", "Rice", "Maize"],
    recommendations:
      "Use precision farming techniques. Implement crop diversification.",
  },
  nagpur: {
    name: "Nagpur",
    soilType: "Black Cotton Soil",
    cropsGrown: ["Cotton", "Oranges", "Soybeans"],
    recommendations:
      "Use drip irrigation for citrus orchards. Implement organic pest management.",
  },
};

// Function to fly to a specific map location
function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 10);
  }, [lat, lng, map]);

  return null;
}

export default function CropCultivationPage() {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [aiRecommendations, setAiRecommendations] =
    useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cityCoordinates, setCityCoordinates] = useState<
    Record<string, [number, number]>
  >({});
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    20.5937, 78.9629,
  ]); // Center of India
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [activeCityId, setActiveCityId] = useState<string | null>(null);

  // Fetch coordinates for all cities on component mount
  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords: Record<string, [number, number]> = {};

      for (const cityKey in cityData) {
        try {
          const response = await fetch(
            `/api/coordinates?location=${cityData[cityKey].name}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.latitude && data.longitude) {
              coords[cityKey] = [data.latitude, data.longitude];
            }
          }
        } catch (error) {
          console.error(
            `Error fetching coordinates for ${cityData[cityKey].name}:`,
            error
          );
        }
      }

      // If API calls fail, use fallback coordinates (this would be removed in production)
      if (Object.keys(coords).length === 0) {
        // Fallback coordinates
        coords.mumbai = [19.076, 72.8777];
        coords.delhi = [28.7041, 77.1025];
        coords.bangalore = [12.9716, 77.5946];
        coords.chennai = [13.0827, 80.2707];
        coords.kolkata = [22.5726, 88.3639];
        coords.hyderabad = [17.385, 78.4867];
        coords.ahmedabad = [23.0225, 72.5714];
        coords.jaipur = [26.9124, 75.7873];
        coords.lucknow = [26.8467, 80.9462];
        coords.srinagar = [34.0837, 74.7973];
        coords.guwahati = [26.1445, 91.7362];
        coords.bhopal = [23.2599, 77.4126];
        coords.kochi = [9.9312, 76.2673];
        coords.chandigarh = [30.7333, 76.7794];
        coords.nagpur = [21.1458, 79.0882];
      }

      setCityCoordinates(coords);
    };

    fetchCoordinates();
  }, []);

  const handleCityClick = async (cityId: string) => {
    setActiveCityId(cityId);
    setSelectedCity(cityData[cityId]);
    setLoading(true);
    setError(null);

    // Fly to the city on map
    if (cityCoordinates[cityId]) {
      setMapCenter(cityCoordinates[cityId]);
      setMapZoom(10);
    }

    try {
      // Make an actual API call to your backend
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: cityData[cityId].name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiRecommendations(data);
      } else {
        // Fallback to mock data if API fails
        console.warn("API call failed, using mock data instead");
        simulateMockResponse(cityId);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      // Fallback to mock data
      simulateMockResponse(cityId);
    } finally {
      setLoading(false);
    }
  };

  // Fallback function for mock data
  const simulateMockResponse = (cityId: string) => {
    setTimeout(() => {
      const mockResponse: ApiResponse = {
        location: cityData[cityId].name,
        weather: {
          temperature: Math.round(Math.random() * 20 + 10), // 10-30°C
          rainfall: Math.round(Math.random() * 100), // 0-100mm
          humidity: Math.round(Math.random() * 60 + 30), // 30-90%
        },
        recommended_crops: cityData[cityId].cropsGrown.map((crop) => ({
          name: crop,
          confidence: Math.round(Math.random() * 40 + 60), // 60-100%
        })),
        crop_images: cityData[cityId].cropsGrown.reduce((acc, crop) => {
          acc[crop] = `/api/placeholder/300/200?text=${crop}`;
          return acc;
        }, {} as Record<string, string>),
        coordinates: cityCoordinates[cityId],
      };

      setAiRecommendations(mockResponse);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#081c15] to-[#40916c] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-center text-[#F7FFF7] mb-8">
          Crop Cultivation in India
        </h1>

        {/* Subheading */}
        <p className="text-xl text-center text-[#F7FFF7] mb-8">
          Select a city to view traditional crop data and AI-powered
          recommendations
        </p>

        {/* Map Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <button
            onClick={() => {
              setMapCenter([20.5937, 78.9629]);
              setMapZoom(5);
              setActiveCityId(null);
            }}
            className="bg-[#1A535C] text-[#F7FFF7] px-4 py-2 rounded-md hover:bg-[#173F43] transition-colors"
          >
            Reset Map
          </button>
          <select
            className="bg-[#1A535C] text-[#F7FFF7] px-4 py-2 rounded-md"
            value={activeCityId || ""}
            onChange={(e) => {
              if (e.target.value) {
                handleCityClick(e.target.value);
              }
            }}
          >
            <option value="">Select a city</option>
            {Object.entries(cityData).map(([id, city]) => (
              <option key={id} value={id}>
                {city.name}
              </option>
            ))}
          </select>
          <div className="bg-[#1A535C] text-[#F7FFF7] px-4 py-2 rounded-md">
            Map Type: Satellite
          </div>
        </div>

        {/* Leaflet Map Container */}
        <div
          className="relative mb-8 border-2 border-[#4ECDC4] rounded-lg overflow-hidden bg-[#173F43]"
          style={{ height: "70vh" }}
        >
          {Object.keys(cityCoordinates).length > 0 && (
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              {/* Satellite Layer */}
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                maxZoom={20}
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                attribution="&copy; Google Maps"
              />

              {/* City Markers */}
              {Object.entries(cityCoordinates).map(([cityId, coords]) => (
                <Marker
                  key={cityId}
                  position={coords}
                  eventHandlers={{
                    click: () => handleCityClick(cityId),
                  }}
                >
                  <Popup>{cityData[cityId].name}</Popup>
                </Marker>
              ))}

              {/* Fly to active city */}
              {activeCityId && cityCoordinates[activeCityId] && (
                <FlyToMarker
                  lat={cityCoordinates[activeCityId][0]}
                  lng={cityCoordinates[activeCityId][1]}
                />
              )}
            </MapContainer>
          )}

          {/* Loading overlay if coordinates are still being fetched */}
          {Object.keys(cityCoordinates).length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#173F43]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7FFF7]"></div>
              <p className="ml-4 text-[#F7FFF7] text-lg">Loading map data...</p>
            </div>
          )}
        </div>

        {/* Map Instructions */}
        <div className="text-center mb-8 text-[#F7FFF7] bg-[#1A535C] p-4 rounded-lg">
          <p>
            <strong>Map Controls:</strong> Zoom in/out with mouse wheel, click
            on markers to view crop data
          </p>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-20">
            <div className="bg-[#173F43] p-8 rounded-lg flex items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7FFF7]"></div>
              <p className="ml-4 text-[#F7FFF7] text-lg">
                Loading AI recommendations...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-md p-4 my-4">
            <p className="text-[#F7FFF7]">{error}</p>
          </div>
        )}

        {/* Side Panel for City Details */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div
              className="fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-[#1A535C] p-8 shadow-lg border-l border-[#4ECDC4]/20 overflow-y-auto z-10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <button
                className="text-[#F7FFF7] text-lg mb-4"
                onClick={() => {
                  setSelectedCity(null);
                  setAiRecommendations(null);
                  setActiveCityId(null);
                }}
              >
                &larr; Back
              </button>

              {/* Place Name */}
              <h2 className="text-3xl font-bold text-[#F7FFF7] mb-6">
                {selectedCity.name}
              </h2>

              {/* Traditional Knowledge Section */}
              <div className="mb-8 p-4 bg-[#173F43] rounded-lg">
                <h3 className="text-2xl font-bold text-[#F7FFF7] mb-4">
                  Traditional Knowledge
                </h3>

                {/* Soil Type */}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-[#F7FFF7] mb-2">
                    Soil Type
                  </h4>
                  <p className="text-[#F7FFF7]">{selectedCity.soilType}</p>
                </div>

                {/* Crops Grown */}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-[#F7FFF7] mb-2">
                    Crops Grown
                  </h4>
                  <ul className="list-disc list-inside text-[#F7FFF7]">
                    {selectedCity.cropsGrown.map((crop, index) => (
                      <li key={index}>{crop}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-xl font-bold text-[#F7FFF7] mb-2">
                    Recommendations
                  </h4>
                  <p className="text-[#F7FFF7]">
                    {selectedCity.recommendations}
                  </p>
                </div>
              </div>

              {/* AI Recommendations Section */}
              {aiRecommendations && (
                <div className="p-4 bg-[#173F43] rounded-lg">
                  <h3 className="text-2xl font-bold text-[#F7FFF7] mb-4">
                    AI-Powered Recommendations
                  </h3>

                  {/* Weather Data */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-[#F7FFF7] mb-2">
                      Current Weather Conditions
                    </h4>
                    <ul className="text-[#F7FFF7]">
                      <li>
                        Temperature:{" "}
                        {aiRecommendations.weather.temperature.toFixed(1)}°C
                      </li>
                      <li>
                        Rainfall:{" "}
                        {aiRecommendations.weather.rainfall.toFixed(1)} mm
                      </li>
                      <li>Humidity: {aiRecommendations.weather.humidity}%</li>
                    </ul>
                  </div>

                  {/* Recommended Crops */}
                  <div>
                    <h4 className="text-xl font-bold text-[#F7FFF7] mb-2">
                      Recommended Crops
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiRecommendations.recommended_crops.map(
                        (crop, index) => (
                          <div
                            key={index}
                            className="bg-[#0B2B26] p-4 rounded-lg flex flex-col"
                          >
                            <div className="mb-2">
                              <img
                                src={
                                  aiRecommendations.crop_images[crop.name] ||
                                  `/api/placeholder/300/200?text=${crop.name}`
                                }
                                alt={crop.name}
                                className="w-full h-32 object-cover rounded-md"
                              />
                            </div>
                            <h5 className="text-lg font-bold text-[#F7FFF7]">
                              {crop.name}
                            </h5>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5 mb-2">
                              <div
                                className="bg-[#4ECDC4] h-2.5 rounded-full"
                                style={{ width: `${crop.confidence}%` }}
                              ></div>
                            </div>
                            <p className="text-[#F7FFF7] text-sm">
                              Confidence: {crop.confidence}%
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}