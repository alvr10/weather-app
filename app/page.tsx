"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import "./globals.css";
import { WeatherData, getWeatherDescription, getSVGName } from './weatherTypes';

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
  
    getLocationData();
  
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

      return response.data[0].name;
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
          daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
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

  useEffect(() => {
    const rootElement = document.documentElement;
    if (darkMode) {
      rootElement.classList.add("dark-mode");
    } else {
      rootElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center backg ${
        darkMode
          ? "bg-[var(--color-text)] text-[var(--color-primary" // For dark mode, you can keep this or customize with variables
          : "bg-[var(--color-primary)] text-[var(--color-text)]" // Use the variables for light mode
      } font-sans`}
    >

      {/* Header */}
      <header className="w-full py-4 px-6 shadow-sm flex justify-between items-center">
        <input 
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="bg-[var(--color-primary)] border-2 border-[var(--color-text)] text-[var(--color-text)] outline-none shadow-custom-right-down p-2 pl-3
          hover:shadow-custom-right-down-hover transition-all duration-300"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        ></input>

        <label className="switch">
          <input 
            type="checkbox"
            placeholder="Dark Mode"
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
          ></input>
          <span className="slider"></span>
        </label>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col justify-start w-full px-4">

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {weatherData ? (
          <div className="w-full max-w-xl p-8 text-start">
            <h2 className="text-8xl">{weatherData.current_weather.temperature}</h2>
            <h2 className="text-2xl font-semibold mb-4">
              {weatherData.current_weather.time}
            </h2>

            <Image alt="Weather Icon" src={getSVGName(weatherData.current_weather.weathercode, weatherData.current_weather.time)} width={100} height={100}></Image>
            <p>{getWeatherDescription(weatherData.current_weather.weathercode)}</p>

            <p className="text-lg mb-4">
              {weatherData.daily.temperature_2m_max[0]}°C / {weatherData.daily.temperature_2m_min[0]}°C
            </p>

            <div className="flex-col justify-between absolute right-5 top-1/4">
              <div className="flex-col justify-between my-1 bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] 
              shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2">
                <p>Tomorrow</p>
                <p>{weatherData.daily.temperature_2m_max[1]}°C / {weatherData.daily.temperature_2m_min[1]}°C</p>
              </div>
              <div className="flex-col justify-between my-1 bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] 
              shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2">
                <p>{weatherData.daily.time[2]}</p>
                <p>{weatherData.daily.temperature_2m_max[2]}°C / {weatherData.daily.temperature_2m_min[2]}°C</p>
              </div>
              <div className="flex-col justify-between my-1 bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] 
              shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2">
                <p>{weatherData.daily.time[3]}</p>
                <p>{weatherData.daily.temperature_2m_max[3]}°C / {weatherData.daily.temperature_2m_min[3]}°C</p>
              </div>
              <div className="flex-col justify-between my-1 bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] 
              shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2">
                <p>{weatherData.daily.time[4]}</p>
                <p>{weatherData.daily.temperature_2m_max[4]}°C / {weatherData.daily.temperature_2m_min[4]}°C</p>
              </div>
              <div className="flex-col justify-between my-1 bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] 
              shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2">
                <p>{weatherData.daily.time[5]}</p>
                <p>{weatherData.daily.temperature_2m_max[5]}°C / {weatherData.daily.temperature_2m_min[5]}°C</p>
              </div>
              <div className="flex-col justify-between my-1 bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] 
              shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2">
                <p>{weatherData.daily.time[6]}</p>
                <p>{weatherData.daily.temperature_2m_max[6]}°C / {weatherData.daily.temperature_2m_min[6]}°C</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg co">
            Enter a location and click search to view weather data.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-0">
        <p className="capitalize text-9xl font-bold m-0 p-0">
          {search}
        </p>
        <p className="text-white my-0 bg-black text-center">
          Designed by Alvaro Rios - Innovation through simplicity
        </p>
      </footer>
    </div>
  );
};

export default WeatherApp;
