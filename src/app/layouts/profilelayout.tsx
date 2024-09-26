import React, { ReactNode } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/layout/Header';
import BugReportButton from '../BugReport';

interface ProfileLayoutProps {
  children: ReactNode;
  headerTitle?: string;
}

export default function ProfileLayout({
  children,
  headerTitle,
}: ProfileLayoutProps) {
  const navigation = useNavigation();
  const route = useRoute();

  const determineHeaderTitle = () => {
    if (headerTitle) return headerTitle;
    switch (route.name) {
      case 'profileSection/ProfileEdit':
        return 'Account';
      case 'Faq':
        return 'FAQ';
      case 'TermsAndCondo':
        return 'Terms and Conditions';
      case 'PrivacyPolicy':
        return 'Privacy Policy';
      case 'BugReport':
        return 'Help Us Improve';
      default:
        return '';
    }
  };

  const headerInfo = determineHeaderTitle();

  return (
    <SafeAreaView>
      <ScrollView>
        {headerInfo !== "blank" && (
          <Header title={determineHeaderTitle()} />
        )}
        {children}
      </ScrollView>
      {route.name === 'ReportABug' && <BugReportButton />}
    </SafeAreaView>
  );
}