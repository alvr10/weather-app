import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const useLocale = () => {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1];
  const [locale, setLocale] = useState<any>(null);

  useEffect(() => {
    if (lang) {
      import(`@/app/locales/${lang}.json`)
        .then((module) => setLocale(module.default))
        .catch((error) => console.error('Error loading locale:', error));
    }
  }, [lang]);

  return locale;
};