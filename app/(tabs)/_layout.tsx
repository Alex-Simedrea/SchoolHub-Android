import React, { useEffect } from 'react';
import { Tabs } from '@/components/tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.elevation.level2);
  }, [theme]);

  return (
    <Tabs>
      <Tabs.Screen
        name='(dashboard)'
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }: { focused: boolean; color: string }) => (
            <MaterialCommunityIcons name='home' size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name='subjects'
        options={{
          title: 'Subjects',
          tabBarIcon: ({ color }: { focused: boolean; color: string }) => (
            <MaterialCommunityIcons name='book' size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name='timetable'
        options={{
          title: 'Timetable',
          tabBarIcon: ({ color }: { focused: boolean; color: string }) => (
            <MaterialCommunityIcons name='calendar' size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { focused: boolean; color: string }) => (
            <MaterialCommunityIcons name='cog' size={24} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
