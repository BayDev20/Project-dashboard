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
import { FaGlobeAmericas, FaThermometerHalf, FaWind, FaSun, FaExclamationTriangle, FaUserCog, FaTimes, FaChevronDown, FaChevronUp, FaSignOutAlt, FaCog, FaHome } from 'react-icons/fa';
import { scaleLinear } from 'd3-scale';
import { getWeatherData } from '../lib/api';
import { Warehouse } from '@/app/types/warehouseTypes';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

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
  const [stats, setStats] = useState({
    avgTemp: 0,
    highTempWarehouses: 0,
    avgUVI: 0,
    highUVIWarehouses: 0
  });
  const [alertData, setAlertData] = useState<{ type: string; count: number; threshold: number; unit: string }[]>([]);

  useEffect(() => {
    async function fetchWeatherData() {
      const weatherPromises = initialWarehouses.map(async (warehouse) => {
        const data = await getWeatherData(warehouse.latitude, warehouse.longitude);
        return {
          ...warehouse,
          id: warehouse.name,
          weather: {
            temp: data.current.temp,
            feels_like: data.current.feels_like,
            humidity: data.current.humidity,
            uvi: data.current.uvi,
            wind_speed: data.current.wind_speed,
            wind_deg: data.current.wind_deg,
            description: data.current.weather[0].description,
            forecast: {
              hourly: data.hourly,
              daily: data.daily
            },
            weather: data.current.weather
          },
          alerts: data.alerts || []
        };
      });
      const warehousesWithWeather = await Promise.all(weatherPromises);
      setWarehouses(warehousesWithWeather);
      updateDashboardStats(warehousesWithWeather);
      if (warehousesWithWeather.length > 0) {
        setWeatherData(warehousesWithWeather[0]);
      }
    }
    
    fetchWeatherData();
  }, []);

  function updateDashboardStats(warehouses: Warehouse[]) {
    const avgTemp = warehouses.reduce((sum, w) => sum + w.weather.temp, 0) / warehouses.length;
    const highTempWarehouses = warehouses.filter(w => w.weather.temp > 303.15).length; // 30°C = 303.15K
    const avgUVI = warehouses.reduce((sum, w) => sum + w.weather.uvi, 0) / warehouses.length;
    const highUVIWarehouses = warehouses.filter(w => w.weather.uvi > 7).length;
    
    setStats({
      avgTemp,
      highTempWarehouses,
      avgUVI,
      highUVIWarehouses
    });
    
    setAlertData([
      { type: 'High Temperature', count: highTempWarehouses, threshold: 303.15, unit: 'K' },
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

  return (
    <div className="h-screen bg-black text-green-400 p-2 font-mono relative flex flex-col">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-green-500 animate-pulse">Amazon Warehouse Mission Control</h1>
          <div className="flex items-center space-x-4">
            <FaGlobeAmericas className="text-green-500 text-2xl animate-spin-slow" />
            <div className="text-lg">{currentTime.toLocaleTimeString()}</div>
            <FaSun className="text-yellow-400 text-2xl" title="Current weather" />
            <div className="relative">
              <button onClick={() => setShowAlerts(!showAlerts)} className="relative">
                <FaExclamationTriangle className="text-yellow-500 text-2xl" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center text-white">
                    {notificationCount}
                  </span>
                )}
              </button>
              {showAlerts && activeAlerts.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-green-500 rounded shadow-lg z-50">
                  {activeAlerts.map(alert => (
                    <div key={alert.type} className="flex justify-between items-center p-2 border-b border-green-500 last:border-b-0">
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
              <span className="text-green-500">{userName}</span>
              <button onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaUserCog className="text-green-500 text-2xl" title="User settings" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-green-500 rounded shadow-lg z-50 top-full">
                  <button 
                    onClick={openSettings}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center"
                  >
                    <FaCog className="mr-2" /> Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search warehouses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 p-1 w-full bg-gray-800 text-green-400 border border-green-500 rounded text-sm"
        />
        <div className="flex gap-2 flex-grow">
          <div className="w-2/3 border-2 border-green-400 rounded-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-green-400 opacity-50 animate-scan"></div>
            <ComposableMap 
              projection="geoAlbersUsa" 
              projectionConfig={{ scale: 1000 }}
              className="bg-black"
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
          <div className="w-1/3 space-y-2 overflow-auto">
            {weatherData && (
              <>
                <div className="bg-gray-900 p-3 rounded-lg border border-green-400">
                  <h2 className="text-xl font-bold mb-2">Current Weather</h2>
                  <p>Temperature: {(weatherData.weather.temp - 273.15).toFixed(1)}°C</p>
                  <p>Feels Like: {(weatherData.weather.feels_like - 273.15).toFixed(1)}°C</p>
                  <p>Humidity: {weatherData.weather.humidity}%</p>
                  <p>UV Index: {weatherData.weather.uvi}</p>
                  <p>Wind Speed: {weatherData.weather.wind_speed} m/s</p>
                  <p>Wind Direction: {weatherData.weather.wind_deg}°</p>
                  <p>Description: {weatherData.weather.weather[0].description}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-green-400">
                  <h2 className="text-xl font-bold mb-2">Hourly Forecast</h2>
                  {weatherData.weather.forecast.hourly.slice(0, 24).map((hour: any, index: number) => (
                    <div key={index} className="mb-2">
                      <p>Time: {hour.dt}</p>
                      <p>Temperature: {(hour.temp - 273.15).toFixed(1)}°C</p>
                      <p>Description: {hour.weather[0].description}</p>
                    </div>
                  ))}
                </div>
                {weatherData && weatherData.weather.forecast.daily ? (
                  <div className="bg-gray-900 p-3 rounded-lg border border-green-400">
                    <h2 className="text-xl font-bold mb-2">Daily Forecast</h2>
                    {weatherData.weather.forecast.daily.map((day: any, index: number) => (
                      <div key={index} className="mb-2">
                        <p>Date: {new Date(day.dt * 1000).toLocaleDateString()}</p>
                        <p>Max Temp: {(day.temp.max - 273.15).toFixed(1)}°C</p>
                        <p>Min Temp: {(day.temp.min - 273.15).toFixed(1)}°C</p>
                        <p>Description: {day.weather[0].description}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {weatherData.alerts && weatherData.alerts.length > 0 && (
                  <div className="bg-gray-900 p-3 rounded-lg border border-red-400">
                    <h2 className="text-xl font-bold mb-2">Weather Alerts</h2>
                    {weatherData.alerts.map((alert: any, index: number) => (
                      <div key={index} className="mb-2">
                        <p>Event: {alert.event}</p>
                        <p>Start: {new Date(alert.start * 1000).toLocaleString()}</p>
                        <p>End: {new Date(alert.end * 1000).toLocaleString()}</p>
                        <p>Description: {alert.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="bg-gray-900 p-3 rounded-lg border border-green-400">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaHome className="text-green-500 text-2xl mr-2" />
                  <h2 className="text-lg text-green-500">Home Facility</h2>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsHomeFacilityDropdownOpen(!isHomeFacilityDropdownOpen)}
                    className="flex items-center bg-green-500 text-black px-2 py-1 rounded text-sm hover:bg-green-400 transition-colors"
                  >
                    Select <FaChevronDown className="ml-1" />
                  </button>
                  {isHomeFacilityDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-gray-800 border border-green-500 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                      {warehouses.map((warehouse) => (
                        <button
                          key={warehouse.name}
                          onClick={() => {
                            setHomeFacility(warehouse);
                            setIsHomeFacilityDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-green-400"
                        >
                          {warehouse.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl font-bold">{homeFacility?.name}</p>
              <p className="text-sm">{homeFacility?.location}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-400">Temperature</p>
                  <p className="text-sm font-semibold">
                    {((homeFacility?.weather?.temp ?? 273.15) - 273.15).toFixed(1)}°C
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">UV Index</p>
                  <p className="text-sm font-semibold">{homeFacility?.weather.uvi.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Wind</p>
                  <p className="text-sm font-semibold">{homeFacility?.weather.wind_speed.toFixed(1)} m/s</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Description</p>
                  <p className="text-sm font-semibold">{homeFacility?.weather.weather[0].description}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedWarehouse(homeFacility)}
                className="mt-2 w-full bg-green-500 text-black px-2 py-1 rounded text-sm hover:bg-green-400 transition-colors"
              >
                View Details
              </button>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-green-400 flex items-center">
              <FaThermometerHalf className="text-red-500 text-3xl mr-3" />
              <div>
                <h2 className="text-lg mb-1 text-green-500">Average Temperature</h2>
                <p className="text-2xl font-bold">{(stats.avgTemp - 273.15).toFixed(1)}°C</p>
                <p className="text-sm text-yellow-400">{stats.highTempWarehouses} warehouses above 30°C</p>
              </div>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-green-400 flex items-center">
              <FaSun className="text-yellow-500 text-3xl mr-3" />
              <div>
                <h2 className="text-lg mb-1 text-green-500">Average UV Index</h2>
                <p className="text-2xl font-bold">{stats.avgUVI.toFixed(1)}</p>
                <p className="text-sm text-yellow-400">{stats.highUVIWarehouses} warehouses above 7 UVI</p>
              </div>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-green-400">
              <div className="flex items-center cursor-pointer" onClick={() => setExpandedAlerts(prev => prev.length ? [] : alertData.map(a => a.type))}>
                <FaExclamationTriangle className="text-yellow-500 text-3xl mr-3" />
                <h2 className="text-lg mb-1 text-green-500">Alerts</h2>
                {expandedAlerts.length ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
              </div>
              {alertData.map(alert => (
                <div key={alert.type} className="mt-2">
                  <div className="flex items-center cursor-pointer" onClick={() => toggleAlert(alert.type)}>
                    <p className="text-sm">{alert.type}: {alert.count}</p>
                    {expandedAlerts.includes(alert.type) ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
                  </div>
                  {expandedAlerts.includes(alert.type) && (
                    <div className="mt-1 ml-4 text-xs">
                      {warehouses
                        .filter(w => {
                          if (alert.type === 'High Temperature') return w.weather.temp > alert.threshold;
                          if (alert.type === 'High UV Index') return w.weather.uvi > alert.threshold;
                          return false;
                        })
                        .map(w => (
                          <p key={w.name}>{w.name}: {
                            alert.type === 'High Temperature' ? 
                              (w.weather.temp - 273.15).toFixed(1) :
                            w.weather.uvi.toFixed(1)
                          } {alert.unit}</p>
                        ))
                        }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 flex space-x-2">
          <button 
            onClick={() => {
              console.log('View All Cards clicked');
              setShowWarehouseList(true);
            }}
            className="bg-green-500 text-black px-2 py-1 rounded text-sm hover:bg-green-400 transition-colors"
          >
            Show All Warehouses
          </button>
          <button 
            onClick={() => setShowHeatMap(!showHeatMap)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-400 transition-colors"
          >
            {showHeatMap ? "Hide" : "Show"} Temperature Heat Map
          </button>
        </div>
        <div className="mt-1 text-green-400 text-sm">
          Zoom Level: {zoomLevel.toFixed(2)}
        </div>
      </div>
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
    </div>
  );
}