// Define the WeatherData interface
export interface WeatherData {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    surface_pressure: number;
    relative_humidity_2m: number;
    cloud_cover: number;
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
  daily: {
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string;
    sunset: string;
    time: string[];
  };
}

// Define Coordinates interface
export interface Coordinates {
  latitude: number;
  longitude: number;
}