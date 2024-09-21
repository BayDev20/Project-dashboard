import React, { useState, useEffect, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { Warehouse } from '../../app/types/warehouseTypes';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { FaThermometerHalf, FaSun, FaWind, FaTint } from 'react-icons/fa';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface StateDetailCardProps {
  stateName: string;
  warehouses: Warehouse[];
  onClose: () => void;
  stateFeature: Feature<Geometry, GeoJsonProperties>;
  onWarehouseClick: (warehouse: Warehouse) => void;
}

const kelvinToCelsius = (kelvin: number) => (kelvin - 273.15).toFixed(1);
const kelvinToFahrenheit = (kelvin: number) => ((kelvin - 273.15) * 9/5 + 32).toFixed(1);

export function StateDetailCard({ stateName, warehouses, onClose, stateFeature, onWarehouseClick }: StateDetailCardProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [position, setPosition] = useState({ coordinates: geoCentroid(stateFeature), zoom: 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : warehouses.length - 1));
    } else if (event.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev < warehouses.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'Enter') {
      onWarehouseClick(warehouses[selectedIndex]);
    }
  }, [warehouses, selectedIndex, onWarehouseClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedWarehouse(warehouses[selectedIndex]);
  }, [selectedIndex, warehouses]);

  return (
    <div className="fixed inset-0 bg-gray-900 text-green-400 p-4 z-50 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{stateName} Warehouses</h2>
        <button onClick={onClose} className="text-xl bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition duration-300">&times;</button>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/2 pr-2 overflow-hidden flex flex-col">
          <div className="flex-grow border-2 border-green-400 rounded-lg overflow-hidden">
            <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
              <ZoomableGroup zoom={position.zoom} center={position.coordinates as [number, number]} onMoveEnd={setPosition}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) => geographies
                    .filter(d => d.id === stateFeature.id)
                    .map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#2a2a2a"
                        stroke="#3a3a3a"
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "#3a3a3a" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {warehouses.map((warehouse) => (
                  <Marker key={warehouse.name} coordinates={[warehouse.longitude, warehouse.latitude]}>
                    <circle 
                      r={4} 
                      fill={selectedWarehouse?.name === warehouse.name ? "#00ff00" : "#ff0000"}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{ cursor: 'pointer' }}
                    />
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
        <div className="w-1/2 pl-2 overflow-auto flex flex-col">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 flex-shrink-0" style={{maxHeight: '40%'}}>
            <h3 className="text-lg font-bold mb-2">Warehouses ({warehouses.length})</h3>
            <ul className="space-y-1 overflow-auto" style={{maxHeight: 'calc(100% - 2rem)'}}>
              {warehouses.map((warehouse, index) => (
                <li 
                  key={warehouse.name} 
                  className={`cursor-pointer hover:bg-gray-700 p-2 rounded transition duration-300 ${index === selectedIndex ? 'bg-green-800' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  {warehouse.name}
                </li>
              ))}
            </ul>
          </div>
          {selectedWarehouse && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex-grow">
              <h4 className="text-xl font-bold mb-4">{selectedWarehouse.name}</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <WeatherItem icon={<FaThermometerHalf className="text-red-500" />} label="Temperature" value={`${kelvinToCelsius(selectedWarehouse.weather.temp)}°C / ${kelvinToFahrenheit(selectedWarehouse.weather.temp)}°F`} color="text-red-400" />
                <WeatherItem icon={<FaSun className="text-yellow-500" />} label="UV Index" value={selectedWarehouse.weather.uvi.toFixed(1)} color="text-yellow-400" />
                <WeatherItem icon={<FaWind className="text-blue-500" />} label="Wind" value={`${selectedWarehouse.weather.wind_speed.toFixed(1)} m/s`} color="text-blue-400" />
                <WeatherItem icon={<FaTint className="text-cyan-500" />} label="Humidity" value={`${selectedWarehouse.weather.humidity}%`} color="text-cyan-400" />
              </div>
              <p className="mb-2"><strong>Location:</strong> {selectedWarehouse.location}</p>
              <p className="mb-2"><strong>Type:</strong> {selectedWarehouse.type}</p>
              <p className="mb-4"><strong>Address:</strong> {selectedWarehouse.address}</p>
              <button 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
                onClick={() => onWarehouseClick(selectedWarehouse)}
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WeatherItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="flex items-center bg-gray-700 p-3 rounded-lg">
      <div className="text-2xl mr-2">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`font-semibold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
