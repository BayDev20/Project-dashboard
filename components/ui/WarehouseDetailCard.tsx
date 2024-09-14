import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Warehouse as WarehouseType } from '@/app/data/warehouseData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FaTemperatureHigh, FaWind, FaSun, FaWarehouse, FaMapMarkerAlt, FaBoxOpen, FaTimes, FaDownload, FaChartLine } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

interface WarehouseDetailCardProps {
  warehouse: WarehouseType;
  onClose: () => void;
  comparisonWarehouse?: WarehouseType;
}

type TimeRange = '24h' | '7d' | '30d';

export function WarehouseDetailCard({ warehouse, onClose, comparisonWarehouse }: WarehouseDetailCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockHistoricalData = useMemo(() => {
    const generateData = (baseValue: number, hourlyVariation: number, dataPoints: number) => {
      let value = baseValue;
      return Array.from({ length: dataPoints }, () => {
        value += (Math.random() - 0.5) * hourlyVariation;
        return Math.round(value * 10) / 10;
      });
    };

    const dataPoints = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    const temperatures = generateData(warehouse.temp, 1, dataPoints);
    const aqiValues = generateData(warehouse.aqi, 2, dataPoints);
    const uvIndices = generateData(warehouse.uvIndex, 0.2, dataPoints);

    return Array.from({ length: dataPoints }, (_, i) => ({
      time: timeRange === '24h' ? `${i}:00` : `Day ${i + 1}`,
      temperature: temperatures[i],
      aqi: Math.max(0, Math.round(aqiValues[i])),
      uvIndex: Math.max(0, uvIndices[i]),
    }));
  }, [warehouse.temp, warehouse.aqi, warehouse.uvIndex, timeRange]);

  const comparisonData = useMemo(() => {
    if (!comparisonWarehouse) return null;
    // Generate comparison data similar to mockHistoricalData
  }, [comparisonWarehouse, timeRange]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulate data fetching
    setTimeout(() => {
      if (Math.random() > 0.9) {
        setError('Failed to load data. Please try again.');
      } else {
        setIsLoading(false);
      }
    }, 1000);
  }, [timeRange, warehouse, comparisonWarehouse]);

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + mockHistoricalData.map(row => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${warehouse.name}_historical_data.csv`);
    document.body.appendChild(link);
    link.click();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl mx-auto bg-gray-900 text-green-400 border-green-500 shadow-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4">Loading warehouse data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl mx-auto bg-gray-900 text-green-400 border-green-500 shadow-lg p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-green-500 text-black px-4 py-2 rounded">
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-auto bg-gray-900 text-green-400 border-green-500 shadow-lg overflow-y-auto max-h-[90vh]">
        <CardHeader className="border-b border-green-500">
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center">
              <FaWarehouse className="mr-2" />
              {warehouse.name}
            </span>
            <button onClick={onClose} className="text-green-400 hover:text-green-300">
              <FaTimes size={24} />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">Warehouse Information</h4>
            <p className="flex items-center"><FaMapMarkerAlt className="mr-2" /> Location: {warehouse.location}</p>
            <p className="flex items-center"><FaBoxOpen className="mr-2" /> Type: {warehouse.type}</p>
            <p className="flex items-center"><FaMapMarkerAlt className="mr-2" /> Address: {warehouse.address}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Current Conditions</h4>
            <p className="flex items-center"><FaTemperatureHigh className="mr-2" /> Temperature: {warehouse.temp}°F</p>
            <p className="flex items-center"><FaWind className="mr-2" /> AQI: {warehouse.aqi}</p>
            <p className="flex items-center"><FaSun className="mr-2" /> UV Index: {warehouse.uvIndex}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-lg font-semibold mb-2">Weather Forecast</h4>
            {/* Add a mock 5-day forecast here */}
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map(day => (
                <div key={day} className="text-center">
                  <p>Day {day}</p>
                  <FaSun className="mx-auto my-2" />
                  <p>{Math.round(warehouse.temp + (Math.random() - 0.5) * 10)}°F</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-lg font-semibold mb-2">Historical Data</h4>
            <div className="flex justify-start space-x-4 mb-4">
              <button
                onClick={() => setTimeRange('24h')}
                className={`px-3 py-1 rounded ${timeRange === '24h' ? 'bg-green-500 text-black' : 'bg-gray-700 text-green-400'}`}
              >
                24 Hours
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 rounded ${timeRange === '7d' ? 'bg-green-500 text-black' : 'bg-gray-700 text-green-400'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 rounded ${timeRange === '30d' ? 'bg-green-500 text-black' : 'bg-gray-700 text-green-400'}`}
              >
                30 Days
              </button>
              <button onClick={exportData} className="bg-blue-500 text-white px-3 py-1 rounded flex items-center">
                <FaDownload className="mr-2" /> Export
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="time" stroke="#22c55e" />
                <YAxis stroke="#22c55e" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #22c55e' }}
                  labelStyle={{ color: '#22c55e' }}
                />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°F)" />
                <Line type="monotone" dataKey="aqi" stroke="#3b82f6" name="AQI" />
                <Line type="monotone" dataKey="uvIndex" stroke="#eab308" name="UV Index" />
                {comparisonData && (
                  <>
                    <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Comparison Temp (°F)" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="aqi" stroke="#3b82f6" name="Comparison AQI" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="uvIndex" stroke="#eab308" name="Comparison UV" strokeDasharray="5 5" />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
