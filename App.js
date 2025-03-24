import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';


export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView className="flex-1">
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}