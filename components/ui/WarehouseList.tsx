import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Warehouse } from '@/app/types/warehouseTypes';
import { WarehouseDetailCard } from './WarehouseDetailCard';

interface WarehouseListProps {
  warehouses: Warehouse[];
  onClose: () => void;
}

export function WarehouseList({ warehouses, onClose }: WarehouseListProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  return (
    <Card className="fixed top-10 left-10 right-10 bottom-10 bg-gray-900 border-green-400 border-2 z-50 overflow-auto">
      <CardHeader className="p-4 bg-gray-800 flex justify-between items-center">
        <CardTitle className="text-2xl text-green-400">Warehouses</CardTitle>
        <button onClick={onClose} className="text-green-400 text-xl">&times;</button>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-3 gap-4">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="p-4 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
            onClick={() => setSelectedWarehouse(warehouse)}
          >
            <h3 className="text-xl text-green-400">{warehouse.name}</h3>
            <p>Temperature: {(warehouse.weather?.temp - 273.15).toFixed(1)}°C</p>
            <p>Humidity: {warehouse.weather?.humidity}%</p>
            <p>UV Index: {warehouse.weather?.uvi.toFixed(1)}</p>
          </div>
        ))}
      </CardContent>
      {selectedWarehouse && (
        <WarehouseDetailCard
          warehouse={selectedWarehouse}
          forecast={selectedWarehouse.weather.forecast} // Update this line
          onClose={() => setSelectedWarehouse(null)}
        />
      )}
    </Card>
  );
}
