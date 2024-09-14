import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const queue: (() => void)[] = [];
let processing = false;

function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;
  queue.shift()!();
  setTimeout(() => {
    processing = false;
    processQueue();
  }, 60000 / 55);
}

export async function getWeatherData(lat: number, lon: number) {
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const response = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`);
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
}
