import { weatherDescriptions } from '../constants/weatherCodes';

// Format date based on locale
export const formatDate = (dateString: string, locale: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };

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
      localeString = 'en-US';
  }

  return date.toLocaleDateString(localeString, options);
};

// Format time to HH:MM format
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Get SVG icon name based on weather code and time
export const getSVGName = (weatherCode: number, currentTime: string): string => {
  const weatherNames: { [key: number]: string } = {
    0: 'clear',
    1: 'clear', // mainly-clear
    2: 'partly-cloudy',
    3: 'cloudy',
    45: 'fog',
    48: 'fog', // depositing-rime-fog
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

  const hour = parseInt(currentTime.slice(11, 13), 10);
  let timeOfDay = hour >= 7 && hour <= 19 ? 'day' : 'night';
  const weatherName = weatherNames[weatherCode] || 'unknown';

  if (Number.isNaN(hour)) {
    timeOfDay = 'day';
  }

  // Weather codes that don't depend on time of day
  const timeIndependentCodes = [
    3, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86,
  ];

  if (timeIndependentCodes.includes(weatherCode)) {
    return `/svg/${weatherName}.svg`;
  }

  return `/svg/${weatherName}-${timeOfDay}.svg`;
};

// Get weather description by weather code
export const getWeatherDescription = (code: number): string =>
  weatherDescriptions[code] || 'Unknown weather';