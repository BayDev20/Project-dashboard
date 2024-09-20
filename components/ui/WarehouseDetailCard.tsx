import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { FaTemperatureHigh, FaWind, FaTint, FaCloudSun, FaCompass, FaSun } from 'react-icons/fa';
import { format, fromUnixTime } from 'date-fns';
import { Warehouse } from '@/app/types/warehouseTypes';
import { IconType } from 'react-icons';

export function WarehouseDetailCard({ warehouse, forecast, onClose }: { warehouse: Warehouse; forecast: any; onClose: () => void }) {
  if (!warehouse.weather) {
    return <div>Loading weather data...</div>;
  }

  const { weather } = warehouse;

  const windDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const formatDate = (unixTime: number) => format(fromUnixTime(unixTime), 'MMM d');

  const getBarColor = (temp: number) => temp >= 90 ? '#EF4444' : '#82ca9d';

  return (
    <div className="warehouse-detail-card bg-gray-800 p-4 rounded-lg shadow-lg w-[95vw] h-[95vh] flex flex-col text-green-400 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-2xl font-bold mb-2 text-green-500">{warehouse.name}</h2>
      <p className="mb-2 text-sm">Location: {warehouse.location}</p>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        <WeatherInfoCard icon={FaTemperatureHigh} label="Temperature" value={`${(weather.temp - 273.15).toFixed(1)}°C`} color="text-orange-400" />
        <WeatherInfoCard icon={FaWind} label="Wind" value={`${weather.wind_speed.toFixed(1)} mph`} color="text-blue-400" />
        <WeatherInfoCard icon={FaTint} label="Humidity" value={`${weather.humidity}%`} color="text-cyan-400" />
        <WeatherInfoCard icon={FaSun} label="UV Index" value={weather.uvi.toFixed(1)} color="text-yellow-400" />
        <WeatherInfoCard icon={FaCloudSun} label="Weather" value={weather.description} color="text-indigo-400" />
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ForecastChart data={forecast.daily} formatDate={formatDate} />
        <HourlyForecastChart data={forecast.hourly.slice(0, 24)} getBarColor={getBarColor} />
      </div>

      <button 
        onClick={onClose}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  );
}

// Add this component definition
const WeatherInfoCard = ({ icon: Icon, label, value, subValue, color }: { icon: IconType; label: string; value: string; subValue?: string; color: string }) => (
  <div className={`flex flex-col items-center ${color}`}>
    <Icon className="text-2xl mb-1" />
    <span className="text-xs">{label}</span>
    <span className="font-bold">{value}</span>
    {subValue && <span className="text-xs">{subValue}</span>}
  </div>
);

// Add ForecastChart component definition
const ForecastChart = ({ data, formatDate }: { data: any[]; formatDate: (unixTime: number) => string }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="dt" tickFormatter={formatDate} />
      <YAxis />
      <Tooltip labelFormatter={formatDate} />
      <Line type="monotone" dataKey="temp.day" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

// Add HourlyForecastChart component definition
const HourlyForecastChart = ({ data, getBarColor }: { data: any[]; getBarColor: (temp: number) => string }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="dt" tickFormatter={(unixTime) => format(fromUnixTime(unixTime), 'HH:mm')} />
      <YAxis />
      <Tooltip labelFormatter={(unixTime) => format(fromUnixTime(unixTime), 'MMM d, HH:mm')} />
      <Bar dataKey="temp">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getBarColor(entry.temp)} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);
