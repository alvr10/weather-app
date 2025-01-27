// Define the WeatherData interface
export interface WeatherData {
    latitude: number;
    longitude: number;
    current_weather: {
      time: string;
      temperature: number; // from current_weather
      wind_speed: number;  // from current_weather
      wind_direction: number;
      pressure: number;    // from current_weather
      humidity: number;    // from current_weather
      cloudcover: number;
      weathercode: number;
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
      wind_speed_10m: number[];
      relative_humidity_2m: number[];
      pressure_msl: number[];
      cloudcover: number[];
      precipitation: number[];
      weathercode: number[];
    };
  }
  
  // Define the weather condition codes mapping
  export const weatherDescriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Cloudy',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light showers of rain',
    81: 'Moderate showers of rain',
    82: 'Heavy showers of rain',
    85: 'Light showers of snow',
    86: 'Heavy showers of snow',
    95: 'Thunderstorms',
    96: 'Thunderstorms with light hail',
    99: 'Thunderstorms with heavy hail',
  };
  
  // Function to get weather description by weather code
  export const getWeatherDescription = (code: number): string => weatherDescriptions[code] || 'Unknown weather';
  