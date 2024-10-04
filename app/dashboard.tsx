"use client"

import React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { scaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import { FaSun, FaUserCog, FaSignOutAlt, FaCog, FaCloud, FaCloudRain, FaSnowflake, FaTemperatureHigh } from 'react-icons/fa';
import { WiThermometer, WiStrongWind } from 'react-icons/wi';
import { RiComputerLine } from 'react-icons/ri';
import { IoMdPower } from 'react-icons/io';
import { Silkscreen } from 'next/font/google';
import { auth } from '@/app/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { StateDetailCard } from '@/components/ui/StateDetailCard';
import { WarehouseDetailCard } from '@/components/ui/WarehouseDetailCard';
import { WarehouseList } from '@/components/ui/WarehouseList';
import MarkerCluster from '@/components/ui/MarkerCluster';
import { Warehouse } from '@/app/types/warehouseTypes';
import { fetchRealTimeData } from '@/app/data/warehouseData';
import { getWeatherData } from '@/lib/api';
import { WeatherData } from '@/app/types/warehouseTypes';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

const kelvinToFahrenheit = (kelvin: number) => ((kelvin - 273.15) * 9/5 + 32).toFixed(1);
const mpsToMph = (mps: number) => (mps * 2.237).toFixed(1);

// Move WeatherModule component here
const WeatherModule: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <motion.div 
    className="bg-black p-3 rounded-lg flex flex-col items-center justify-center text-center border border-green-500"
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-2 text-3xl">{icon}</div>
    <p className="font-bold text-xs mb-1">{label}</p>
    <p className="text-lg">{value}</p>
  </motion.div>
);

const MemoizedWeatherModule = React.memo(WeatherModule);
const MemoizedMarkerCluster = React.memo(MarkerCluster);

// Initialize the font
const silkscreen = Silkscreen({ weight: '400', subsets: ['latin'] });

export default function Dashboard() {
  // State declarations
  const [position, setPosition] = useState({ coordinates: [-96, 38], zoom: 1 });
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedState, setSelectedState] = useState<Feature<Geometry, GeoJsonProperties> | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [showWarehouseList, setShowWarehouseList] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [weatherData, setWeatherData] = useState<Warehouse | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [userWeather, setUserWeather] = useState<WeatherData | null>(null);

  const router = useRouter();

  // Effects
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);
  }, []);

  const updateDashboardStats = useCallback(() => {
    // ... implementation ...
  }, []);

  useEffect(() => {
    async function fetchWeatherData() {
      setIsLoading(true);
      const warehousesWithWeather = await fetchRealTimeData();
      setWarehouses(warehousesWithWeather);
      setFilteredWarehouses(warehousesWithWeather);
      updateDashboardStats();
      if (warehousesWithWeather.length > 0) {
        setWeatherData(warehousesWithWeather[0]);
      }
      setIsLoading(false);
    }
    
    fetchWeatherData();
  }, [updateDashboardStats]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }, []);

  useEffect(() => {
    async function fetchUserWeather() {
      if (userLocation) {
        try {
          const weatherData = await getWeatherData(userLocation.lat, userLocation.lon);
          setUserWeather(weatherData);
        } catch (error) {
          console.error("Error fetching user weather:", error);
        }
      }
    }

    fetchUserWeather();
  }, [userLocation]);

  // Memoized values
  const colorScale = useMemo(() => 
    scaleLinear<string>()
      .domain([60, 75, 90])
      .range(['#00ff00', '#ffff00', '#ff0000'])
      .clamp(true),
    []
  );

  // Callback functions
  const handleWarehouseClick = useCallback((data: Warehouse | { pointCount: number; address: string }, event: React.MouseEvent) => {
    event.stopPropagation();
    if ('name' in data && 'weather' in data) {
      setSelectedWarehouse(data);
    } else {
      console.log(`Clicked cluster with ${(data as { pointCount: number }).pointCount} warehouses`);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      console.log('Logging out...');
      await signOut(auth);
      console.log('Signed out of Firebase');
      localStorage.removeItem('userEmail');
      console.log('Removed userEmail from localStorage');
      console.log('Attempting to navigate to root');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [router]);

  const openSettings = useCallback(() => {
    // Implement opening settings page/modal logic here
    console.log('Opening settings');
  }, []);

  const getWeatherIcon = useCallback((description: string) => {
    if (description.includes('clear')) return <FaSun className="text-yellow-400" />;
    if (description.includes('cloud')) return <FaCloud className="text-gray-400" />;
    if (description.includes('rain')) return <FaCloudRain className="text-blue-400" />;
    if (description.includes('snow')) return <FaSnowflake className="text-blue-200" />;
    return <FaSun className="text-yellow-400" />;
  }, []);

  const debouncedSearch = useCallback(
    (term: string) => {
      const lowercasedTerm = term.toLowerCase();
      const filtered = warehouses.filter(warehouse => 
        warehouse.name.toLowerCase().includes(lowercasedTerm) ||
        warehouse.state.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredWarehouses(filtered);
    },
    [warehouses]
  );

  // Handler for search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // Render
  return (
    <div className={`h-screen bg-black text-green-400 p-4 ${silkscreen.className} relative flex flex-col overflow-hidden crt-effect`}>
      <div className="absolute inset-0 bg-scan-lines pointer-events-none"></div>
      <div className="absolute inset-0 glow pointer-events-none"></div>
      <motion.div 
        className="relative z-10 flex flex-col h-full border-4 border-green-500 rounded-lg p-4 overflow-hidden bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-4 border-b-2 border-green-500 pb-2">
          <h1 className="text-2xl font-bold text-green-500 flex items-center">
            <RiComputerLine className="mr-2" />
            Amazon Warehouse Control
          </h1>
          <div className="flex items-center space-x-4">
            <IoMdPower className="text-red-500 text-2xl animate-pulse" />
            <div className="text-sm">{currentTime.toLocaleTimeString()}</div>
            <FaSun className="text-yellow-400 text-xl" title="Current weather" />
            <div className="flex items-center space-x-2 relative">
              <span className="text-green-500 text-xs">{userEmail}</span>
              <button onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaUserCog className="text-green-500 text-xl" title="User settings" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-green-500 rounded shadow-lg z-50 top-full text-xs">
                  <button 
                    onClick={openSettings}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-700 flex items-center"
                  >
                    <FaCog className="mr-1" /> Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-700 flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-grow space-x-4 overflow-hidden">
          <motion.div 
            className="w-3/4 flex flex-col"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-grow border-2 border-green-500 rounded-lg overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-50 animate-scan"></div>
              <div className="absolute inset-0">
                <ComposableMap
                  projection="geoAlbersUsa"
                  projectionConfig={{ scale: 1000 }}
                  className="w-full h-full"
                >
                  <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates as [number, number]}
                    onMoveEnd={(position) => {
                      setPosition(position);
                      setZoomLevel(position.zoom);
                    }}
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) => geographies.map(geo => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={hoveredState === geo.id ? "#00ff00" : "#003300"}
                          stroke="#006600"
                          onClick={() => setSelectedState(geo)}
                          onMouseEnter={() => {
                            setTooltipContent(geo.properties.name);
                            setHoveredState(geo.id as string);
                          }}
                          onMouseLeave={() => {
                            setTooltipContent("");
                            setHoveredState(null);
                          }}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))}
                    </Geographies>
                    <MemoizedMarkerCluster
                      points={filteredWarehouses}
                      onClick={handleWarehouseClick}
                      onMouseEnter={(data) => setTooltipContent('name' in data ? data.name : `Cluster of ${data.pointCount} warehouses`)}
                      onMouseLeave={() => setTooltipContent("")}
                      colorScale={colorScale}
                    />
                  </ZoomableGroup>
                </ComposableMap>
              </div>
              <Tooltip id="tooltip" content={tooltipContent} />
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-grow p-2 bg-black text-green-400 border border-green-500 rounded"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWarehouseList(true)}
                className="bg-green-700 text-green-100 px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Show All Warehouses
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="w-1/4 flex flex-col space-y-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {userWeather && (
              <div className="bg-black p-4 rounded-lg border-2 border-green-500 flex-grow flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-green-500 flex items-center justify-center">
                  <FaSun className="mr-2 text-yellow-400" /> Your Local Weather
                </h2>
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <MemoizedWeatherModule
                    icon={<WiThermometer className="text-5xl text-red-500" />}
                    label="Temperature"
                    value={`${kelvinToFahrenheit(userWeather.current.temp)}°F`}
                  />
                  <MemoizedWeatherModule
                    icon={<FaTemperatureHigh className="text-5xl text-orange-500" />}
                    label="Feels Like"
                    value={`${kelvinToFahrenheit(userWeather.current.feels_like)}°F`}
                  />
                  <MemoizedWeatherModule
                    icon={<WiStrongWind className="text-5xl text-teal-500" />}
                    label="Wind"
                    value={`${mpsToMph(userWeather.current.wind_speed)} mph`}
                  />
                  <MemoizedWeatherModule
                    icon={getWeatherIcon(userWeather.current.weather[0].description)}
                    label="Description"
                    value={userWeather.current.weather[0].description}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center mt-4 border-t-2 border-green-500 pt-2">
          <div className="text-green-400 text-xs">
            Zoom Level: {zoomLevel.toFixed(2)}
          </div>
        </footer>
      </motion.div>

      {/* Modals */}
      {selectedState && selectedState.properties && (
        <StateDetailCard
          stateName={selectedState.properties?.name ?? 'Unknown'}
          warehouses={warehouses.filter(w => w.state === selectedState.properties?.name).map(w => ({
            ...w,
            temp: w.weather.temp,
            uvi: w.weather.uvi,
            wind_speed: w.weather.wind_speed
          }))}
          onClose={() => setSelectedState(null)}
          stateFeature={selectedState}
          onWarehouseClick={(warehouse) => setSelectedWarehouse({
            ...warehouse,
            id: warehouse.name,
            weather: {
              ...warehouse.weather,
              temp: warehouse.weather.temp,
              feels_like: warehouse.weather.feels_like,
              uvi: warehouse.weather.uvi,
              wind_speed: warehouse.weather.wind_speed,
              wind_deg: warehouse.weather.wind_deg,
              description: warehouse.weather.weather[0].description,
              weather: warehouse.weather.weather
            }
          })}
        />
      )}
      {selectedWarehouse && (
        <div className="warehouse-detail-card fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-800 p-4 rounded-lg shadow-lg">
          <WarehouseDetailCard
            warehouse={selectedWarehouse}
            forecast={selectedWarehouse.weather.forecast}
            onClose={() => {
              console.log('Closing WarehouseDetailCard');
              setSelectedWarehouse(null);
            }}
          />
        </div>
      )}
      {showWarehouseList && (
        <WarehouseList
          warehouses={filteredWarehouses}
          onClose={() => {
            console.log('Closing WarehouseList');
            setShowWarehouseList(false);
          }}
        />
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-4 rounded-lg shadow-lg border-2 border-green-500 glow">
            <p className="text-green-400">Loading data...</p>
          </div>
        </div>
      )}
    </div>
  );
}