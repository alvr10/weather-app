"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./globals.css";
import { WeatherData, getWeatherDescription } from './weatherTypes';

interface Coordinates {
  latitude: number;
  longitude: number;
}

const WeatherApp: React.FC = () => {
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentLocation = useState<Coordinates | null>(null);

  useEffect(() => {
    const getLocationData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            currentLocation[1]({ latitude, longitude });
            await fetchWeather(latitude, longitude);
  
            try {
              // Fetch city name from coordinates
              const cityName = await fetchCityName(latitude, longitude);
              setSearch(cityName); // Set the city name in the search state
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
  
    getLocationData(); // Call the async function inside useEffect
  
  }, []);  

  // Function to fetch city name from coordinates
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

      if (response.data.length === 0) {
        throw new Error("City not found");
      }

      return response.data[0].name; // Extract the city name from the response
    } catch (error) {
      console.error("Error fetching city name:", error);
      setError("Unable to fetch city name.");
      throw error;
    }
  };

  // Function to fetch coordinates for a city
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

      if (response.data.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon } = response.data[0];
      return { latitude: lat, longitude: lon };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setError("Unable to fetch coordinates. Check your city name.");
      throw error;
    }
  };

  // Function to fetch weather data
  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current_weather: true,
          hourly: 'temperature_2m,wind_speed_10m,relative_humidity_2m,pressure_msl,cloudcover,precipitation,weathercode',
          timezone: 'auto',
        },
      });
  
      console.log(response.data);
  
      response.data.current_weather.time = formatTime(response.data.current_weather.time);
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Unable to fetch weather data.");
    }
  };
  
  // Handle search
  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const { latitude, longitude } = await fetchCoordinates(search.trim());
      await fetchWeather(latitude, longitude);
    } catch {
      // Error handling is done inside the fetch functions
    }
  };

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Format minutes to always have two digits
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    // Return the formatted time string
    return `${hours}:${formattedMinutes} ${ampm}`;
  }  

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${
        darkMode
          ? "bg-[var(--color-text)] text-[var(--color-primary" // For dark mode, you can keep this or customize with variables
          : "bg-[var(--color-primary)] text-[var(--color-text)]" // Use the variables for light mode
      } font-sans`}
    >

      {/* Header */}
      <header className="w-full py-4 px-6 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">3DWeather</h1>
        <div className="flex items-center">
          <div className="InputContainer">
            <input
              placeholder="Search"
              id="input"
              className="input"
              name="text"
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <label className="labelforsearch" htmlFor="input">
              <svg className="searchIcon" viewBox="0 0 512 512">
                <path
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                ></path>
              </svg>
            </label>
          </div>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            className="input__check"
            placeholder="."
            onClick={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col justify-center items-center px-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {weatherData ? (
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {weatherData.current_weather.time}
            </h2>
            <h2 className="text-2xl font-semibold mb-4">
              Weather Data for {search}
            </h2>
            <p>{getWeatherDescription(weatherData.current_weather.weathercode)}</p>
            <p className="text-lg mb-4">
              Current Temperature: {weatherData.current_weather.temperature}°C
            </p>
            <p className="text-lg mb-4">
              Current Wind Speed: {weatherData.current_weather.wind_speed} m/s
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-500">
            Enter a location and click search to view weather data.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-secondary text-center">
        <p className="text-white">
          Designed by Alvaro Rios - Innovation through simplicity
        </p>
      </footer>
    </div>
  );
};

export default WeatherApp;
