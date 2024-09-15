import { getWeatherData } from '../../lib/api';

export interface Warehouse {
  name: string;
  temp: number;
  aqi: number;
  uvIndex: number;
  state: string;
  location: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  weather: {
    temp: number;
    aqi: number;
    uvIndex: number;
    humidity: number;
    windSpeed: number;
    description: string;
    forecast: {
      date: string;
      temp: number;
      description: string;
    }[];
  };
}

interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    wind_speed: number;
    uvi: number;
    weather: [{ description: string }];
  };
  daily: Array<{
    dt: number;
    temp: { day: number };
    weather: [{ description: string }];
  }>;
  airPollution: {
    list: [{
      main: { aqi: number }
    }]
  };
}

export const initialWarehouses: Warehouse[] = [
  // Alabama
  { name: "Alabama BHM1", temp: 75, aqi: 45, uvIndex: 5, state: "Alabama", location: "Birmingham", type: "Warehouse", address: "123 Main St, Birmingham, AL 35205", latitude: 33.5186, longitude: -86.8104, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []  } },
  { name: "Alabama HSV1", temp: 77, aqi: 48, uvIndex: 6, state: "Alabama", location: "Huntsville", type: "Warehouse", address: "456 Elm St, Huntsville, AL 35801", latitude: 34.7304, longitude: -86.5861, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []  } },

  // Arizona
  { name: "Arizona PHX3", temp: 95, aqi: 70, uvIndex: 9, state: "Arizona", location: "Phoenix", type: "Warehouse", address: "789 Oak St, Phoenix, AZ 85001", latitude: 33.4484, longitude: -112.0740, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []   } },
  { name: "Arizona TUS1", temp: 93, aqi: 65, uvIndex: 8, state: "Arizona", location: "Tucson", type: "Warehouse", address: "101 Pine St, Tucson, AZ 85701", latitude: 32.2217, longitude: -110.9747, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // California
  { name: "California ONT3", temp: 85, aqi: 80, uvIndex: 8, state: "California", location: "Ontario", type: "Warehouse", address: "222 Maple St, Ontario, CA 91761", latitude: 34.0634, longitude: -117.6173, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California LGB3", temp: 78, aqi: 75, uvIndex: 7, state: "California", location: "Long Beach", type: "Warehouse", address: "333 Birch St, Long Beach, CA 90802", latitude: 33.7701, longitude: -118.1937, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California SNA4", temp: 80, aqi: 72, uvIndex: 8, state: "California", location: "Santa Ana", type: "Warehouse", address: "444 Cedar St, Santa Ana, CA 92701", latitude: 33.7455, longitude: -117.8677, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California LAX9", temp: 76, aqi: 85, uvIndex: 7, state: "California", location: "Los Angeles", type: "Warehouse", address: "555 Walnut St, Los Angeles, CA 90001", latitude: 34.0522, longitude: -118.2437, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California SMF1", temp: 88, aqi: 65, uvIndex: 9, state: "California", location: "Sacramento", type: "Warehouse", address: "666 Oak St, Sacramento, CA 95814", latitude: 38.5816, longitude: -121.4944, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California OAK4", temp: 72, aqi: 60, uvIndex: 6, state: "California", location: "Oakland", type: "Warehouse", address: "777 Pine St, Oakland, CA 94607", latitude: 37.7213, longitude: -122.2207, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California SJC7", temp: 75, aqi: 58, uvIndex: 7, state: "California", location: "San Jose", type: "Warehouse", address: "888 Maple St, San Jose, CA 95110", latitude: 37.3626, longitude: -121.9290, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California SFO15", temp: 68, aqi: 55, uvIndex: 5, state: "California", location: "San Francisco", type: "Warehouse", address: "999 Elm St, San Francisco, CA 94101", latitude: 37.7749, longitude: -122.4194, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California FAT1", temp: 90, aqi: 78, uvIndex: 9, state: "California", location: "Fresno", type: "Warehouse", address: "111 Birch St, Fresno, CA 93706", latitude: 36.7465, longitude: -119.7726, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "California SCK3", temp: 82, aqi: 62, uvIndex: 8, state: "California", location: "Stockton", type: "Warehouse", address: "222 Cedar St, Stockton, CA 95203", latitude: 37.9577, longitude: -121.2908, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Colorado
  { name: "Colorado DEN2", temp: 70, aqi: 55, uvIndex: 7, state: "Colorado", location: "Denver", type: "Warehouse", address: "333 Walnut St, Denver, CO 80202", latitude: 39.7392, longitude: -104.9903, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Colorado COS1", temp: 68, aqi: 50, uvIndex: 6, state: "Colorado", location: "Colorado Springs", type: "Warehouse", address: "444 Oak St, Colorado Springs, CO 80903", latitude: 38.8539, longitude: -104.8214, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Connecticut
  { name: "Connecticut BDL2", temp: 68, aqi: 40, uvIndex: 4, state: "Connecticut", location: "Bradley International Airport", type: "Warehouse", address: "555 Elm St, Windsor Locks, CT 06096", latitude: 41.9389, longitude: -72.6831, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Connecticut HFD1", temp: 67, aqi: 42, uvIndex: 4, state: "Connecticut", location: "Hartford Bradley International Airport", type: "Warehouse", address: "666 Maple St, Hartford, CT 06103", latitude: 41.9389, longitude: -72.6831, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Delaware
  { name: "Delaware PHL7", temp: 72, aqi: 50, uvIndex: 5, state: "Delaware", location: "Philadelphia International Airport", type: "Warehouse", address: "777 Pine St, Philadelphia, PA 19102", latitude: 39.8719, longitude: -75.2411, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Florida
  { name: "Florida JAX2", temp: 88, aqi: 60, uvIndex: 10, state: "Florida", location: "Jacksonville International Airport", type: "Warehouse", address: "888 Cedar St, Jacksonville, FL 32202", latitude: 30.4941, longitude: -81.6879, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Florida MIA1", temp: 90, aqi: 65, uvIndex: 11, state: "Florida", location: "Miami International Airport", type: "Warehouse", address: "999 Walnut St, Miami, FL 33101", latitude: 25.7932, longitude: -80.2906, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Florida MCO1", temp: 89, aqi: 58, uvIndex: 10, state: "Florida", location: "Orlando International Airport", type: "Warehouse", address: "111 Oak St, Orlando, FL 32801", latitude: 28.4294, longitude: -81.3089, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Florida TPA2", temp: 87, aqi: 55, uvIndex: 9, state: "Florida", location: "Tampa International Airport", type: "Warehouse", address: "222 Elm St, Tampa, FL 33602", latitude: 27.9755, longitude: -82.5332, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Georgia
  { name: "Georgia ATL2", temp: 82, aqi: 58, uvIndex: 8, state: "Georgia", location: "Hartsfield-Jackson Atlanta International Airport", type: "Warehouse", address: "333 Maple St, Atlanta, GA 30303", latitude: 33.6367, longitude: -84.4281, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Georgia SAV3", temp: 84, aqi: 56, uvIndex: 9, state: "Georgia", location: "Savannah/Hilton Head International Airport", type: "Warehouse", address: "444 Pine St, Savannah, GA 31401", latitude: 32.1276, longitude: -81.2021, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Illinois
  { name: "Illinois MDW2", temp: 70, aqi: 65, uvIndex: 6, state: "Illinois", location: "Chicago Midway International Airport", type: "Warehouse", address: "555 Cedar St, Chicago, IL 60601", latitude: 41.7859, longitude: -87.7524, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Illinois ORD2", temp: 69, aqi: 68, uvIndex: 5, state: "Illinois", location: "O'Hare International Airport", type: "Warehouse", address: "666 Walnut St, Chicago, IL 60606", latitude: 41.9786, longitude: -87.9048, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Indiana
  { name: "Indiana IND2", temp: 73, aqi: 55, uvIndex: 7, state: "Indiana", location: "Indianapolis International Airport", type: "Warehouse", address: "777 Oak St, Indianapolis, IN 46204", latitude: 39.7173, longitude: -86.2944, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: [] } },
  { name: "Indiana FWA1", temp: 71, aqi: 52, uvIndex: 6, state: "Indiana", location: "Fort Wayne International Airport", type: "Warehouse", address: "888 Elm St, Fort Wayne, IN 46808", latitude: 41.1339, longitude: -85.1521, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Kentucky
  { name: "Kentucky SDF2", temp: 76, aqi: 52, uvIndex: 7, state: "Kentucky", location: "Louisville International Airport", type: "Warehouse", address: "999 Maple St, Louisville, KY 40203", latitude: 38.1744, longitude: -85.7361, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Kentucky LEX2", temp: 75, aqi: 50, uvIndex: 6, state: "Kentucky", location: "Blue Grass Airport", type: "Warehouse", address: "111 Pine St, Lexington, KY 40502", latitude: 38.0365, longitude: -84.6059, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Maryland
  { name: "Maryland BWI2", temp: 74, aqi: 48, uvIndex: 6, state: "Maryland", location: "Baltimore/Washington International Thurgood Marshall Airport", type: "Warehouse", address: "222 Cedar St, Baltimore, MD 21201", latitude: 39.1754, longitude: -76.6683, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Maryland IAD1", temp: 73, aqi: 46, uvIndex: 5, state: "Maryland", location: "Washington Dulles International Airport", type: "Warehouse", address: "333 Walnut St, Dulles, VA 20166", latitude: 38.9445, longitude: -77.4558, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Massachusetts
  { name: "Massachusetts BOS7", temp: 65, aqi: 45, uvIndex: 5, state: "Massachusetts", location: "Logan International Airport", type: "Warehouse", address: "444 Oak St, Boston, MA 02128", latitude: 42.3643, longitude: -71.0052, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Massachusetts BDL5", temp: 64, aqi: 43, uvIndex: 4, state: "Massachusetts", location: "Bradley International Airport", type: "Warehouse", address: "555 Elm St, Windsor Locks, CT 06096", latitude: 41.9389, longitude: -72.6831, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Michigan
  { name: "Michigan DTW1", temp: 68, aqi: 50, uvIndex: 5, state: "Michigan", location: "Detroit Metropolitan Wayne County Airport", type: "Warehouse", address: "666 Maple St, Detroit, MI 48221", latitude: 42.2124, longitude: -83.3534, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Michigan GRR1", temp: 66, aqi: 48, uvIndex: 4, state: "Michigan", location: "Gerald R. Ford International Airport", type: "Warehouse", address: "777 Pine St, Grand Rapids, MI 49503", latitude: 42.8808, longitude: -85.5228, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Minnesota
  { name: "Minnesota MSP1", temp: 62, aqi: 40, uvIndex: 4, state: "Minnesota", location: "Minneapolis-Saint Paul International Airport", type: "Warehouse", address: "888 Cedar St, Minneapolis, MN 55403", latitude: 44.8819, longitude: -93.2218, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Minnesota DLH1", temp: 58, aqi: 35, uvIndex: 3, state: "Minnesota", location: "Duluth International Airport", type: "Warehouse", address: "999 Walnut St, Duluth, MN 55803", latitude: 46.8421, longitude: -92.1936, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Missouri
  { name: "Missouri STL4", temp: 75, aqi: 55, uvIndex: 7, state: "Missouri", location: "Lambert-St. Louis International Airport", type: "Warehouse", address: "111 Oak St, St. Louis, MO 63101", latitude: 38.7487, longitude: -90.3700, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Missouri MCI1", temp: 73, aqi: 52, uvIndex: 6, state: "Missouri", location: "Kansas City International Airport", type: "Warehouse", address: "222 Elm St, Kansas City, MO 64129", latitude: 39.2976, longitude: -94.7139, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Nevada
  { name: "Nevada LAS2", temp: 92, aqi: 75, uvIndex: 10, state: "Nevada", location: "McCarran International Airport", type: "Warehouse", address: "333 Maple St, Las Vegas, NV 89101", latitude: 36.0801, longitude: -115.1522, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Nevada RNO1", temp: 85, aqi: 65, uvIndex: 9, state: "Nevada", location: "Reno-Tahoe International Airport", type: "Warehouse", address: "444 Pine St, Reno, NV 89502", latitude: 39.4990, longitude: -119.7682, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // New Jersey
  { name: "New Jersey EWR4", temp: 70, aqi: 60, uvIndex: 6, state: "New Jersey", location: "Newark Liberty International Airport", type: "Warehouse", address: "555 Cedar St, Newark, NJ 07102", latitude: 40.6925, longitude: -74.1687, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "New Jersey ACY1", temp: 72, aqi: 55, uvIndex: 7, state: "New Jersey", location: "Atlantic City International Airport", type: "Warehouse", address: "666 Walnut St, Atlantic City, NJ 08401", latitude: 39.4575, longitude: -74.5771, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // New York
  { name: "New York JFK8", temp: 68, aqi: 65, uvIndex: 5, state: "New York", location: "John F. Kennedy International Airport", type: "Warehouse", address: "777 Oak St, Jamaica, NY 11434", latitude: 40.6398, longitude: -73.7789, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "New York BUF5", temp: 64, aqi: 55, uvIndex: 4, state: "New York", location: "Buffalo Niagara International Airport", type: "Warehouse", address: "888 Elm St, Buffalo, NY 14209", latitude: 42.9406, longitude: -78.7322, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "New York SYR1", temp: 65, aqi: 50, uvIndex: 4, state: "New York", location: "Syracuse Hancock International Airport", type: "Warehouse", address: "999 Maple St, Syracuse, NY 13212", latitude: 43.1112, longitude: -76.1063, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Ohio
  { name: "Ohio CMH1", temp: 73, aqi: 48, uvIndex: 6, state: "Ohio", location: "John Glenn Columbus International Airport", type: "Warehouse", address: "111 Pine St, Columbus, OH 43215", latitude: 39.9980, longitude: -82.8918, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Ohio CLE3", temp: 70, aqi: 52, uvIndex: 5, state: "Ohio", location: "Cleveland Hopkins International Airport", type: "Warehouse", address: "222 Cedar St, Cleveland, OH 44115", latitude: 41.4118, longitude: -81.8497, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Oregon
  { name: "Oregon PDX9", temp: 68, aqi: 42, uvIndex: 5, state: "Oregon", location: "Portland International Airport", type: "Warehouse", address: "333 Walnut St, Portland, OR 97218", latitude: 45.5887, longitude: -122.5975, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Oregon EUG1", temp: 66, aqi: 40, uvIndex: 4, state: "Oregon", location: "Eugene Airport", type: "Warehouse", address: "444 Oak St, Eugene, OR 97401", latitude: 44.1246, longitude: -123.2119, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Pennsylvania
  { name: "Pennsylvania PHL6", temp: 70, aqi: 45, uvIndex: 5, state: "Pennsylvania", location: "Philadelphia International Airport", type: "Warehouse", address: "555 Elm St, Philadelphia, PA 19102", latitude: 39.8719, longitude: -75.2411, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Pennsylvania PIT5", temp: 69, aqi: 47, uvIndex: 5, state: "Pennsylvania", location: "Pittsburgh International Airport", type: "Warehouse", address: "666 Maple St, Pittsburgh, PA 15231", latitude: 40.4915, longitude: -80.2329, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Tennessee
  { name: "Tennessee BNA3", temp: 78, aqi: 52, uvIndex: 7, state: "Tennessee", location: "Nashville International Airport", type: "Warehouse", address: "777 Pine St, Nashville, TN 37214", latitude: 36.1245, longitude: -86.6782, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Tennessee MEM1", temp: 80, aqi: 55, uvIndex: 8, state: "Tennessee", location: "Memphis International Airport", type: "Warehouse", address: "888 Cedar St, Memphis, TN 38116", latitude: 35.0424, longitude: -89.9767, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Texas
  { name: "Texas DFW7", temp: 90, aqi: 65, uvIndex: 9, state: "Texas", location: "Dallas/Fort Worth International Airport", type: "Warehouse", address: "999 Walnut St, Dallas, TX 75201", latitude: 32.8968, longitude: -97.0380, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Texas HOU3", temp: 92, aqi: 70, uvIndex: 10, state: "Texas", location: "William P. Hobby Airport", type: "Warehouse", address: "111 Oak St, Houston, TX 77032", latitude: 29.6454, longitude: -95.2789, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Texas SAT1", temp: 91, aqi: 68, uvIndex: 9, state: "Texas", location: "San Antonio International Airport", type: "Warehouse", address: "222 Elm St, San Antonio, TX 78209", latitude: 29.5337, longitude: -98.4698, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Texas AUS3", temp: 89, aqi: 62, uvIndex: 8, state: "Texas", location: "Austin-Bergstrom International Airport", type: "Warehouse", address: "333 Maple St, Austin, TX 78701", latitude: 30.1945, longitude: -97.6699, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Utah
  { name: "Utah SLC2", temp: 75, aqi: 50, uvIndex: 8, state: "Utah", location: "Salt Lake City International Airport", type: "Warehouse", address: "444 Pine St, Salt Lake City, UT 84101", latitude: 40.7884, longitude: -111.9775, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Utah OGD1", temp: 73, aqi: 48, uvIndex: 7, state: "Utah", location: "Ogden-Hinckley Airport", type: "Warehouse", address: "555 Cedar St, Ogden, UT 84401", latitude: 41.1951, longitude: -111.9704, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Virginia
  { name: "Virginia RIC2", temp: 74, aqi: 48, uvIndex: 6, state: "Virginia", location: "Richmond International Airport", type: "Warehouse", address: "666 Walnut St, Richmond, VA 23250", latitude: 37.5052, longitude: -77.3196, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Virginia ORF2", temp: 76, aqi: 50, uvIndex: 7, state: "Virginia", location: "Norfolk International Airport", type: "Warehouse", address: "777 Oak St, Norfolk, VA 23518", latitude: 36.8946, longitude: -76.2012, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Washington
  { name: "Washington SEA4", temp: 65, aqi: 40, uvIndex: 4, state: "Washington", location: "Seattle-Tacoma International Airport", type: "Warehouse", address: "888 Elm St, Seattle, WA 98101", latitude: 47.4490, longitude: -122.3088, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Washington GEG1", temp: 63, aqi: 38, uvIndex: 3, state: "Washington", location: "Spokane International Airport", type: "Warehouse", address: "999 Maple St, Spokane, WA 99202", latitude: 47.6190, longitude: -117.6109, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },

  // Wisconsin
  { name: "Wisconsin MKE1", temp: 68, aqi: 45, uvIndex: 5, state: "Wisconsin", location: "General Mitchell International Airport", type: "Warehouse", address: "111 Pine St, Milwaukee, WI 53207", latitude: 42.9472, longitude: -87.8965, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
  { name: "Wisconsin MSN4", temp: 66, aqi: 43, uvIndex: 4, state: "Wisconsin", location: "Dane County Regional Airport", type: "Warehouse", address: "222 Cedar St, Madison, WI 53713", latitude: 43.1399, longitude: -89.3375, weather: { temp: 0, aqi: 0, uvIndex: 0, humidity: 0, windSpeed: 0, description: '', forecast: []    } },
];

export async function fetchRealTimeData(): Promise<Warehouse[]> {
  const updatedWarehouses: Warehouse[] = [];

  for (const warehouse of initialWarehouses) {
    try {
      const data = await getWeatherData(warehouse.latitude, warehouse.longitude) as WeatherData;
      const weatherData = data.current;
      const airPollutionData = data.airPollution.list[0];

      updatedWarehouses.push({
        ...warehouse,
        temp: Math.round(weatherData.temp),
        aqi: airPollutionData.main.aqi,
        uvIndex: Math.round(weatherData.uvi),
        weather: {
          temp: Math.round(weatherData.temp),
          aqi: airPollutionData.main.aqi,
          uvIndex: Math.round(weatherData.uvi),
          humidity: weatherData.humidity,
          windSpeed: Math.round(weatherData.wind_speed),
          description: weatherData.weather[0].description,
          forecast: []
        }
      });
    } catch (error) {
      console.error(`Failed to fetch data for ${warehouse.name}:`, error);
      updatedWarehouses.push(warehouse); // Keep existing data on error
    }
  }

  return updatedWarehouses;
}
