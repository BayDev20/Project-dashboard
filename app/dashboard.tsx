"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { initialWarehouses } from '@/app/data/warehouseData';
import { StateDetailCard } from '@/components/ui/StateDetailCard';
import { WarehouseDetailCard } from '@/components/ui/WarehouseDetailCard';
import { WarehouseList } from '@/components/ui/WarehouseList';
import MarkerCluster from '@/components/ui/MarkerCluster';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { Tooltip } from 'react-tooltip';
import { FaGlobeAmericas, FaThermometerHalf, FaWind, FaSun, FaExclamationTriangle, FaUserCog, FaTimes, FaChevronDown, FaChevronUp, FaSignOutAlt, FaCog, FaHome, FaCloud, FaCloudRain, FaSnowflake } from 'react-icons/fa';
import { WiThermometer, WiHumidity, WiStrongWind, WiSunrise, WiSunset } from 'react-icons/wi';
import { FaTemperatureHigh } from 'react-icons/fa';
import { scaleLinear } from 'd3-scale';
import { getWeatherData } from '../lib/api';
import { Warehouse } from '@/app/types/warehouseTypes';
import { fetchRealTimeData } from '@/app/data/warehouseData';
import { motion } from 'framer-motion';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

const kelvinToFahrenheit = (kelvin: number) => ((kelvin - 273.15) * 9/5 + 32).toFixed(1);
const mpsToMph = (mps: number) => (mps * 2.237).toFixed(1);

const WeatherModule: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <motion.div 
    className="bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center text-center glow-cyan-box"
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-2">{icon}</div>
    <p className="font-bold text-xs mb-1">{label}</p>
    <p className="text-lg">{value}</p>
  </motion.div>
);

export default function Dashboard() {
  const [position, setPosition] = useState({ coordinates: [-96, 38], zoom: 1 });
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedState, setSelectedState] = useState<Feature<Geometry, GeoJsonProperties> | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [showWarehouseList, setShowWarehouseList] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<{type: string; count: number}[]>([]);
  const [userName, setUserName] = useState("John Doe");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [homeFacility, setHomeFacility] = useState<Warehouse | null>(null);
  const [isHomeFacilityDropdownOpen, setIsHomeFacilityDropdownOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [alertData, setAlertData] = useState<{ type: string; count: number; threshold: number; unit: string }[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    async function fetchWeatherData() {
      setIsLoading(true);
      console.log('Starting fetchWeatherData');
      const warehousesWithWeather = await fetchRealTimeData();
      console.log('Received warehouses:', warehousesWithWeather);
      if (warehousesWithWeather.length === 0) {
        console.error('No warehouses data received');
      }
      setWarehouses(warehousesWithWeather);
      updateDashboardStats(warehousesWithWeather);
      if (warehousesWithWeather.length > 0) {
        setWeatherData(warehousesWithWeather[0]);
      } else {
        console.error('No weather data available');
      }
      console.log('Finished setting data');
      setIsLoading(false);
    }
    
    fetchWeatherData();
  }, []);

  function updateDashboardStats(warehouses: Warehouse[]) {
    const highTempWarehouses = warehouses.filter(w => Number(w.weather.temp) > 273.15 + 30).length; // 30°C in Kelvin
    const highUVIWarehouses = warehouses.filter(w => Number(w.weather.uvi) > 7).length;
    
    setAlertData([
      { type: 'High Temperature', count: highTempWarehouses, threshold: 86, unit: '°F' },
      { type: 'High UV Index', count: highUVIWarehouses, threshold: 7, unit: '' }
    ]);
    
    if (warehouses.length > 0) {
      setHomeFacility(warehouses[0]);
    }
  }

  const handleWarehouseClick = useCallback((data: Warehouse | { pointCount: number; address: string }, event: React.MouseEvent) => {
    event.stopPropagation();
    if ('name' in data && 'weather' in data) {
      setSelectedWarehouse({
        ...data,
        id: data.name,
        weather: {
          ...data.weather,
          temp: data.weather.temp ?? 0,
          feels_like: data.weather.feels_like ?? 0,
          humidity: data.weather.humidity ?? 0,
          uvi: data.weather.uvi ?? 0,
          wind_speed: data.weather.wind_speed ?? 0,
          wind_deg: data.weather.wind_deg ?? 0,
          description: data.weather.weather[0]?.description ?? '',
          weather: data.weather.weather?.map(w => ({
            id: w.id ?? 0,
            main: w.main ?? '',
            description: w.description ?? '',
            icon: w.icon ?? ''
          })) ?? []
        }
      });
    } else {
      console.log(`Clicked cluster with ${(data as { pointCount: number }).pointCount} warehouses`);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const filtered = warehouses.filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWarehouses(filtered);
  }, [searchTerm, warehouses]);

  useEffect(() => {
    const newAlerts = alertData.filter(alert => alert.count > 0);

    setActiveAlerts(newAlerts);
    setNotificationCount(newAlerts.reduce((sum, alert) => sum + alert.count, 0));
  }, [alertData]);

  const handleStateClick = useCallback((geo: Feature<Geometry, GeoJsonProperties>) => {
    setSelectedState(geo);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedState(null);
    setSelectedWarehouse(null);
  }, []);

  const colorScale = useMemo(() => 
    scaleLinear<string>()
      .domain([60, 75, 90])
      .range(['#00ff00', '#ffff00', '#ff0000'])
      .clamp(true),
    []
  );

  const toggleAlert = useCallback((alertType: string) => {
    setExpandedAlerts(prev => 
      prev.includes(alertType) 
        ? prev.filter(a => a !== alertType)
        : [...prev, alertType]
    );
  }, []);

  const closeAlert = useCallback((type: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.type !== type));
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
  };

  const openSettings = () => {
    // Implement opening settings page/modal logic here
    console.log('Opening settings');
  };

  useEffect(() => {
    console.log('selectedWarehouse:', selectedWarehouse);
  }, [selectedWarehouse]);

  useEffect(() => {
    console.log('showWarehouseList:', showWarehouseList);
  }, [showWarehouseList]);

  const getWeatherIcon = (description: string) => {
    if (description.includes('clear')) return <FaSun className="text-yellow-400" />;
    if (description.includes('cloud')) return <FaCloud className="text-gray-400" />;
    if (description.includes('rain')) return <FaCloudRain className="text-blue-400" />;
    if (description.includes('snow')) return <FaSnowflake className="text-blue-200" />;
    return <FaSun className="text-yellow-400" />;
  };

  console.log('Current warehouses state:', warehouses);
  console.log('Current weatherData state:', weatherData);

  return (
    <div className="h-screen bg-gray-900 text-cyan-400 p-6 font-mono relative flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse"></div>
      <motion.div 
        className="relative z-10 flex flex-col h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-500 glow-cyan">Amazon Warehouse Mission Control</h1>
          <div className="flex items-center space-x-4">
            <FaGlobeAmericas className="text-cyan-500 text-2xl animate-spin-slow" />
            <div className="text-sm glow-cyan">{currentTime.toLocaleTimeString()}</div>
            <FaSun className="text-yellow-400 text-xl" title="Current weather" />
            <div className="relative">
              <button onClick={() => setShowAlerts(!showAlerts)} className="relative">
                <FaExclamationTriangle className="text-yellow-500 text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center text-white">
                    {notificationCount}
                  </span>
                )}
              </button>
              {showAlerts && activeAlerts.length > 0 && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-cyan-500 rounded shadow-lg z-50 text-xs">
                  {activeAlerts.map(alert => (
                    <div key={alert.type} className="flex justify-between items-center p-1 border-b border-cyan-500 last:border-b-0">
                      <span>{alert.type}: {alert.count}</span>
                      <button onClick={() => closeAlert(alert.type)} className="text-red-500">
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 relative">
              <span className="text-cyan-500 text-xs">{userEmail}</span>
              <button onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaUserCog className="text-cyan-500 text-xl" title="User settings" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-cyan-500 rounded shadow-lg z-50 top-full text-xs">
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

        <div className="h-1 bg-cyan-500 w-full mb-6 glow-cyan"></div>

        <div className="flex gap-6 flex-grow">
          <motion.div 
            className="w-3/4 flex flex-col"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-grow border-2 border-cyan-400 rounded-lg overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 opacity-50 animate-scan"></div>
              <ComposableMap 
                projection="geoAlbersUsa" 
                projectionConfig={{ scale: 1000 }}
                className="bg-black h-full"
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
                    {({ geographies }) =>
                      geographies.map(geo => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={hoveredState === geo.id ? "#00ff00" : "#1e1e1e"}
                          stroke="#2a2a2a"
                          onClick={() => handleStateClick(geo)}
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
                      ))
                    }
                  </Geographies>
                  <MarkerCluster
                    points={warehouses.map(warehouse => ({
                      ...warehouse,
                      temp: warehouse.weather.temp,
                      uvIndex: warehouse.weather.uvi
                    }))}
                    onClick={(data, event) => {
                      console.log('Pin clicked:', data);
                      if ('id' in data && 'name' in data && 'state' in data && 'location' in data && 'weather' in data) {
                        const warehouseData: Warehouse = {
                          ...data as Warehouse,
                          type: 'Warehouse',
                          address: data.location,
                        };
                        handleWarehouseClick(warehouseData, event);
                      } else {
                        console.log('Clicked on a cluster');
                      }
                    }}
                    onMouseEnter={(data) => setTooltipContent('name' in data ? data.name : `Cluster of ${data.pointCount} warehouses`)}
                    onMouseLeave={() => setTooltipContent("")}
                    showHeatMap={showHeatMap}
                    colorScale={colorScale}
                  />
                </ZoomableGroup>
              </ComposableMap>
              <Tooltip id="tooltip" content={tooltipContent} />
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 bg-gray-800 text-cyan-400 border border-cyan-500 rounded glow-cyan-input"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWarehouseList(true)}
                className="bg-cyan-500 text-black px-4 py-2 rounded hover:bg-cyan-400 transition-colors"
              >
                Show All Warehouses
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHeatMap(!showHeatMap)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition-colors"
              >
                {showHeatMap ? "Hide" : "Show"} Heat Map
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="w-1/4 flex flex-col space-y-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {weatherData && (
              <div className="bg-gray-800 p-4 rounded-lg border border-cyan-400 flex-grow flex flex-col glow-cyan-box">
                <h2 className="text-xl font-bold mb-4 text-cyan-500 flex items-center justify-center">
                  <FaSun className="mr-2 text-yellow-400" /> Current Weather
                </h2>
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  <WeatherModule
                    icon={<WiThermometer className="text-5xl text-red-500" />}
                    label="Temperature"
                    value={`${kelvinToFahrenheit(weatherData.weather.temp)}°F`}
                  />
                  <WeatherModule
                    icon={<FaTemperatureHigh className="text-5xl text-orange-500" />}
                    label="Feels Like"
                    value={`${kelvinToFahrenheit(weatherData.weather.feels_like)}°F`}
                  />
                  <WeatherModule
                    icon={<WiHumidity className="text-5xl text-blue-500" />}
                    label="Humidity"
                    value={`${weatherData.weather.humidity}%`}
                  />
                  <WeatherModule
                    icon={<FaSun className="text-5xl text-yellow-500" />}
                    label="UV Index"
                    value={weatherData.weather.uvi.toString()}
                  />
                  <WeatherModule
                    icon={<WiStrongWind className="text-5xl text-teal-500" />}
                    label="Wind"
                    value={`${mpsToMph(weatherData.weather.wind_speed)} mph`}
                  />
                  <WeatherModule
                    icon={getWeatherIcon(weatherData.weather.weather[0].description)}
                    label="Description"
                    value={weatherData.weather.weather[0].description}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <footer className="flex justify-between items-center mt-4">
          <div className="text-cyan-400 text-xs glow-cyan">
            Zoom Level: {zoomLevel.toFixed(2)}
          </div>
        </footer>
      </motion.div>
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
              humidity: warehouse.weather.humidity,
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
          warehouses={warehouses}
          onClose={() => {
            console.log('Closing WarehouseList');
            setShowWarehouseList(false);
          }}
        />
      )}
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-cyan-400">Loading data...</p>
        </div>
      )}
    </div>
  );
}