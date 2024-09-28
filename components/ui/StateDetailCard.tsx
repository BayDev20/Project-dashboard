import React, { useRef, useCallback, useState, useEffect } from 'react';
import { FaThermometerHalf, FaWind, FaClock, FaInfoCircle, FaBoxes } from 'react-icons/fa';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import { format } from 'date-fns';
import { Warehouse } from '../../app/types/warehouseTypes';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface StateDetailCardProps {
  stateName: string;
  warehouses: Warehouse[];
  onClose: () => void;
  stateFeature: Feature<Geometry, GeoJsonProperties>;
  onWarehouseClick: (warehouse: Warehouse) => void;
}

const kelvinToFahrenheit = (kelvin: number | undefined) => 
  kelvin ? Math.round((kelvin - 273.15) * 9/5 + 32) : 'N/A';
const metersPerSecondToMph = (mps: number | undefined) => mps ? (mps * 2.237).toFixed(1) : 'N/A';

export const StateDetailCard = React.memo(function StateDetailCard({ 
  stateName, 
  warehouses, 
  onClose, 
  stateFeature, 
  onWarehouseClick 
}: StateDetailCardProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(warehouses[0] || null);
  const [selectedIndex, setSelectedIndex] = useState(warehouses.length > 0 ? 0 : -1);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleWarehouseSelect = useCallback((warehouse: Warehouse, index: number) => {
    setSelectedIndex(index);
    setSelectedWarehouse(warehouse);
    
    if (googleMap.current) {
      googleMap.current.panTo({ lat: warehouse.latitude, lng: warehouse.longitude });
      googleMap.current.setZoom(10);
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || googleMap.current) return;

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(() => {
      const mapOptions: google.maps.MapOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
      };

      if (mapRef.current) {
        googleMap.current = new google.maps.Map(mapRef.current, mapOptions);

        const bounds = new google.maps.LatLngBounds();
        warehouses.forEach((warehouse, index) => {
          bounds.extend({ lat: warehouse.latitude, lng: warehouse.longitude });

          const tempF = kelvinToFahrenheit(warehouse.weather.temp);
          const isHot = typeof tempF === 'number' && tempF > 90;
          const marker = new google.maps.Marker({
            position: { lat: warehouse.latitude, lng: warehouse.longitude },
            map: googleMap.current,
            title: warehouse.name,
            icon: isHot ? {
              path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
              fillColor: "#FF0000",
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 2,
              anchor: new google.maps.Point(12, 24),
            } : {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#00FF00",
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: "#008000"
            }
          });

          marker.addListener('click', () => {
            handleWarehouseSelect(warehouse, index);
          });

          markersRef.current.push(marker);
        });

        googleMap.current.fitBounds(bounds);

        if (stateFeature) {
          googleMap.current.data.addGeoJson(stateFeature);
          googleMap.current.data.setStyle({
            fillColor: 'transparent',
            strokeColor: '#3a3a3a',
            strokeWeight: 2,
          });
        }
      }
    });
  }, [warehouses, stateFeature, handleWarehouseSelect]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const newIndex = (selectedIndex + direction + warehouses.length) % warehouses.length;
        handleWarehouseSelect(warehouses[newIndex], newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, warehouses, handleWarehouseSelect]);

  const WeatherItem = React.memo(function WeatherItem({ 
    icon, 
    label, 
    value, 
    color, 
    weatherId,
    forecast
  }: { 
    icon: React.ReactNode, 
    label: string, 
    value: string, 
    color: string, 
    weatherId?: number,
    forecast?: { temp: number, weather: { id: number, description: string }[] }[]
  }) {
    return (
      <div className="flex flex-col bg-gray-700 p-3 rounded-lg">
        <div className="flex items-center">
          <div className="text-2xl mr-2">{icon}</div>
          <div className="flex-grow">
            <p className="text-sm text-gray-400">{label}</p>
            <p className={`font-semibold ${color}`}>{value}</p>
          </div>
          {weatherId && <div className="text-3xl">{getWeatherIcon(weatherId)}</div>}
        </div>
        {forecast && (
          <div className="mt-2 text-xs">
            <p className="font-semibold">Forecast:</p>
            {forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="flex justify-between">
                <span>{getWeatherIcon(day.weather[0].id)}</span>
                <span>{day.temp}°F</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="fixed inset-0 bg-gray-900 text-green-400 p-6 z-50 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{stateName} Warehouses</h2>
        <button onClick={onClose} className="text-xl bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300">&times;</button>
      </div>
      
      <div className="h-1 bg-cyan-500 w-full mb-6 glow-cyan"></div>

      <div className="flex flex-grow overflow-hidden gap-6">
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex-grow">
            <h3 className="text-xl font-bold mb-4">Warehouse Map</h3>
            <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex-grow">
            <h3 className="text-xl font-bold mb-4">State Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Average Temperature:</p>
                <p className="text-2xl">{calculateAverageTemperature(warehouses)}°F</p>
              </div>
              <div>
                <p className="font-semibold">Highest Temperature:</p>
                <p className="text-2xl">{findHighestTemperature(warehouses)}°F</p>
              </div>
              <div>
                <p className="font-semibold">Lowest Temperature:</p>
                <p className="text-2xl">{findLowestTemperature(warehouses)}°F</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex-grow overflow-auto">
            <h3 className="text-xl font-bold mb-4">Warehouses ({warehouses.length})</h3>
            <ul className="space-y-2">
              {warehouses.map((warehouse, index) => (
                <li 
                  key={warehouse.name}
                  className={`cursor-pointer hover:bg-gray-700 p-3 rounded transition duration-300 ${index === selectedIndex ? 'bg-green-800' : ''}`}
                  onClick={() => handleWarehouseSelect(warehouse, index)}
                >
                  <div className="flex justify-between items-center">
                    <span>{warehouse.name}</span>
                    <span>{kelvinToFahrenheit(warehouse.weather.temp)}°F</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {selectedWarehouse && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h4 className="text-2xl font-bold mb-4 text-cyan-400">{selectedWarehouse.name}</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <WeatherItem 
                  icon={<FaThermometerHalf className="text-red-500" />} 
                  label="Temperature" 
                  value={`${kelvinToFahrenheit(selectedWarehouse.weather.temp)}°F`} 
                  color="text-red-400"
                  weatherId={selectedWarehouse.weather.weather[0].id}
                />
                <WeatherItem 
                  icon={<FaWind className="text-blue-500" />} 
                  label="Wind" 
                  value={`${metersPerSecondToMph(selectedWarehouse.weather.wind_speed)} mph`} 
                  color="text-blue-400" 
                />
                <WeatherItem 
                  icon={<FaClock className="text-yellow-500" />} 
                  label="Current Time" 
                  value={format(currentTime, 'HH:mm:ss')} 
                  color="text-yellow-400" 
                />
                <WeatherItem 
                  icon={getWeatherIcon(selectedWarehouse.weather.weather[0].id)} 
                  label="Weather" 
                  value={selectedWarehouse.weather.weather[0].description} 
                  color="text-white" 
                />
              </div>
              <div className="mb-4">
                <h5 className="text-lg font-semibold mb-2 text-green-400">Location</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Latitude:</span> {selectedWarehouse.latitude.toFixed(4)}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span> {selectedWarehouse.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 flex items-center justify-center"
                  onClick={() => onWarehouseClick(selectedWarehouse)}
                >
                  <FaInfoCircle className="mr-2" /> View Details
                </button>
                <button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300 flex items-center justify-center"
                  onClick={() => {/* Implement inventory check logic */}}
                >
                  <FaBoxes className="mr-2" /> Check Inventory
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const getWeatherIcon = (weatherId: number) => {
  if (weatherId < 300) return <WiThunderstorm />;
  if (weatherId < 500) return <WiRain />;
  if (weatherId < 600) return <WiRain />;
  if (weatherId < 700) return <WiSnow />;
  if (weatherId < 800) return <WiFog />;
  if (weatherId === 800) return <WiDaySunny />;
  return <WiCloudy />;
};

const calculateAverageTemperature = (warehouses: Warehouse[]) => {
  const sum = warehouses.reduce((acc, warehouse) => acc + warehouse.weather.temp, 0);
  return kelvinToFahrenheit(sum / warehouses.length);
};

const findHighestTemperature = (warehouses: Warehouse[]) => {
  const highest = Math.max(...warehouses.map(w => w.weather.temp));
  return kelvinToFahrenheit(highest);
};

const findLowestTemperature = (warehouses: Warehouse[]) => {
  const lowest = Math.min(...warehouses.map(w => w.weather.temp));
  return kelvinToFahrenheit(lowest);
};