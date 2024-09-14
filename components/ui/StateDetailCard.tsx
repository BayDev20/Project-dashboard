import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { Warehouse } from '@/app/data/warehouseData';
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
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [isHovering, setIsHovering] = useState(false);

  const center = geoCentroid(stateFeature);

  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setPosition({ coordinates: [warehouse.longitude, warehouse.latitude], zoom: 4 });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-green-400 p-4 z-50 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{stateName} Details</h2>
        <button onClick={onClose} className="text-xl bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">&times;</button>
      </div>
      <div className="flex gap-4">
        <div className="w-2/3 border-2 border-green-400 rounded-lg overflow-hidden">
          <ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 1000 }}>
            <ZoomableGroup zoom={position.zoom} center={position.coordinates as [number, number]} onMoveEnd={setPosition}>
              <Geographies geography={geoUrl}>
                {({ geographies }) => geographies
                  .filter(d => d.id === stateFeature.id)
                  .map(geo => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHovering ? "#00ff00" : "#2a2a2a"}
                      stroke="#3a3a3a"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {warehouses.map((warehouse) => (
                <Marker key={warehouse.name} coordinates={[warehouse.longitude, warehouse.latitude]}>
                  <circle 
                    r={5} 
                    fill={selectedWarehouse?.name === warehouse.name ? "#00ff00" : "#ff0000"}
                    onClick={() => handleWarehouseSelect(warehouse)}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
        <div className="w-1/3 flex flex-col">
          <div className="bg-gray-800 p-4 rounded-lg mb-4 flex-grow overflow-auto">
            <h3 className="text-xl mb-2">Warehouses ({warehouses.length})</h3>
            <ul className="space-y-2">
              {warehouses.map((warehouse) => (
                <li 
                  key={warehouse.name} 
                  className={`cursor-pointer hover:bg-gray-700 p-2 rounded ${selectedWarehouse?.name === warehouse.name ? 'bg-green-800' : ''}`}
                  onClick={() => handleWarehouseSelect(warehouse)}
                >
                  {warehouse.name}
                </li>
              ))}
            </ul>
          </div>
          {selectedWarehouse && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-xl mb-2">{selectedWarehouse.name}</h4>
              <p><strong>Location:</strong> {selectedWarehouse.location}</p>
              <p><strong>Type:</strong> {selectedWarehouse.type}</p>
              <p><strong>Address:</strong> {selectedWarehouse.address}</p>
              <p><strong>Temperature:</strong> {selectedWarehouse.temp}°F</p>
              <p><strong>AQI:</strong> {selectedWarehouse.aqi}</p>
              <p><strong>UV Index:</strong> {selectedWarehouse.uvIndex}</p>
              <button 
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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
