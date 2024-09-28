import axios from 'axios';

export async function getWeatherData(lat: number, lon: number) {
  const url = `/api/weather?lat=${lat}&lon=${lon}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

// Remove getForecastData as it's now included in the onecall API
