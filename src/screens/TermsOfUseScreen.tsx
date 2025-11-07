import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FONTS } from '../theme/constants';

const TermsOfUseScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { fontFamily: FONTS.heading }]}>Anchor Habits Terms of Use</Text>
        <Text style={[styles.effectiveDate, { fontFamily: FONTS.body }]}>Effective Date: November 6, 2025</Text>

        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          Welcome to Anchor Habits! These Terms of Use ("Terms") govern your use of the Anchor Habits mobile application ("the App"), provided by Mohammed Hasnuddin.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          By accessing or using the Anchor Habits App, you agree to be bound by these Terms and all terms incorporated by reference. If you do not agree to all of these Terms, do not use the App.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>2. Purpose of the App</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          Anchor Habits is a habit tracking application designed to help users set, track, and manage their daily habits. It provides tools and features to support users in building and maintaining positive routines.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>3. User Data and Privacy</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          As stated in our Privacy Policy, Anchor Habits does not collect any personal data from its users. All user-generated data, including habit information, is stored locally on your device. You are solely responsible for your data and any backups.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>4. User Responsibilities</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          You agree to use the App only for its intended purpose and in accordance with these Terms. You are responsible for:
        </Text>
        <Text style={[styles.listItem, { fontFamily: FONTS.body }]}>* Maintaining the security of your device.</Text>
        <Text style={[styles.listItem, { fontFamily: FONTS.body }]}>* Ensuring the accuracy of the data you input into the App.</Text>
        <Text style={[styles.listItem, { fontFamily: FONTS.body }]}>* Complying with all applicable laws and regulations in your use of the App.</Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>5. Prohibited Conduct</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          You agree not to:
        </Text>
        <Text style={[styles.listItem, { fontFamily: FONTS.body }]}>* Use the App for any illegal or unauthorized purpose.</Text>
        <Text style={[styles.listItem, { fontFamily: FONTS.body }]}>* Interfere with or disrupt the integrity or performance of the App.</Text>
        <Text style={[styles.listItem, { fontFamily: FONTS.body }]}>* Attempt to gain unauthorized access to the App or its related systems or networks.</Text>
        <Text style={[styles.listItem, { fontFamily: FONTS.body }]}>* Use the App to store or transmit any malicious code, viruses, or other harmful programs.</Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>6. Intellectual Property and Inspiration</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          The App and its original content, features, and functionality are and will remain the exclusive property of Mohammed Hasnuddin and its licensors. While the development of Anchor Habits was motivated by the use of other habit tracking applications, no copyright infringement is intended. This application is an independent creation.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>7. Disclaimers</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          The App is provided on an "AS IS" and "AS AVAILABLE" basis. Mohammed Hasnuddin makes no warranties, expressed or implied, regarding the App's accuracy, reliability, or suitability for any particular purpose. We do not guarantee that the App will be uninterrupted, error-free, or free of viruses or other harmful components.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>8. Limitation of Liability</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          To the fullest extent permitted by applicable law, Mohammed Hasnuddin shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the App; (b) any conduct or content of any third party on the App; (c) any content obtained from the App; and (d) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>9. Changes to These Terms</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our App after those revisions become effective, you agree to be bound by the revised terms.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>10. Governing Law</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </Text>

        <Text style={[styles.heading, { fontFamily: FONTS.heading }]}>11. Contact Us</Text>
        <Text style={[styles.paragraph, { fontFamily: FONTS.body }]}>
          If you have any questions about these Terms, please contact us at mdhasnu21@gmail.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Or your app's background color
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    marginBottom: 10,
  },
  effectiveDate: {
    fontSize: 14,
    color: '#666',
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
});

export default TermsOfUseScreen;