import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAdsContext } from '../context/AdsContext';

// ⭐ Use Test ID in development, Real ID in production
const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-2024868517400530/8645807008'; // ✅ Your real banner ID

const BannerAdComponent: React.FC = () => {
  const { adsRemoved } = useAdsContext();

  // ⭐ Hide ad if user purchased Remove Ads
  if (adsRemoved) return null;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => console.log('Banner Ad Loaded')}
        onAdFailedToLoad={(error) => console.log('Banner Ad Load Error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',

    // ⭐ Prevent ads covering content
    position: 'absolute',
    bottom: 0,
    zIndex: 999,
    elevation: 10,

    // ⭐ Extra iOS spacing for safe area bottom
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
  },
});

export default BannerAdComponent;
