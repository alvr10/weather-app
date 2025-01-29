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

export const getSVGName = (weatherCode: number, currentTime: string) => {
  const weatherNames:  { [key: number]: string }  = {
    0: 'clear',
    1: 'clear', // mainly-clear
    2: 'partly-cloudy',
    3: 'cloudy',
    45: 'fog',
    48: 'fog', // deposting-rime-fog
    51: 'partly-cloudy-drizzle', // light-drizzle
    53: 'partly-cloudy-drizzle', // moderate-drizzle
    55: 'drizzle', // heavy-drizzle
    61: 'raindrop', // light-rain
    63: 'raindrops', // moderate-rain
    65: 'rain', // heavy-rain
    66: 'light-freezing-rain',
    67: 'heavy-freezing-rain',
    71: 'snowflake', // light-snow
    73: 'snowflake', // moderate-snow
    75: 'snowflake', // heavy-snow
    77: 'snow', // snow-grains
    80: 'rain', // light-showers-of-rain
    81: 'moderate-showers-of-rain',
    82: 'heavy-showers-of-rain',
    85: 'snow', // light-showers-of-snow
    86: 'snow', // heavy-showers-of-snow
    95: 'thunderstorms',
    96: 'thunderstorms', // thunderstorms-with-light-hail
    99: 'thunderstorms', // thunderstorms-with-heavy-hail
  };

  const [hour] = currentTime.split(':').map(Number);
  const timeOfDay = (hour >= 7 && hour <= 19) ? 'day' : 'night';
  const weatherName = weatherNames[weatherCode] || 'unknown';
  
  if ([3, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86].includes(weatherCode)) {
    return `/svg/${weatherName}.svg`;
  }

  return `/svg/${weatherName}-${timeOfDay}.svg`;
};

export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

  let localeString: string;
  switch (locale) {
    case 'en':
      localeString = 'en-US';
      break;
    case 'pt':
      localeString = 'pt-PT';
      break;
    case 'es':
      localeString = 'es-ES';
      break;
    default:
      localeString = 'en-US';  // Valor por defecto, en caso de que ocurra un error
  }

  return date.toLocaleDateString(localeString, options);
}
  
// Function to get weather description by weather code
export const getWeatherDescription = (code: number): string => weatherDescriptions[code] || 'Unknown weather';  