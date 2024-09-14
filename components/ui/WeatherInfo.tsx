import { Warehouse } from '../../app/types/warehouseTypes';

export default function WeatherInfo({ weather, temp }: { weather: Warehouse['weather'], temp: number }) {
  return (
    <div>
      <h2>Current Weather</h2>
      <p>Temperature: {temp}°F</p>
      <p>Condition: {weather.description}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind Speed: {weather.windSpeed} mph</p>
      <p>UV Index: {weather.uvIndex}</p>
      <p>AQI: {weather.aqi}</p>
    </div>
  );
}
