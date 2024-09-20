import { Warehouse as WarehouseType, WeatherData } from '../types/warehouseTypes';
import { getWeatherData } from '../../lib/api';

const defaultWeather = {
  temp: 0,
  feels_like: 0,
  humidity: 0,
  uvi: 0,
  wind_speed: 0,
  wind_deg: 0,
  description: '',
  weather: [],
  forecast: {
    hourly: [],
    daily: []
  }
};

export const initialWarehouses: WarehouseType[] = [
  {
    id: "AL-BHM1",
    name: "Alabama BHM1",
    state: "Alabama",
    location: "Birmingham",
    type: "Warehouse",
    address: "123 Main St, Birmingham, AL 35205",
    latitude: 33.5186,
    longitude: -86.8104,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "AL-HSV1",
    name: "Alabama HSV1",
    state: "Alabama",
    location: "Huntsville",
    type: "Warehouse",
    address: "456 Elm St, Huntsville, AL 35801",
    latitude: 34.7304,
    longitude: -86.5861,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "AZ-PHX3",
    name: "Arizona PHX3",
    state: "Arizona",
    location: "Phoenix",
    type: "Warehouse",
    address: "789 Oak St, Phoenix, AZ 85001",
    latitude: 33.4484,
    longitude: -112.0740,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "AZ-TUS1",
    name: "Arizona TUS1",
    state: "Arizona",
    location: "Tucson",
    type: "Warehouse",
    address: "101 Pine St, Tucson, AZ 85701",
    latitude: 32.2217,
    longitude: -110.9747,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "CA-ONT3",
    name: "California ONT3",
    state: "California",
    location: "Ontario",
    type: "Warehouse",
    address: "222 Maple St, Ontario, CA 91761",
    latitude: 34.0634,
    longitude: -117.6173,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-LGB3",
    name: "California LGB3",
    state: "California",
    location: "Long Beach",
    type: "Warehouse",
    address: "333 Birch St, Long Beach, CA 90802",
    latitude: 33.7701,
    longitude: -118.1937,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-SNA4",
    name: "California SNA4",
    state: "California",
    location: "Santa Ana",
    type: "Warehouse",
    address: "444 Cedar St, Santa Ana, CA 92701",
    latitude: 33.7455,
    longitude: -117.8677,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-LAX9",
    name: "California LAX9",
    state: "California",
    location: "Los Angeles",
    type: "Warehouse",
    address: "555 Walnut St, Los Angeles, CA 90001",
    latitude: 34.0522,
    longitude: -118.2437,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-SMF1",
    name: "California SMF1",
    state: "California",
    location: "Sacramento",
    type: "Warehouse",
    address: "666 Oak St, Sacramento, CA 95814",
    latitude: 38.5816,
    longitude: -121.4944,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-OAK4",
    name: "California OAK4",
    state: "California",
    location: "Oakland",
    type: "Warehouse",
    address: "777 Pine St, Oakland, CA 94607",
    latitude: 37.8044,
    longitude: -122.2712,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-SJC7",
    name: "California SJC7",
    state: "California",
    location: "San Jose",
    type: "Warehouse",
    address: "888 Maple St, San Jose, CA 95110",
    latitude: 37.3382,
    longitude: -121.8863,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-SFO15",
    name: "California SFO15",
    state: "California",
    location: "San Francisco",
    type: "Warehouse",
    address: "999 Elm St, San Francisco, CA 94101",
    latitude: 37.7749,
    longitude: -122.4194,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-FAT1",
    name: "California FAT1",
    state: "California",
    location: "Fresno",
    type: "Warehouse",
    address: "111 Birch St, Fresno, CA 93706",
    latitude: 36.7378,
    longitude: -119.7871,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CA-SCK3",
    name: "California SCK3",
    state: "California",
    location: "Stockton",
    type: "Warehouse",
    address: "222 Cedar St, Stockton, CA 95203",
    latitude: 37.9577,
    longitude: -121.2908,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "CO-DEN2",
    name: "Colorado DEN2",
    state: "Colorado",
    location: "Denver",
    type: "Warehouse",
    address: "333 Walnut St, Denver, CO 80202",
    latitude: 39.7392,
    longitude: -104.9903,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CO-COS1",
    name: "Colorado COS1",
    state: "Colorado",
    location: "Colorado Springs",
    type: "Warehouse",
    address: "444 Oak St, Colorado Springs, CO 80903",
    latitude: 38.8339,
    longitude: -104.8214,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "CT-BDL2",
    name: "Connecticut BDL2",
    state: "Connecticut",
    location: "Windsor Locks",
    type: "Warehouse",
    address: "555 Elm St, Windsor Locks, CT 06096",
    latitude: 41.9289,
    longitude: -72.6815,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "CT-HFD1",
    name: "Connecticut HFD1",
    state: "Connecticut",
    location: "Hartford",
    type: "Warehouse",
    address: "666 Maple St, Hartford, CT 06103",
    latitude: 41.7658,
    longitude: -72.6734,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "DE-ILG1",
    name: "Delaware ILG1",
    state: "Delaware",
    location: "New Castle",
    type: "Warehouse",
    address: "777 Pine St, New Castle, DE 19720",
    latitude: 39.6780,
    longitude: -75.6065,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "FL-JAX2",
    name: "Florida JAX2",
    state: "Florida",
    location: "Jacksonville",
    type: "Warehouse",
    address: "888 Cedar St, Jacksonville, FL 32202",
    latitude: 30.3322,
    longitude: -81.6557,
    weather: defaultWeather,
    alerts: []
  },
  {
    id: "FL-MIA1",
    name: "Florida MIA1",
    state: "Florida",
    location: "Miami",
    type: "Warehouse",
    address: "999 Walnut St, Miami, FL 33101",
    latitude: 25.7617,
    longitude: -80.1918,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "GA-ATL1",
    name: "Georgia ATL1",
    state: "Georgia",
    location: "Atlanta",
    type: "Warehouse",
    address: "111 Birch St, Atlanta, GA 30303",
    latitude: 33.7490,
    longitude: -84.3880,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "HI-HNL1",
    name: "Hawaii HNL1",
    state: "Hawaii",
    location: "Honolulu",
    type: "Warehouse",
    address: "222 Maple St, Honolulu, HI 96817",
    latitude: 21.3069,
    longitude: -157.8583,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "ID-BOI1",
    name: "Idaho BOI1",
    state: "Idaho",
    location: "Boise",
    type: "Warehouse",
    address: "333 Walnut St, Boise, ID 83702",
    latitude: 43.6187,
    longitude: -116.2146,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "IL-ORD1",
    name: "Illinois ORD1",
    state: "Illinois",
    location: "Chicago",
    type: "Warehouse",
    address: "444 Oak St, Chicago, IL 60601",
    latitude: 41.8781,
    longitude: -87.6298,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "IN-IND1",
    name: "Indiana IND1",
    state: "Indiana",
    location: "Indianapolis",
    type: "Warehouse",
    address: "555 Elm St, Indianapolis, IN 46204",
    latitude: 39.7684,
    longitude: -86.1581,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "IA-DSM1",
    name: "Iowa DSM1",
    state: "Iowa",
    location: "Des Moines",
    type: "Warehouse",
    address: "666 Maple St, Des Moines, IA 50309",
    latitude: 41.5868,
    longitude: -93.6250,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "KS-ICT1",
    name: "Kansas ICT1",
    state: "Kansas",
    location: "Wichita",
    type: "Warehouse",
    address: "777 Pine St, Wichita, KS 67203",
    latitude: 37.6922,
    longitude: -97.3375,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "KY-SDF1",
    name: "Kentucky SDF1",
    state: "Kentucky",
    location: "Louisville",
    type: "Warehouse",
    address: "888 Cedar St, Louisville, KY 40202",
    latitude: 38.2527,
    longitude: -85.7585,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "LA-MSY1",
    name: "Louisiana MSY1",
    state: "Louisiana",
    location: "New Orleans",
    type: "Warehouse",
    address: "999 Walnut St, New Orleans, LA 70112",
    latitude: 29.9934,
    longitude: -90.2580,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "ME-PWM1",
    name: "Maine PWM1",
    state: "Maine",
    location: "Portland",
    type: "Warehouse",
    address: "111 Birch St, Portland, ME 04101",
    latitude: 43.6591,
    longitude: -70.2568,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "MD-BWI1",
    name: "Maryland BWI1",
    state: "Maryland",
    location: "Baltimore",
    type: "Warehouse",
    address: "222 Maple St, Baltimore, MD 21201",
    latitude: 39.1756,
    longitude: -76.6683,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "MA-BOS1",
    name: "Massachusetts BOS1",
    state: "Massachusetts",
    location: "Boston",
    type: "Warehouse",
    address: "333 Walnut St, Boston, MA 02108",
    latitude: 42.3601,
    longitude: -71.0589,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "MI-DTW1",
    name: "Michigan DTW1",
    state: "Michigan",
    location: "Detroit",
    type: "Warehouse",
    address: "444 Oak St, Detroit, MI 48201",
    latitude: 42.2124,
    longitude: -83.3534,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "MN-MSP1",
    name: "Minnesota MSP1",
    state: "Minnesota",
    location: "Minneapolis",
    type: "Warehouse",
    address: "555 Elm St, Minneapolis, MN 55401",
    latitude: 44.8819,
    longitude: -93.2218,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "MS-JAN1",
    name: "Mississippi JAN1",
    state: "Mississippi",
    location: "Jackson",
    type: "Warehouse",
    address: "666 Maple St, Jackson, MS 39201",
    latitude: 32.2988,
    longitude: -90.1848,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "MO-STL1",
    name: "Missouri STL1",
    state: "Missouri",
    location: "St. Louis",
    type: "Warehouse",
    address: "777 Pine St, St. Louis, MO 63101",
    latitude: 38.6270,
    longitude: -90.1994,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "MT-BIL1",
    name: "Montana BIL1",
    state: "Montana",
    location: "Billings",
    type: "Warehouse",
    address: "888 Cedar St, Billings, MT 59101",
    latitude: 45.7833,
    longitude: -108.5007,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "NE-OMA1",
    name: "Nebraska OMA1",
    state: "Nebraska",
    location: "Omaha",
    type: "Warehouse",
    address: "999 Walnut St, Omaha, NE 68102",
    latitude: 41.2565,
    longitude: -95.9345,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "NV-LAS1",
    name: "Nevada LAS1",
    state: "Nevada",
    location: "Las Vegas",
    type: "Warehouse",
    address: "111 Birch St, Las Vegas, NV 89101",
    latitude: 36.1699,
    longitude: -115.1398,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "NH-MHT1",
    name: "New Hampshire MHT1",
    state: "New Hampshire",
    location: "Manchester",
    type: "Warehouse",
    address: "222 Maple St, Manchester, NH 03101",
    latitude: 42.9956,
    longitude: -71.4548,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "NJ-EWR1",
    name: "New Jersey EWR1",
    state: "New Jersey",
    location: "Newark",
    type: "Warehouse",
    address: "333 Walnut St, Newark, NJ 07102",
    latitude: 40.6925,
    longitude: -74.1687,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "NM-ABQ1",
    name: "New Mexico ABQ1",
    state: "New Mexico",
    location: "Albuquerque",
    type: "Warehouse",
    address: "444 Oak St, Albuquerque, NM 87101",
    latitude: 35.0844,
    longitude: -106.6504,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "NY-JFK1",
    name: "New York JFK1",
    state: "New York",
    location: "New York City",
    type: "Warehouse",
    address: "555 Pine St, New York, NY 10001",
    latitude: 40.6398,
    longitude: -73.7789,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "NC-CLT1",
    name: "North Carolina CLT1",
    state: "North Carolina",
    location: "Charlotte",
    type: "Warehouse",
    address: "666 Maple St, Charlotte, NC 28201",
    latitude: 35.2140,
    longitude: -80.9431,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "ND-BIS1",
    name: "North Dakota BIS1",
    state: "North Dakota",
    location: "Bismarck",
    type: "Warehouse",
    address: "777 Walnut St, Bismarck, ND 58501",
    latitude: 46.8084,
    longitude: -100.7837,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "OH-CMH1",
    name: "Ohio CMH1",
    state: "Ohio",
    location: "Columbus",
    type: "Warehouse",
    address: "888 Oak St, Columbus, OH 43201",
    latitude: 39.9612,
    longitude: -82.9988,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "OK-OKC1",
    name: "Oklahoma OKC1",
    state: "Oklahoma",
    location: "Oklahoma City",
    type: "Warehouse",
    address: "999 Elm St, Oklahoma City, OK 73101",
    latitude: 35.4676,
    longitude: -97.5164,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "OR-PDX1",
    name: "Oregon PDX1",
    state: "Oregon",
    location: "Portland",
    type: "Warehouse",
    address: "111 Pine St, Portland, OR 97201",
    latitude: 45.5886,
    longitude: -122.5975,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "PA-PHL1",
    name: "Pennsylvania PHL1",
    state: "Pennsylvania",
    location: "Philadelphia",
    type: "Warehouse",
    address: "222 Walnut St, Philadelphia, PA 19101",
    latitude: 39.8719,
    longitude: -75.2411,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "RI-PVD1",
    name: "Rhode Island PVD1",
    state: "Rhode Island",
    location: "Providence",
    type: "Warehouse",
    address: "333 Maple St, Providence, RI 02901",
    latitude: 41.8236,
    longitude: -71.4128,
    weather: defaultWeather,
    alerts: []
  },

  {
    id: "SC-CHS1",
    name: "South Carolina CHS1",
    state: "South Carolina",
    location: "Charleston",
    type: "Warehouse",
    address: "444 Oak St, Charleston, SC 29401",
    latitude: 32.7765,
    longitude: -79.9311,
    weather: defaultWeather,
    alerts: []
  },
];
export async function fetchRealTimeData(): Promise<WarehouseType[]> {
  const updatedWarehouses: WarehouseType[] = [];

  for (const warehouse of initialWarehouses) {
    try {
      const data = await getWeatherData(warehouse.latitude!, warehouse.longitude!) as WeatherData;
      const weatherData = data.current;

      updatedWarehouses.push({
        ...warehouse,
        weather: {
          temp: Math.round(weatherData.temp),
          feels_like: Math.round(weatherData.feels_like),
          uvi: Math.round(weatherData.uvi),
          humidity: weatherData.humidity,
          wind_speed: Math.round(weatherData.wind_speed),
          wind_deg: Math.round(weatherData.wind_deg),
          description: weatherData.weather[0].description,
          weather: weatherData.weather,
          forecast: {
            hourly: data.hourly.map((hour) => ({
              dt: hour.dt,
              temp: hour.temp,
              weather: hour.weather
            })),
            daily: data.daily.map((day) => ({
              dt: day.dt,
              temp: {
                day: day.temp.day,
                min: day.temp.min,
                max: day.temp.max
              },
              weather: day.weather
            }))
          }
        },
        alerts: data.alerts || []
      });
    } catch (error) {
      console.error(`Failed to fetch data for ${warehouse.name}:`, error);
      updatedWarehouses.push(warehouse);
    }
  }

  return updatedWarehouses;
}
