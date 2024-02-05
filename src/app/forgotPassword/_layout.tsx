import React from 'react';
import Header from '@/app/components/layout/Header';
import Steps from '@/app/components/atom/Steps';
import { Slot } from 'expo-router';

export default function FpLayout({ children }) {
  return (
    <>
      <Header title='Forgot password?' />
     
      {children}
      <Slot />
    </>
  );
}
