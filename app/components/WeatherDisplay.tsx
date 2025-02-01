/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { WeatherData } from "../types/weatherTypes";
import { getSVGName, formatDate, getWeatherDescriptionTranslated } from '../utils/weatherUtils';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  locale: any;
  search: string;
  lang: string;
  darkMode: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, locale, search, lang, darkMode }) => {
  return (
    <div className={`w-full h-full flex-grow flex flex-col max-w-auto max-h-auto p-2 align-middle justify-center text-center ${darkMode ? "text-[var(--color-text)]" : "text-[var(--color-text)]"}`}>
      {/* Location and Date */}
      <h2 className="text-lg font-semibold mb-4 capitalize">
        {search}, {formatDate(weatherData.current.time, lang)}
      </h2>

      {/* Current Weather Display */}
      <div className="relative flex justify-center m-0 p-0">
        {/* Temperature */}
        <h2 className="text-8xl font-bold m-0 p-0">
          {Math.floor(weatherData.current.temperature_2m)}
        </h2>

        {/* Weather Icon and Unit */}
        <div className="flex flex-col justify-between m-0 py-2">
          <Image
            className="image-class m-0 p-0"
            alt="Weather Icon"
            src={getSVGName(weatherData.current.weathercode, weatherData.current.time)}
            width={40}
            height={40}
          />
          <p className="text-lg text-center font-semibold p-0">°C</p>
        </div>

        {/* Weather Details (Wind, Gusts, Humidity) */}
        <div className="flex flex-col justify-between py-2">
          {/* Wind Speed */}
          <div className="flex justify-center items-center align-middle m-0 p-0">
            <Image
              className="self-center m-0 image-class"
              alt="Wind Icon"
              src="/svg/wind.svg"
              width={25}
              height={25}
            />
            <p className="text-xs text-center m-0 p-0">
              {weatherData.current.wind_speed_10m} km/h
            </p>
          </div>

          {/* Wind Gusts */}
          <div className="flex justify-center items-center align-middle m-0 p-0">
            <Image
              className="self-center m-0 image-class"
              alt="Wind Gust Icon"
              src="/svg/windsock.svg"
              width={25}
              height={25}
            />
            <p className="text-xs text-center m-0 p-0">
              {Math.floor(weatherData.current.wind_gusts_10m)} km/h
            </p>
          </div>

          {/* Humidity */}
          <div className="flex justify-center items-center align-middle m-0 p-0">
            <Image
              className="self-center m-0 image-class"
              alt="Humidity Icon"
              src="/svg/humidity.svg"
              width={25}
              height={25}
            />
            <p className="text-xs text-center m-0 p-0">
              {weatherData.current.relative_humidity_2m}%
            </p>
          </div>
        </div>
      </div>

      {/* Weather Description */}
      <p className="font-semibold text-lg">
        {getWeatherDescriptionTranslated(weatherData.current.weathercode, locale)}, {Math.floor(weatherData.daily.temperature_2m_max[0])}° {Math.floor(weatherData.daily.temperature_2m_min[0])}°
      </p>
    </div>
  );
};