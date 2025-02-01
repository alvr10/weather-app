/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface FooterProps {
  locale: any;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  return (
    <footer className="w-full py-0">
      <p className="text-white my-0 pb-4 bg-black text-center text-xs">
        {locale['footer']}
      </p>
    </footer>
  );
};