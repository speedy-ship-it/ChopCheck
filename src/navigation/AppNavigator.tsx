import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../data/types';

import SearchScreen from '../screens/SearchScreen';
import VehicleDetailScreen from '../screens/VehicleDetailScreen';
import VINScanScreen from '../screens/VINScanScreen';
import PhotoRecognitionScreen from '../screens/PhotoRecognitionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Search"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
        <Stack.Screen name="VINScan" component={VINScanScreen} />
        <Stack.Screen name="PhotoRecognition" component={PhotoRecognitionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
