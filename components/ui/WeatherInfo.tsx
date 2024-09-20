import { Warehouse } from '../../app/types/warehouseTypes';

type WeatherInfoProps = {
  weather: {
    description: string;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    aqi: number;
  };
  temp: number;
};

export default function WeatherInfo({ weather, temp }: WeatherInfoProps) {
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
