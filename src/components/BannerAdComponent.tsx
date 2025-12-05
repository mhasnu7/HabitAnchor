import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAdsContext } from '../context/AdsContext';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with real unit ID later

const BannerAdComponent: React.FC = () => {
  const { adsRemoved } = useAdsContext();

  // If user purchased Remove Ads → Don't render banner
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
        onAdFailedToLoad={(err) => console.log('Banner Ad Error:', err)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    
    // ⭐ Important: Avoid covering UI when keyboard opens
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 0 : 0,
    zIndex: 999,
    elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
});

export default BannerAdComponent;
