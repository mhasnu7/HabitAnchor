import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { FONTS } from '../theme/constants';
import HomeButton from '../components/HomeButton';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicyScreen = () => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.contentWrapper}>
        <ScrollView style={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>Anchor Habits Privacy Policy</Text>
        <Text style={[styles.effectiveDate, { color: theme.subtleText }]}>Effective Date: November 6, 2025</Text>

        <Text style={[styles.paragraph, { color: theme.text }]}>
          This Privacy Policy describes how Anchor Habits ("the App"), developed by Mohammed Hasnuddin, collects, uses, and protects information when you use our mobile application.
        </Text>

        <Text style={[styles.heading, { color: theme.text }]}>1. Information We Do Not Collect</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          Anchor Habits is designed with your privacy in mind. We do not collect any personal data from our users. This includes, but is not limited to:
        </Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* Names</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* Email addresses</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* Location data</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* Device identifiers</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* Usage analytics tied to individual users</Text>

        <Text style={[styles.heading, { color: theme.text }]}>2. Local Data Storage</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          All data you input into the Anchor Habits app, including your habits, progress, and any other related information, is stored exclusively on your local device. This means:
        </Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* Your data is not transmitted to our servers or any third-party servers.</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* We do not have access to your habit data or any other information you store in the App.</Text>
        <Text style={[styles.listItem, { color: theme.text }]}>* You are solely responsible for backing up your device data. If your device is lost, stolen, or damaged, your data may be unrecoverable unless you have your own backup solution.</Text>

        <Text style={[styles.heading, { color: theme.text }]}>3. No Third-Party Sharing</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          Since we do not collect any personal data, there is no personal data to share with third parties.
        </Text>

        <Text style={[styles.heading, { color: theme.text }]}>4. Children's Privacy</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          Anchor Habits does not knowingly collect any personal information from children under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take the necessary actions.
        </Text>

        <Text style={[styles.heading, { color: theme.text }]}>5. Changes to This Privacy Policy</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the App or on our website. You are advised to review this Privacy Policy periodically for any changes.
        </Text>

        <Text style={[styles.heading, { color: theme.text }]}>6. Contact Us</Text>
        <Text style={[styles.paragraph, { color: theme.text }]}>
          If you have any questions about this Privacy Policy, please contact us at mdhasnu21@gmail.com.
        </Text>
      </ScrollView>
      <View style={[styles.bottomBar, { backgroundColor: theme.cardBackground }]}>
        <HomeButton iconColor={theme.accentGreen} />
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 60, // Make space for the bottom bar
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    marginBottom: 10,
  },
  effectiveDate: {
    fontSize: 14,
    fontFamily: FONTS.body,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontFamily: FONTS.body,
    marginBottom: 10,
    lineHeight: 24,
  },
  listItem: {
    fontFamily: FONTS.body,
    marginLeft: 10,
    marginBottom: 5,
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333', // Use a subtle color for separation
  },
});

export default PrivacyPolicyScreen;