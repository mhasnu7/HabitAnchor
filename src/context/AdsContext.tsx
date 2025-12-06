import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdsContextType = {
  adsRemoved: boolean;
  removeAds: () => Promise<void>;
  restoreAds: () => Promise<void>;
};

const AdsContext = createContext<AdsContextType>({
  adsRemoved: false,
  removeAds: async () => {},
  restoreAds: async () => {},
});

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adsRemoved, setAdsRemoved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("adsRemoved").then((val) => {
      if (val === "true") setAdsRemoved(true);
    });
  }, []);

  const removeAds = async () => {
    // For now, only simulate remove
    setAdsRemoved(true);
    await AsyncStorage.setItem("adsRemoved", "true");
  };

  const restoreAds = async () => {
    // For now, simulate success
    setAdsRemoved(true);
    await AsyncStorage.setItem("adsRemoved", "true");
  };

  return (
    <AdsContext.Provider value={{ adsRemoved, removeAds, restoreAds }}>
      {children}
    </AdsContext.Provider>
  );
};

export const useAdsContext = () => useContext(AdsContext);
