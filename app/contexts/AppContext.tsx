import { createContext } from "react";
import { WeatherData } from "../types/weatherTypes";

interface AppContextType {
  search: string;
  setSearch: (search: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  weatherData: WeatherData | null; // Allow WeatherData or null
}

export const AppContext = createContext<AppContextType>({
  search: "",
  setSearch: () => {},
  darkMode: false,
  setDarkMode: () => {},
  weatherData: null, // Default value is null
});