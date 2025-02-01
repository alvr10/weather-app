import React from "react";

interface HeaderProps {
  search: string;
  setSearch: (search: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  handleSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ search, setSearch, darkMode, setDarkMode, handleSearch }) => {
  return (
    <header className="w-full py-4 px-4 shadow-sm z-10 flex justify-between items-center">
      <input 
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="bg-[var(--color-primary)] border-2 border-[var(--color-text)] text-[var(--color-text)] outline-none shadow-custom-right-down p-2 pl-3 hover:shadow-custom-right-down-hover transition-all duration-300"
      />
      <label className="switch">
        <input 
          placeholder="Search"
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        <span className="slider"></span>
      </label>
    </header>
  );
};