import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Warehouse } from '@/app/data/warehouseData';
import { WarehouseDetailCard } from './WarehouseDetailCard';

// Ensure the Warehouse interface in warehouseData.ts includes an id property
// If you can't modify the original interface, you can extend it here:
interface WarehouseWithId extends Warehouse {
  id: string | number;
}

// Update the component props and state to use WarehouseWithId
interface WarehouseListProps {
  warehouses: WarehouseWithId[];
  onClose: () => void;
}

export function WarehouseList({ warehouses, onClose }: WarehouseListProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseWithId | null>(null);

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
            <p>Temperature: {warehouse.temp}°F</p>
            <p>AQI: {warehouse.aqi}</p>
            <p>UV Index: {warehouse.uvIndex}</p>
          </div>
        ))}
      </CardContent>
      {selectedWarehouse && (
        <WarehouseDetailCard
          warehouse={selectedWarehouse}
          onClose={() => setSelectedWarehouse(null)}
        />
      )}
    </Card>
  );
}
