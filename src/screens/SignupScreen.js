import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await signup(name, email, password);
      // Navigation will be handled by AppNavigator
    } catch (error) {
      let errorMessage = 'Please try again with different credentials';
      
      if (error.error) {
        if (error.error.includes('Network error')) {
          errorMessage = 'Cannot connect to the server. Please check your internet connection.';
        } else {
          errorMessage = error.error;
        }
      }
      
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-indigo-600 rounded-2xl items-center justify-center mb-4">
                <Feather name="user-plus" size={40} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white">Task Manager</Text>
              <Text className="text-center text-gray-400 mt-2">Create your account</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-300 mb-2 font-medium">Full Name</Text>
              <View className="flex-row border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
                <View className="p-3 justify-center items-center">
                  <Feather name="user" size={20} color="#6B7280" />
                </View>
                <TextInput
                  className="flex-1 p-3 text-white"
                  placeholder="Enter your full name"
                  placeholderTextColor="#6B7280"
                  value={name}
                  onChangeText={setName}
                />
              </View>
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

            <View className="mb-4">
              <Text className="text-gray-300 mb-2 font-medium">Password</Text>
              <View className="flex-row border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
                <View className="p-3 justify-center items-center">
                  <Feather name="lock" size={20} color="#6B7280" />
                </View>
                <TextInput
                  className="flex-1 p-3 text-white"
                  placeholder="Create a password"
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
            </View>

            <View className="mb-6">
              <Text className="text-gray-300 mb-2 font-medium">Confirm Password</Text>
              <View className="flex-row border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
                <View className="p-3 justify-center items-center">
                  <Feather name="lock" size={20} color="#6B7280" />
                </View>
                <TextInput
                  className="flex-1 p-3 text-white"
                  placeholder="Confirm your password"
                  placeholderTextColor="#6B7280"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  onPress={toggleConfirmPasswordVisibility}
                  className="p-3 justify-center items-center"
                >
                  <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <LinearGradient
              colors={['#4F46E5', '#6366F1']}
              className="rounded-lg mb-6"
            >
              <TouchableOpacity
                className="p-4 items-center"
                onPress={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center">Create Account</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-400">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-indigo-400 font-semibold">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignupScreen;