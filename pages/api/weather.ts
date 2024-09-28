import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
  if (!API_KEY) {
    console.error('OPENWEATHERMAP_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}`;

  try {
    console.log('Fetching weather data from:', url);
    const response = await axios.get(url);
    console.log('Weather API response:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in weather API:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      if (error.response?.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      }
    }
    res.status(500).json({ 
      error: 'Failed to fetch weather data', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
