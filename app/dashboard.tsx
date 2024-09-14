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
import { FaGlobeAmericas, FaThermometerHalf, FaWind, FaSun, FaExclamationTriangle } from 'react-icons/fa';
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

  const handleZoomEnd = useCallback((zoom: number) => {
    setZoomLevel(zoom);
  }, []);

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

  const colorScale = useMemo(() => 
    scaleLinear<string>()
      .domain([60, 75, 90])
      .range(['#00ff00', '#ffff00', '#ff0000'])
      .clamp(true),
    []
  );

  return (
    <div className="h-screen bg-black text-green-400 p-2 font-mono relative flex flex-col">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-green-500 animate-pulse">Amazon Warehouse Mission Control</h1>
          <div className="flex items-center space-x-4">
            <FaGlobeAmericas className="text-green-500 text-2xl animate-spin-slow" />
            <div className="text-lg">{currentTime.toLocaleTimeString()}</div>
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
                onMoveEnd={setPosition}
                onZoomEnd={handleZoomEnd}
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
            <div className="bg-gray-900 p-3 rounded-lg border border-green-400 flex items-center">
              <FaExclamationTriangle className="text-yellow-500 text-3xl mr-3" />
              <div>
                <h2 className="text-lg mb-1 text-green-500">Alerts</h2>
                <p className="text-sm">High Temperature: {stats.highTempWarehouses}</p>
                <p className="text-sm">Poor Air Quality: {stats.highAQIWarehouses}</p>
                <p className="text-sm">High UV Index: {stats.highUVIWarehouses}</p>
              </div>
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