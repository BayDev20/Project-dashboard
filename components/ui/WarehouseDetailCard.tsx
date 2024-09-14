import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Warehouse as WarehouseType } from '@/app/data/warehouseData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Update the Warehouse interface
interface Warehouse {
  // ... existing properties ...
  name: string;
  location: string;
  type: string;
  address: string;
  temp: number;
  aqi: number;
  uvIndex: number;
}

interface WarehouseDetailCardProps {
  warehouse: WarehouseType;
  onClose: () => void;
}

export function WarehouseDetailCard({ warehouse, onClose }: WarehouseDetailCardProps) {
  const mockHistoricalData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    temperature: Math.round(warehouse.temp + (Math.random() - 0.5) * 10),
    aqi: Math.round(warehouse.aqi + (Math.random() - 0.5) * 20),
    uvIndex: Math.round(warehouse.uvIndex + (Math.random() - 0.5) * 2),
  }));

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{warehouse.name} Details</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Location:</strong> {warehouse.location}</p>
        <p><strong>Type:</strong> {warehouse.type}</p>
        <p><strong>Address:</strong> {warehouse.address}</p>
        {/* ... (keep the rest of the component) */}
      </CardContent>
    </Card>
  );
}
