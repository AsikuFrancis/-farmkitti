import { Tabs } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { SyncManager } from '../../src/services/syncManager';

export default function TabLayout() {
  const { t } = useTranslation();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, trigger sync check
        SyncManager.sync();
      }
      appState.current = nextAppState;
    });

    // Also try syncing on initial load
    SyncManager.sync();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="farms"
        options={{
          title: 'Farms',
        }}
      />
      <Tabs.Screen
        name="disease"
        options={{
          title: 'Disease',
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
        }}
      />
    </Tabs>
  );
}
