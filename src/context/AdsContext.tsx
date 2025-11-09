import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { checkRevenueCatEntitlementStatus } from '../services/RevenueCatService'; // Disabled RevenueCat check

const ADS_REMOVED_KEY = 'hasPurchasedRemoveAds';

interface AdsContextType {
  adsRemoved: boolean;
  setAdsRemoved: (removed: boolean) => void;
  loadingAdsStatus: boolean;
  refreshAdsStatus: () => Promise<void>;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export const useAdsContext = () => {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error('useAdsContext must be used within an AdsProvider');
  }
  return context;
};

export const AdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [loadingAdsStatus, setLoadingAdsStatus] = useState(true);

  const checkLocalStatus = useCallback(async () => {
    try {
      const storedAdsRemoved = await AsyncStorage.getItem(ADS_REMOVED_KEY);
      return storedAdsRemoved === 'true';
    } catch (error) {
      console.error('Error checking local ads status:', error);
      return false;
    }
  }, []);

  const refreshAdsStatus = useCallback(async () => {
    setLoadingAdsStatus(true);
    try {
      // 1. Check local storage first (fastest)
      let removed = await checkLocalStatus();

      // 2. Skip RevenueCat check since it is disabled.
      // If local storage says ads are NOT removed, we assume ads are present.
      
      // 3. Update local storage if status changed (only possible via setAdsRemoved/updateAdsRemoved)
      if (removed) {
        await AsyncStorage.setItem(ADS_REMOVED_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(ADS_REMOVED_KEY);
      }

      setAdsRemoved(removed);
      console.log(`AdsContext: Ads removed status loaded: ${removed}`);
    } catch (error) {
      console.error('AdsContext: Failed to refresh Ads status:', error);
    } finally {
      setLoadingAdsStatus(false);
    }
  }, [checkLocalStatus]);

  useEffect(() => {
    // Initial load
    refreshAdsStatus();
  }, [refreshAdsStatus]);

  const updateAdsRemoved = useCallback(async (removed: boolean) => {
    setAdsRemoved(removed);
    try {
      if (removed) {
        await AsyncStorage.setItem(ADS_REMOVED_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(ADS_REMOVED_KEY);
      }
    } catch (error) {
      console.error('Error updating local ads status:', error);
    }
  }, []);

  return (
    <AdsContext.Provider value={{ adsRemoved, setAdsRemoved: updateAdsRemoved, loadingAdsStatus, refreshAdsStatus }}>
      {children}
    </AdsContext.Provider>
  );
};