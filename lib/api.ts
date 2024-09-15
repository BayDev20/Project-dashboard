import axios from 'axios';

export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  console.log('API Key:', API_KEY); // Add this line to check the API key

  if (!API_KEY) {
    throw new Error('API key is missing. Please check your environment variables.');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  
  console.log('Fetching weather data from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));

  try {
    const response = await axios.get(url);
    console.log('API response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      throw new Error(`Failed to fetch weather data: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

export async function getForecastData(lat: number, lon: number) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  
  const response = await axios.get(url);
  return response.data.list.map((item: any) => ({
    date: new Date(item.dt * 1000).toLocaleDateString(),
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: item.main.temp,
    humidity: item.main.humidity,
    weather: item.weather[0].main
  }));
}
