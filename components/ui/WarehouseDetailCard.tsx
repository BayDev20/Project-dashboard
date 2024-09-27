import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area, AreaChart } from 'recharts';
import { FaTemperatureHigh, FaWind, FaCompass, FaThermometerHalf } from 'react-icons/fa';
import { format, fromUnixTime } from 'date-fns';
import { Warehouse } from '@/app/types/warehouseTypes';

const kelvinToFahrenheit = (kelvin: number) => ((kelvin - 273.15) * 9/5 + 32).toFixed(1);
const mpsToMph = (mps: number) => (mps * 2.237).toFixed(1);

// Remove or comment out the unused function
// const getWeatherIcon = (description: string) => { ... };

interface ForecastData {
  daily: Array<{
    dt: number;
    temp: { day: number; min: number; max: number };
    weather: Array<{ description: string }>;
  }>;
  hourly: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    weather: Array<{ description: string }>;
  }>;
}

export function WarehouseDetailCard({ warehouse, forecast, onClose }: { warehouse: Warehouse; forecast: ForecastData; onClose: () => void }) {
  const formatDate = (unixTime: number) => format(fromUnixTime(unixTime), 'MMM d');
  const formatHour = (unixTime: number) => format(fromUnixTime(unixTime), 'HH:mm');

  const dailyForecastData = forecast.daily.map((day) => ({
    date: day.dt,
    temp: parseFloat(kelvinToFahrenheit(day.temp.day)),
    min: parseFloat(kelvinToFahrenheit(day.temp.min)),
    max: parseFloat(kelvinToFahrenheit(day.temp.max)),
    description: day.weather[0].description
  }));

  const hourlyForecastData = forecast.hourly.slice(0, 24).map((hour) => ({
    time: hour.dt,
    temp: parseFloat(kelvinToFahrenheit(hour.temp)),
    feelsLike: parseFloat(kelvinToFahrenheit(hour.feels_like)),
    description: hour.weather[0].description
  }));

  // Remove the unused 'temperature' variable
  // const temperature = warehouse.weather?.temp ? `${kelvinToFahrenheit(warehouse.weather.temp)}°F` : 'N/A';

  return (
    <div className="warehouse-detail-card bg-gray-900 p-6 rounded-lg shadow-lg w-screen h-screen flex flex-col text-green-400 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-green-500">{warehouse.name} - Mission Control</h2>
        <button 
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition-colors duration-200"
          aria-label="Close warehouse details"
        >
          Close
        </button>
      </div>
      
      <div className="h-1 bg-cyan-500 w-full mb-4 glow-cyan"></div>
      
      <div className="flex flex-wrap justify-between items-center mb-4">
        {[
          { icon: <FaTemperatureHigh className="text-3xl mb-2 text-red-400" />, label: "Temperature", value: `${kelvinToFahrenheit(warehouse.weather.temp)}°F` },
          { icon: <FaThermometerHalf className="text-3xl mb-2 text-orange-400" />, label: "Feels Like", value: `${kelvinToFahrenheit(warehouse.weather.feels_like)}°F` },
          { icon: <FaWind className="text-3xl mb-2 text-blue-400" />, label: "Wind", value: `${mpsToMph(warehouse.weather.wind_speed)} mph` },
          { icon: <FaCompass className="text-3xl mb-2 text-indigo-400" />, label: "Wind Direction", value: `${warehouse.weather.wind_deg}°` },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {item.icon}
            <span className="text-xs mb-1">{item.label}</span>
            <span className="font-bold text-lg">{item.value}</span>
          </div>
        ))}
      </div>
      
      <div className="h-1 bg-cyan-500 w-full mb-4 glow-cyan"></div>
      
      <div className="grid grid-cols-2 gap-6 flex-grow">
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-green-500">5-Day Forecast</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyForecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip 
                labelFormatter={formatDate} 
                formatter={(value, name) => [
                  `${value}°F`,
                  name === 'temp' ? 'Avg' : (typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name)
                ]}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              />
              <Legend />
              <Area type="monotone" dataKey="min" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="max" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-green-500">24-Hour Forecast</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyForecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" tickFormatter={formatHour} stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip 
                labelFormatter={formatHour} 
                formatter={(value, name) => [`${value}°F`, name === 'temp' ? 'Temperature' : 'Feels Like']}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
              />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="feelsLike" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="h-1 bg-cyan-500 w-full mt-4 glow-cyan"></div>
    </div>
  );
}
