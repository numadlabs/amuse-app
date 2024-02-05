import React from 'react';
import Header from '@/app/components/layout/Header';
import Steps from '@/app/components/atom/Steps';
import { Slot } from 'expo-router';

export default function SuLayout({ children }) {
  return (
    <>
      <Header title='Sign up' />
      {children}
      <Slot />
    </>
  );
}
