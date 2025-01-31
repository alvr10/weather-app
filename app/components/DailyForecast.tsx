/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { WeatherData } from "../types/weatherTypes";
import { formatDate, getSVGName } from "../utils/weatherUtils";

interface DailyForecastProps {
  weatherData: WeatherData;
  locale: any;
  lang: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ weatherData, locale, lang }) => {
  const dailyData = weatherData.daily;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 p-0">
      {dailyData.time.slice(1).map((time, index) => (
        <div
          key={time}
          className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md"
        >
          <p>{index === 0 ? locale['tomorrow'] : formatDate(time, lang)}</p>
          <Image
            className="self-center m-0 image-class"
            alt="Weather Icon"
            src={getSVGName(dailyData.weathercode[index + 1], time)}
            width={40}
            height={40}
          />
          <p>
            {Math.floor(dailyData.temperature_2m_max[index + 1])}º {Math.floor(dailyData.temperature_2m_min[index + 1])}º
          </p>
        </div>
      ))}
    </div>
  );
};