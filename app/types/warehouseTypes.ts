export interface Warehouse {
  id: string;
  name: string;
  state: string;
  location: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  weather: {
    temp: number;
    feels_like: number;
    humidity: number;
    uvi: number;
    wind_speed: number;
    wind_deg: number;
    description: string;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    forecast: {
      hourly: Array<{ 
        dt: number; 
        temp: number; 
        weather: Array<{ id: number; main: string; description: string; icon: string }> 
      }>;
      daily: Array<{ 
        dt: number; 
        temp: { day: number; min: number; max: number }; 
        weather: Array<{ id: number; main: string; description: string; icon: string }> 
      }>;
    };
  };
  alerts?: {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
  }[];
}

export type WeatherData = {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    uvi: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{ id: number; main: string; description: string; icon: string }>;
  };
  hourly: Array<{ 
    dt: number; 
    temp: number; 
    weather: Array<{ id: number; main: string; description: string; icon: string }> 
  }>;
  daily: Array<{ 
    dt: number; 
    temp: { day: number; min: number; max: number }; 
    weather: Array<{ id: number; main: string; description: string; icon: string }> 
  }>;
  alerts?: Array<{
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
  }>;
};
