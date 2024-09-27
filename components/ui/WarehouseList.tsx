import React, { useState, useMemo } from 'react';
import { Warehouse } from '@/app/types/warehouseTypes';
import { StateDetailCard } from './StateDetailCard';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

interface WarehouseListProps {
  warehouses: Warehouse[];
  onClose: () => void;
}

export const WarehouseList: React.FC<WarehouseListProps> = ({ warehouses, onClose }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const warehousesByState = useMemo(() => {
    return warehouses.reduce((acc, warehouse) => {
      if (!acc[warehouse.state]) {
        acc[warehouse.state] = [];
      }
      acc[warehouse.state].push(warehouse);
      return acc;
    }, {} as Record<string, Warehouse[]>);
  }, [warehouses]);

  const handleWarehouseClick = (stateName: string) => {
    setSelectedState(stateName);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-3/4 h-3/4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-green-400">All Warehouses</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(warehousesByState).map(([state, stateWarehouses]) => (
            <div key={state} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-green-300">{state}</h3>
              <ul>
                {stateWarehouses.map((warehouse) => (
                  <li 
                    key={warehouse.name} 
                    className="cursor-pointer hover:bg-gray-600 p-2 rounded"
                    onClick={() => handleWarehouseClick(state)}
                  >
                    {warehouse.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
      {selectedState && (
        <StateDetailCard
          stateName={selectedState}
          warehouses={warehousesByState[selectedState]}
          onClose={() => setSelectedState(null)}
          stateFeature={{} as Feature<Geometry, GeoJsonProperties>}
          onWarehouseClick={() => {}}
        />
      )}
    </div>
  );
};
