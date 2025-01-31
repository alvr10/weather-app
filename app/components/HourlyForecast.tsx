/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";
import { WeatherData } from "../types/weatherTypes";
import { formatTime, getSVGName } from "../utils/weatherUtils";

interface HourlyForecastProps {
  weatherData: WeatherData;
  locale: any;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ weatherData, locale }) => {
  const [showMore, setShowMore] = useState(false); // State to toggle expanded view
  const hourlyData = weatherData.hourly;

  // Determine the time interval based on the "Show More" state
  const timeInterval = showMore ? 2 : 4; // Show data every 2 hours if expanded, otherwise every 4 hours

  // Calculate the number of hours to display
  const hoursToDisplay = Math.ceil(24 / timeInterval);

  return (
    <div>
      {/* Hourly Forecast Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 p-0">
        {Array.from({ length: hoursToDisplay }, (_, i) => i * timeInterval).map((index) => (
          <div
            key={index}
            className="flex flex-col justify-between bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] shadow-custom-right-down hover:shadow-custom-right-down-hover-7 transition-all duration-300 p-2 w-md"
          >
            <p>{formatTime(hourlyData.time[index])}</p>
            <Image
              className="self-center m-0 image-class"
              alt="Weather Icon"
              src={getSVGName(hourlyData.weathercode[index], hourlyData.time[index])}
              width={40}
              height={40}
            />
            <p>{Math.floor(hourlyData.temperature_2m[index])}º</p>
          </div>
        ))}
      </div>

      {/* Show More/Show Less Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowMore(!showMore)}
          className="bg-[var(--color-primary)] text-[var(--color-text)] border-2 border-[var(--color-text)] px-4 py-2 rounded-lg shadow-custom-right-down hover:shadow-custom-right-down-hover transition-all duration-300"
        >
          {showMore ? locale['showless'] : locale["showmore"]}
        </button>
      </div>
    </div>
  );
};