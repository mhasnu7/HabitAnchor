import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Platform, Alert } from 'react-native';

// --- Configuration ---
const REVENUECAT_API_KEY = 'test_AkMAjqAhJYyCUiKvQMyVPPclULc';
const ENTITLEMENT_ID = 'Anchor Habits Pro';
const PRODUCT_ID = 'remove_ads_test'; // Retained for reference, but we will use package
const OFFERING_ID = 'default';
const PACKAGE_ID = 'remove_ads_package';

/**
 * 1. Configure RevenueCat SDK.
 * Note: We only configure for Android as requested.
 */
export const configureRevenueCat = () => {
  // Disabled: RevenueCat configuration commented out to prevent initialization and API calls.
  // if (Platform.OS === 'android') {
  //   console.log('RevenueCat: Configuring for Android...');
  //   // Use the Test Store configuration as requested
  //   Purchases.configure({
  //     apiKey: REVENUECAT_API_KEY,
  //     appUserID: null, // Use null for anonymous users
  //   });
  //   // Enable debug logs for testing
  //   Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  // } else {
  //   console.log('RevenueCat: Not configuring for iOS as requested.');
  // }
};

/**
 * 2. Check if the user has the 'remove_ads_entitlement'.
 * This is the source of truth for the purchase status.
 */
export const checkRevenueCatEntitlementStatus = async (): Promise<boolean> => {
  // Disabled: Always return false as purchases are disabled.
  return false;
};

/**
 * 3. Fetch the product and initiate the purchase flow.
 */
export const handleRemoveAdsPurchase = async (): Promise<boolean> => {
  // Disabled: Purchase logic is disabled.
  console.log('RevenueCat: handleRemoveAdsPurchase called but purchase logic is disabled.');
  return false;
};

/**
 * 4. Restore purchases (useful for users switching devices or reinstalling)
 */
export const restorePurchases = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }
  try {
    const customerInfo = await Purchases.restorePurchases();
    const hasEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    if (hasEntitlement) {
      Alert.alert('Success', 'Purchases restored successfully. Ads are now removed.');
    } else {
      Alert.alert('Info', 'No previous purchases found to restore.');
    }
    return hasEntitlement;
  } catch (error) {
    console.error('RevenueCat: Error restoring purchases:', error);
    Alert.alert('Error', 'Failed to restore purchases.');
    return false;
  }
};