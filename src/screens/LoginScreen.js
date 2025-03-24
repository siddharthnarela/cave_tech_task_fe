import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      // Navigation will be handled by AppNavigator
    } catch (error) {
      Alert.alert('Login Failed', error.error || 'Please check your credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      <LinearGradient
        colors={['#111827', '#0F172A']}
        className="absolute top-0 left-0 right-0 h-40"
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 p-6 justify-center">
            <View className="items-center mb-10">
              <View className="w-20 h-20 bg-indigo-600 rounded-2xl items-center justify-center mb-4">
                <Feather name="check-square" size={40} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white">Task Manager</Text>
              <Text className="text-center text-gray-400 mt-2">Log in to your account</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-300 mb-2 font-medium">Email</Text>
              <View className="flex-row border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
                <View className="p-3 justify-center items-center">
                  <Feather name="mail" size={20} color="#6B7280" />
                </View>
                <TextInput
                  className="flex-1 p-3 text-white"
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-300 mb-2 font-medium">Password</Text>
              <View className="flex-row border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
                <View className="p-3 justify-center items-center">
                  <Feather name="lock" size={20} color="#6B7280" />
                </View>
                <TextInput
                  className="flex-1 p-3 text-white"
                  placeholder="Enter your password"
                  placeholderTextColor="#6B7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={togglePasswordVisibility}
                  className="p-3 justify-center items-center"
                >
                  <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity className="self-end mt-2">
                <Text className="text-indigo-400 font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={['#4F46E5', '#6366F1']}
              className="rounded-lg mb-6"
            >
              <TouchableOpacity
                className="p-4 items-center"
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center">Log In</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="text-indigo-400 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;