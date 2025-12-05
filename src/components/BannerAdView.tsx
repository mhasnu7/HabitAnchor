import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAdsContext } from '../context/AdsContext';

const BannerAdView = () => {
  const { adsRemoved } = useAdsContext();

  if (adsRemoved) return null; // hide ads if premium

  return (
    <BannerAd
      unitId={TestIds.BANNER} // SAFE TEST ID
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
};

export default BannerAdView;
