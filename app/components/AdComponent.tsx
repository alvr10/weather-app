/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import '../styles/globals.css';

interface AdComponentProps {
  adSlot: string;
  adFormat?: string;
  adLayout?: string;
}

const AdComponent: React.FC<AdComponentProps> = ({ adSlot, adFormat = 'auto', adLayout = '' }) => {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});

      // Check if the ad container is empty after a delay
      const checkAd = setTimeout(() => {
        const adContainer = document.querySelector(`.adsbygoogle[data-ad-slot="${adSlot}"]`);
        if (adContainer && adContainer.innerHTML.trim() === '') {
          setAdBlocked(true); // Ad is blocked or failed to load
        }
      }, 3000); // Wait 3 seconds to check if the ad loaded

      return () => clearTimeout(checkAd); // Cleanup the timeout
    } catch (e) {
      console.error('Error loading ads:', e);
      setAdBlocked(true); // Ad script failed to load
    }
  }, [adSlot]);

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-3721512724303658"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
      />
      {adBlocked && (
        <div className="ad-fallback">
          Ad blocked or failed to load. Please disable your ad blocker to support us.
        </div>
      )}
    </div>
  );
};

export default AdComponent;