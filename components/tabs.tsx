import { withLayoutContext } from 'expo-router';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

export const Tabs = withLayoutContext(
  createMaterialBottomTabNavigator().Navigator
);
