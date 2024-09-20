import axios from 'axios';

export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

// Remove getForecastData as it's now included in the onecall API
