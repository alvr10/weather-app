"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import "./globals.css";
import { WeatherData, getSVGName, formatDate } from './weatherTypes';
import { usePathname } from "next/navigation";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Locale {
  hourly: string;
  footer: string;
  daily: string;
  tutorial: string;
  loading: string;
  [key: number]: string;
  tomorrow: string;
}

const WeatherApp: React.FC = () => {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1];

  const [locale, setLocale] = useState<Locale | null>(null);

  useEffect(() => {
    if (lang) {
      import(`@/app/locales/${lang}.json`)
        .then((module) => setLocale(module.default))
        .catch((error) => console.error('Error loading locale:', error));
    }
  }, [lang]);
  
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
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Format hours and minutes to always have two digits
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    // Return the formatted time string in 24-hour format
    return `${formattedHours}:${formattedMinutes}`;
  }

  useEffect(() => {
    const rootElement = document.documentElement;
    if (darkMode) {
      rootElement.classList.add("dark-mode");
    } else {
      rootElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const getTranslatedWeatherDescription = (code: number): string => {
    return locale ? locale[code] : 'Unknown weather';
  };

  function changeLocale(newLang: string): void {
    window.location.href = `/${newLang}`;
  };

  if (!locale) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`relative min-h-screen h-auto flex flex-col items-center justify-between backg overflow-x-hidden ${
        darkMode
          ? "bg-[var(--color-text)] text-[var(--color-primary"
          : "bg-[var(--color-primary)] text-[var(--color-text)]"
      } font-sans`}
    > 
      <div className="absolute top-0 right-0 h-2/6 w-3/4 max-h-5xl max-w-5xl translate-x-14 -translate-y-14 bg-gradient-custom z-0 rounded-bl-full blur-3xl opacity-70"></div>

      {/* Header */}
      <header className="w-full py-4 px-6 shadow-sm z-10 flex justify-between items-center">
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
      <body className="justify-center z-10 h-full w-full p-0 px-4">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3721512724303658"
          crossOrigin="anonymous"></script>
      <ins className="adsbygoogle"
          data-ad-client="ca-pub-3721512724303658"
          data-ad-slot="7437700991"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
      </script>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {weatherData ? (
          <div className="w-full h-full flex-grow flex flex-col max-w-auto max-h-auto p-2 align-middle justify-center text-center">
            <h2 className="text-lg font-semibold mb-4 capitalize">
              {search}, {formatDate(weatherData.current.time, lang)}
            </h2>

            <div className="relative flex justify-center m-0 p-0">
              <h2 className="text-8xl font-bold m-0 p-0">{Math.floor(weatherData.current.temperature_2m)}</h2>

              <div className="flex flex-col justify-between m-0 py-2">
                <Image className="image-class m-0 p-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.current.weathercode, weatherData.current.time)} width={40} height={40}></Image>
                <p className="text-lg  text-center font-semibold p-0">°C</p>
              </div>

              <div className="flex flex-col justify-between py-2">
                <div className="flex justify-center items-center align-middle m-0 p-0">
                  <Image className="self-center m-0 image-class" alt="Weather Icon" src={"/svg/wind.svg"} width={25} height={25} />
                  <p className="text-xs text-center m-0 p-0">{weatherData.current.wind_speed_10m}km/h</p>
                </div>
                <div className="flex justify-center items-center align-middle m-0 p-0">
                  <Image className="self-center m-0 image-class" alt="Weather Icon" src={"/svg/windsock.svg"} width={25} height={25} />
                  <p className="text-xs text-center m-0 p-0">{Math.floor(weatherData.current.wind_gusts_10m)}km/h</p>
                </div>
                <div className="flex justify-center items-center align-middle m-0 p-0">
                  <Image className="self-center m-0 image-class" alt="Weather Icon" src={"/svg/humidity.svg"} width={25} height={25} />
                  <p className="text-xs text-center m-0 p-0">{weatherData.current.relative_humidity_2m}%</p>
                </div>
              </div>

            </div>

            <p className="font-semibold text-lg">
              {getTranslatedWeatherDescription(weatherData.current.weathercode)}, {Math.floor(weatherData.daily.temperature_2m_max[0])}° {Math.floor(weatherData.daily.temperature_2m_min[0])}°
            </p>
            
            <div className="flex justify-start items-center align-bottom m-0 mt-2 p-0">
              <h3 className="text-lg font-semibold p-0 m-0 text-start">{locale['hourly']}</h3>
              <Image className="self-center m-0 image-class" alt="Weather Icon" src={"/svg/sunrise.svg"} width={30} height={30} />
              <p className="text-xs self-center m-0 p-0">{formatTime(weatherData.daily.sunrise[0])}</p>
              <Image className="self-center m-0 image-class" alt="Weather Icon" src={"/svg/sunset.svg"} width={30} height={30} />
              <p className="text-xs self-center m-0 p-0">{formatTime(weatherData.daily.sunset[0])}</p>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 p-0">
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatTime(weatherData.hourly.time[4])}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.hourly.weathercode[4], weatherData.hourly.time[4])} width={40} height={40} />
                <p>{Math.floor(weatherData.hourly.temperature_2m[4])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatTime(weatherData.hourly.time[8])}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.hourly.weathercode[8], weatherData.hourly.time[8])} width={40} height={40} />
                <p>{Math.floor(weatherData.hourly.temperature_2m[8])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatTime(weatherData.hourly.time[12])}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.hourly.weathercode[12], weatherData.hourly.time[12])} width={40} height={40} />
                <p>{Math.floor(weatherData.hourly.temperature_2m[12])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatTime(weatherData.hourly.time[16])}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.hourly.weathercode[16], weatherData.hourly.time[16])} width={40} height={40} />
                <p>{Math.floor(weatherData.hourly.temperature_2m[16])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatTime(weatherData.hourly.time[20])}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.hourly.weathercode[20], weatherData.hourly.time[20])} width={40} height={40} />
                <p>{Math.floor(weatherData.hourly.temperature_2m[20])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatTime(weatherData.hourly.time[24])}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.hourly.weathercode[24], weatherData.hourly.time[24])} width={40} height={40} />
                <p>{Math.floor(weatherData.hourly.temperature_2m[24])}º</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold p-0 m-0 mt-2 text-start">{locale['daily']}</h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 p-0">
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{locale['tomorrow']}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.daily.weathercode[1], weatherData.daily.time[1])} width={40} height={40} />
                <p>{Math.floor(weatherData.daily.temperature_2m_max[1])}º {Math.floor(weatherData.daily.temperature_2m_min[1])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatDate(weatherData.daily.time[2], lang)}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.daily.weathercode[2], weatherData.daily.time[2])} width={40} height={40} />
                <p>{Math.floor(weatherData.daily.temperature_2m_max[2])}º {Math.floor(weatherData.daily.temperature_2m_min[2])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatDate(weatherData.daily.time[3], lang)}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.daily.weathercode[3], weatherData.daily.time[3])} width={40} height={40} />
                <p>{Math.floor(weatherData.daily.temperature_2m_max[3])}º {Math.floor(weatherData.daily.temperature_2m_min[3])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatDate(weatherData.daily.time[4], lang)}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.daily.weathercode[4], weatherData.daily.time[4])} width={40} height={40} />
                <p>{Math.floor(weatherData.daily.temperature_2m_max[4])}º {Math.floor(weatherData.daily.temperature_2m_min[4])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatDate(weatherData.daily.time[5], lang)}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.daily.weathercode[5], weatherData.daily.time[5])} width={40} height={40} />
                <p>{Math.floor(weatherData.daily.temperature_2m_max[5])}º {Math.floor(weatherData.daily.temperature_2m_min[5])}º</p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md">
                <p>{formatDate(weatherData.daily.time[6], lang)}</p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={getSVGName(weatherData.daily.weathercode[6], weatherData.daily.time[6])} width={40} height={40} />
                <p>{Math.floor(weatherData.daily.temperature_2m_max[6])}º {Math.floor(weatherData.daily.temperature_2m_min[6])}º</p>
              </div>
            </div>

            <div className="flex justify-center items-center align-middle gap-2 m-0 p-0 mt-4">
              <button onClick={() => changeLocale("en")}>🇬🇧</button>
              <button onClick={() => changeLocale("es")}>🇪🇸</button>
              <button onClick={() => changeLocale("pt")}>🇧🇷</button>
            </div>

          </div>
        ) : (
          <p className="text-lg text-center">
            {locale['tutorial']}
          </p>
        )}
      </body>

      {/* Footer */}
      <footer className="w-full py-0">
        <p className="text-white my-0 bg-black text-center text-xs">
          {locale['footer']}
        </p>
      </footer>
    </div>
  );
};

export default WeatherApp;
