import React, { useState, useEffect } from 'react';
import { getWeatherData, getForecastData } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { FaTemperatureHigh, FaWind, FaTint, FaCloudSun, FaCompass, FaCloudRain } from 'react-icons/fa';
import { format } from 'date-fns';

interface Warehouse {
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
  };
  weather: Array<{ description: string; main: string }>;
  wind: {
    speed: number;
    deg: number;
  };
  rain?: { '1h': number };
}

interface ForecastData {
  date: string;
  temp: number;
  time: string;
  temp_min: number;
  temp_max: number;
  pop: number;
}

export function WarehouseDetailCard({ warehouse, onClose }: { warehouse: Warehouse; onClose: () => void }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [weather, forecast] = await Promise.all([
          getWeatherData(warehouse.latitude, warehouse.longitude),
          getForecastData(warehouse.latitude, warehouse.longitude)
        ]);
        setWeatherData(weather);
        setForecastData(forecast);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [warehouse.latitude, warehouse.longitude]);

  if (isLoading) return <div className="text-center p-4">Loading weather data...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  const windDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const formatDate = (dateString: string) => format(new Date(dateString), 'MMM d');

  const getBarColor = (temp: number) => temp >= 90 ? '#EF4444' : '#82ca9d';

  return (
    <div className="warehouse-detail-card bg-gray-800 p-4 rounded-lg shadow-lg w-[95vw] h-[95vh] flex flex-col text-green-400 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-2xl font-bold mb-2 text-green-500">{warehouse.name}</h2>
      <p className="mb-2 text-sm">Location: {warehouse.city}</p>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        <div className="bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FaTemperatureHigh className="text-2xl mb-2 text-orange-400" />
          <p className="text-sm text-gray-300">Feels Like</p>
          <p className="text-xl font-bold text-orange-400">{weatherData?.main.feels_like.toFixed(1)}°F</p>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FaWind className="text-2xl mb-2 text-blue-400" />
          <p className="text-sm text-gray-300">Wind</p>
          <p className="text-xl font-bold text-blue-400">{weatherData?.wind.speed.toFixed(1)} mph</p>
          <p className="text-sm text-gray-300">{windDirection(weatherData?.wind.deg || 0)}</p>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FaTint className="text-2xl mb-2 text-cyan-400" />
          <p className="text-sm text-gray-300">Humidity</p>
          <p className="text-xl font-bold text-cyan-400">{weatherData?.main.humidity}%</p>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FaCloudRain className="text-2xl mb-2 text-indigo-400" />
          <p className="text-sm text-gray-300">Precipitation</p>
          <p className="text-xl font-bold text-indigo-400">{weatherData?.rain?.['1h'] || 0} mm</p>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FaCloudSun className="text-2xl mb-2 text-yellow-400" />
          <p className="text-sm text-gray-300">Weather</p>
          <p className="text-xl font-bold text-yellow-400">{weatherData?.weather[0].main}</p>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FaCompass className="text-2xl mb-2 text-green-400" />
          <p className="text-sm text-gray-300">Pressure</p>
          <p className="text-xl font-bold text-green-400">{weatherData?.main.pressure} hPa</p>
        </div>
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mb-2">5-Day Forecast</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#374151', border: 'none' }}
                  labelFormatter={formatDate}
                />
                <Line type="monotone" dataKey="temp" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="temp_min" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="temp_max" stroke="#ffc658" strokeWidth={2} />
                {forecastData[0].pop !== undefined && (
                  <Line type="monotone" dataKey="pop" stroke="#8884d8" strokeWidth={2} yAxisId="right" />
                )}
                <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mb-2">Hourly Forecast</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData.slice(0, 8)}>
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  tickFormatter={(time) => time.slice(0, 5)} // Display only HH:MM
                  interval={0} // Show all ticks
                  tick={{ fontSize: 12 }} // Adjust font size
                  padding={{ left: 10, right: 10 }} // Add padding
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tickFormatter={(temp) => `${temp}°F`} // Add °F to temperature
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#374151', border: 'none' }}
                  formatter={(value) => [`${value}°F`, 'Temperature']} // Format tooltip
                />
                <Bar dataKey="temp">
                  {forecastData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.temp)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
