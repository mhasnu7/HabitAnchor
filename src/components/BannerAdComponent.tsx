import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAdsContext } from '../context/AdsContext';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your real Ad Unit ID later

const BannerAdComponent: React.FC = () => {
  const { adsRemoved, loadingAdsStatus } = useAdsContext();

  if (adsRemoved || loadingAdsStatus) {
    // Do not render ad if ads are removed or status is still loading
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.error('Ad failed to load:', error);
        }}
        onAdLoaded={() => {
          console.log('Ad loaded successfully!');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent', // Or a color that matches your app's theme
  },
});

export default BannerAdComponent;