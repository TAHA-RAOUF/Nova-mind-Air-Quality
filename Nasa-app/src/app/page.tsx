"use client";
// src/pages/index.tsx
import AirQualityDashboard from './components/AirQualityDashboard';
import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LoginForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';

export default function Home() {

  return <AirQualityDashboard />;
}
