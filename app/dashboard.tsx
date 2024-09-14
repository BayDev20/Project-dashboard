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
import { FaGlobeAmericas, FaThermometerHalf, FaWind, FaSun, FaExclamationTriangle, FaUserCog, FaTimes, FaChevronDown, FaChevronUp, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

const warehousesWithIds = initialWarehouses.map((w, index) => ({ ...w, id: index + 1 }));

export default function Dashboard() {
  const [position, setPosition] = useState({ coordinates: [-96, 38], zoom: 1 });
  const [tooltipContent, setTooltipContent] = useState("");
  const [selectedState, setSelectedState] = useState<Feature<Geometry, GeoJsonProperties> | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<typeof initialWarehouses[0] | null>(null);
  const [showWarehouseList, setShowWarehouseList] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWarehouses, setFilteredWarehouses] = useState(warehousesWithIds);
  const [notificationCount, setNotificationCount] = useState(0);
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<{type: string; count: number}[]>([]);
  const [userName, setUserName] = useState("John Doe");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWarehouses = initialWarehouses.length;
    const avgTemp = initialWarehouses.reduce((sum, w) => sum + w.temp, 0) / totalWarehouses;
    const avgAQI = initialWarehouses.reduce((sum, w) => sum + w.aqi, 0) / totalWarehouses;
    const avgUVI = initialWarehouses.reduce((sum, w) => sum + w.uvIndex, 0) / totalWarehouses;
    const highTempWarehouses = initialWarehouses.filter(w => w.temp > 90).length;
    const highAQIWarehouses = initialWarehouses.filter(w => w.aqi > 100).length;
    const highUVIWarehouses = initialWarehouses.filter(w => w.uvIndex > 7).length;
    return { totalWarehouses, avgTemp, avgAQI, avgUVI, highTempWarehouses, highAQIWarehouses, highUVIWarehouses };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const filtered = warehousesWithIds.filter(w => 
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWarehouses(filtered);
  }, [searchTerm]);

  useEffect(() => {
    const newAlerts = [
      { type: 'High Temperature', count: stats.highTempWarehouses },
      { type: 'Poor Air Quality', count: stats.highAQIWarehouses },
      { type: 'High UV Index', count: stats.highUVIWarehouses }
    ].filter(alert => alert.count > 0);

    setActiveAlerts(newAlerts);
    setNotificationCount(newAlerts.reduce((sum, alert) => sum + alert.count, 0));
  }, [stats]);

  const handleStateClick = useCallback((geo: Feature<Geometry, GeoJsonProperties>) => {
    setSelectedState(geo);
  }, []);

  const handleWarehouseClick = useCallback((data: typeof initialWarehouses[0] | { pointCount: number; address: string }, event: React.MouseEvent) => {
    event.stopPropagation();
    if ('name' in data) {
      setSelectedWarehouse(data);
    } else {
      // Handle cluster click if needed
      console.log(`Clicked cluster with ${data.pointCount} warehouses`);
    }
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

  const alertData = useMemo(() => [
    { type: 'High Temperature', count: stats.highTempWarehouses, threshold: 90, unit: '°F' },
    { type: 'Poor Air Quality', count: stats.highAQIWarehouses, threshold: 100, unit: 'AQI' },
    { type: 'High UV Index', count: stats.highUVIWarehouses, threshold: 7, unit: 'UVI' }
  ], [stats]);

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
                  points={filteredWarehouses}
                  onClick={handleWarehouseClick}
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
            <div className="bg-gray-900 p-3 rounded-lg border border-green-400 flex items-center">
              <FaThermometerHalf className="text-red-500 text-3xl mr-3" />
              <div>
                <h2 className="text-lg mb-1 text-green-500">Average Temperature</h2>
                <p className="text-2xl font-bold">{stats.avgTemp.toFixed(1)}°F</p>
                <p className="text-sm text-yellow-400">{stats.highTempWarehouses} warehouses above 90°F</p>
              </div>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-green-400 flex items-center">
              <FaWind className="text-blue-500 text-3xl mr-3" />
              <div>
                <h2 className="text-lg mb-1 text-green-500">Average AQI</h2>
                <p className="text-2xl font-bold">{stats.avgAQI.toFixed(1)}</p>
                <p className="text-sm text-yellow-400">{stats.highAQIWarehouses} warehouses above 100 AQI</p>
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
                      {initialWarehouses
                        .filter(w => {
                          if (alert.type === 'High Temperature') return w.temp > alert.threshold;
                          if (alert.type === 'Poor Air Quality') return w.aqi > alert.threshold;
                          if (alert.type === 'High UV Index') return w.uvIndex > alert.threshold;
                          return false;
                        })
                        .map(w => (
                          <p key={w.name}>{w.name}: {
                            alert.type === 'High Temperature' ? w.temp :
                            alert.type === 'Poor Air Quality' ? w.aqi :
                            w.uvIndex
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
            onClick={() => setShowWarehouseList(true)}
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
          warehouses={initialWarehouses.filter(w => w.state === selectedState.properties?.name)}
          onClose={() => setSelectedState(null)}
          stateFeature={selectedState}
          onWarehouseClick={setSelectedWarehouse}
        />
      )}
      {selectedWarehouse && (
        <WarehouseDetailCard
          warehouse={selectedWarehouse}
          onClose={() => setSelectedWarehouse(null)}
        />
      )}
      {showWarehouseList && (
        <WarehouseList
          warehouses={warehousesWithIds}
          onClose={() => setShowWarehouseList(false)}
        />
      )}
    </div>
  );
}