import React from "react";

interface LocaleSwitcherProps {
  changeLocale: (lang: string) => void;
}

export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ changeLocale }) => {
  return (
    <div className="flex justify-center items-center align-middle gap-2 m-0 p-0 mt-4">
      <button onClick={() => changeLocale("en")}>🇬🇧</button>
      <button onClick={() => changeLocale("es")}>🇪🇸</button>
      <button onClick={() => changeLocale("pt")}>🇧🇷</button>
    </div>
  );
};