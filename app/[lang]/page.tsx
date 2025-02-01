"use client";

import React, { useState, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
import { useWeatherData } from "../hooks/useWeatherData";
import { useLocale } from "../hooks/useLocale";
import { Header } from "../components/Header";
import { WeatherDisplay } from "../components/WeatherDisplay";
import { HourlyForecast } from "../components/HourlyForecast";
import { DailyForecast } from "../components/DailyForecast";
import { Footer } from "../components/Footer";
import { LocaleSwitcher } from "../components/LocaleSwitcher";
import { formatTime } from "../utils/weatherUtils";
import Image from "next/image";

const WeatherApp: React.FC = () => {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { weatherData, error, fetchWeather, fetchCityName, fetchCoordinates } = useWeatherData();
  const { locale, lang } = useLocale();

  // Apply dark mode to the root element  
  useEffect(() => {
    const rootElement = document.documentElement;
    if (darkMode) {
      rootElement.classList.add("dark-mode");
    } else {
      rootElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Fetch user's location and set the city name
  useEffect(() => {
    const getLocationData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeather(latitude, longitude);

            try {
              const cityName = await fetchCityName(latitude, longitude);
              setSearch(cityName); // Set the city name in the search state
            } catch (error) {
              console.error("Error fetching city name:", error);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    };

    getLocationData();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const { latitude, longitude } = await fetchCoordinates(search.trim());
      await fetchWeather(latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  };

  const changeLocale = (newLang: string) => {
    window.location.href = `/${newLang}`;
  };

  if (!locale) return <div>Loading...</div>;

  return (
    <AppContext.Provider value={{ search, setSearch, darkMode, setDarkMode, weatherData }}>
      <div className={`relative min-h-screen h-auto flex flex-col items-center justify-between backgroundpattern overflow-x-hidden ${darkMode ? "bg-[var(--color-text)] text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-[var(--color-text)]"} font-sans`}>
        <Header search={search} setSearch={setSearch} darkMode={darkMode} setDarkMode={setDarkMode} handleSearch={handleSearch} />
        <main className="justify-center z-10 h-full w-full p-0 px-4">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {weatherData ? (
            <>
              {/* Current Forecast */}
              <WeatherDisplay weatherData={weatherData} locale={locale} search={search} lang={lang} darkMode={darkMode} />

              {/* Hourly Forecast */}
              <div className="flex justify-start items-center align-bottom m-0 mt-2 p-0">
                <h3 className={`text-lg font-semibold p-0 m-0 text-start ${darkMode ? "text-[var(--color-text)]" : "text-[var(--color-text)]"}`}>
                  {locale['hourly']}
                </h3>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={"/svg/sunrise.svg"} width={30} height={30} />
                <p className={`text-xs self-center m-0 p-0 ${darkMode ? "text-[var(--color-text)]" : "text-[var(--color-text)]"}`}>
                  {formatTime(weatherData.daily.sunrise[0])}
                </p>
                <Image className="self-center m-0 image-class" alt="Weather Icon" src={"/svg/sunset.svg"} width={30} height={30} />
                <p className={`text-xs self-center m-0 p-0 ${darkMode ? "text-[var(--color-text)]" : "text-[var(--color-text)]"}`}>
                  {formatTime(weatherData.daily.sunset[0])}
                </p>
              </div>
              <HourlyForecast weatherData={weatherData} locale={locale} />

              {/* Daily Forecast */}
              <h3 className={`text-lg font-semibold p-0 m-0 mt-2 text-start ${darkMode ? "text-[var(--color-text)]" : "text-[var(--color-text)]"}`}>
                {locale['daily']}</h3>
              <DailyForecast weatherData={weatherData} locale={locale} lang={lang} />
              <LocaleSwitcher changeLocale={changeLocale} />
            </>
          ) : (
            <p className="text-lg text-center">{locale['tutorial']}</p>
          )}
        </main>
        <Footer locale={locale} />
      </div>
    </AppContext.Provider>
  );
};

export default WeatherApp;