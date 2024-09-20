import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { Warehouse } from '@/app/types/warehouseTypes';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface StateDetailCardProps {
  stateName: string;
  warehouses: Warehouse[];
  onClose: () => void;
  stateFeature: Feature<Geometry, GeoJsonProperties>;
  onWarehouseClick: (warehouse: Warehouse) => void;
}

export function StateDetailCard({ stateName, warehouses, onClose, stateFeature, onWarehouseClick }: StateDetailCardProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [position, setPosition] = useState({ coordinates: geoCentroid(stateFeature), zoom: 1 });

  return (
    <div className="fixed inset-0 bg-gray-900 text-green-400 p-6 z-50 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{stateName} Warehouses</h2>
        <button onClick={onClose} className="text-xl bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300">&times;</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 border-2 border-green-400 rounded-lg overflow-hidden shadow-lg">
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
                    r={6} 
                    fill={selectedWarehouse?.name === warehouse.name ? "#00ff00" : "#ff0000"}
                    stroke="#fff"
                    strokeWidth={2}
                    onClick={() => setSelectedWarehouse(warehouse)}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex-grow overflow-auto">
            <h3 className="text-xl font-bold mb-4">Warehouses ({warehouses.length})</h3>
            <ul className="space-y-2">
              {warehouses.map((warehouse) => (
                <li 
                  key={warehouse.name} 
                  className={`cursor-pointer hover:bg-gray-700 p-3 rounded transition duration-300 ${selectedWarehouse?.name === warehouse.name ? 'bg-green-800' : ''}`}
                  onClick={() => setSelectedWarehouse(warehouse)}
                >
                  {warehouse.name}
                </li>
              ))}
            </ul>
          </div>
          {selectedWarehouse && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-4">{selectedWarehouse.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Location" value={selectedWarehouse.location} />
                <InfoItem label="Type" value={selectedWarehouse.type} />
                <InfoItem label="Temperature" value={`${(selectedWarehouse.weather.temp - 273.15).toFixed(1)}°C`} />
                <InfoItem label="Humidity" value={`${selectedWarehouse.weather.humidity}%`} />
                <InfoItem label="UV Index" value={selectedWarehouse.weather.uvi.toFixed(1)} />
                <InfoItem label="Wind Speed" value={`${selectedWarehouse.weather.wind_speed.toFixed(1)} m/s`} />
                {selectedWarehouse.weather.description && (
                  <InfoItem label="Description" value={selectedWarehouse.weather.description} />
                )}
              </div>
              <p className="mt-4"><strong>Address:</strong> {selectedWarehouse.address}</p>
              <button 
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
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

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
