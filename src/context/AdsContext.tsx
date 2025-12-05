import React, { createContext, useContext, useState } from 'react';

type AdsContextType = {
  adsRemoved: boolean;
  removeAds: () => void;
};

const AdsContext = createContext<AdsContextType>({
  adsRemoved: false,
  removeAds: () => {},
});

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adsRemoved, setAdsRemoved] = useState(false);

  const removeAds = () => {
    setAdsRemoved(true);
  };

  return (
    <AdsContext.Provider value={{ adsRemoved, removeAds }}>
      {children}
    </AdsContext.Provider>
  );
};

export const useAdsContext = () => useContext(AdsContext);
