import { useState } from "react";
import axios from "axios";
import { WeatherData, Coordinates } from '../types/weatherTypes';

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);

  // Fetch weather data based on latitude and longitude
  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,wind_speed_10m,wind_gusts_10m,relative_humidity_2m,surface_pressure,weathercode',
          hourly: 'temperature_2m,wind_speed_10m,relative_humidity_2m,pressure_msl,cloudcover,precipitation,weathercode',
          daily: 'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset',
          timezone: 'auto',
        },
      });
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Unable to fetch weather data.");
    }
  };

  // Fetch city name based on latitude and longitude
  const fetchCityName = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            limit: 1,
            appid: "8ce8b64877436f61067a064e0fd7e3d3",
          },
        }
      );
      return response.data[0].name;
    } catch (error) {
      console.error("Error fetching city name:", error);
      throw error;
    }
  };

  // Fetch coordinates (latitude and longitude) based on city name
  const fetchCoordinates = async (city: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: city,
            limit: 1,
            appid: "8ce8b64877436f61067a064e0fd7e3d3",
          },
        }
      );
      const { lat, lon } = response.data[0];
      return { latitude: lat, longitude: lon };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      throw error;
    }
  };

  // Get user's current location and fetch weather data
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          await fetchWeather(latitude, longitude);

          try {
            const cityName = await fetchCityName(latitude, longitude);
            return cityName;
          } catch (error) {
            console.error("Error fetching city name:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get user location timed out.");
              break;
            default:
              setError("An error occurred.");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return {
    weatherData,
    error,
    currentLocation,
    fetchWeather,
    fetchCityName,
    fetchCoordinates,
    getCurrentLocation,
  };
};