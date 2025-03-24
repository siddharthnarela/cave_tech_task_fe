import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, StatusBar } from 'react-native';
import * as api from '../api/api';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [priority, setPriority] = useState(3); 
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      setIsLoading(true);
      await api.createTask({ 
        title, 
        description, 
        priority,
        dueDate,
        completed: false
      });
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.error || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions = [
    { value: 1, label: 'High', color: '#EF4444' },
    { value: 2, label: 'Medium', color: '#F59E0B' },
    { value: 3, label: 'Low', color: '#10B981' },
  ];

  const renderPrioritySelector = () => (
    <View className="mb-6">
      <Text className="text-gray-300 mb-3 font-medium">Priority</Text>
      <View className="flex-row space-x-3">
        {priorityOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setPriority(option.value)}
            className={`flex-1 p-3 ml-3 rounded-lg border-2 flex-row justify-center items-center ${
              priority === option.value 
                ? `border-${option.value === 1 ? 'red' : option.value === 2 ? 'yellow' : 'green'}-500` 
                : 'border-gray-700'
            }`}
            style={{
              backgroundColor: priority === option.value ? `${option.color}20` : 'transparent'
            }}
          >
            {priority === option.value && (
              <Feather name="check" size={16} color={option.color} className="mr-2" />
            )}
            <Text 
              style={{ color: option.color }}
              className="font-medium"
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleConfirmDate = (selectedDate) => {
    setShowDatePicker(false);
    setDueDate(selectedDate);
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Custom Header */}
      <LinearGradient
        colors={['#111827', '#0F172A']}
        className="px-4 pt-12 pb-4"
      >
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Feather name="x" size={24} color="#E5E7EB" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-white">Add New Task</Text>

          <View style={{ width: 32 }} /> 
        </View>
      </LinearGradient>

      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="mb-6">
            <Text className="text-gray-300 mb-2 font-medium">Task Title</Text>
            <TextInput
              className="border border-gray-700 rounded-lg p-3 bg-gray-800 text-white"
              placeholder="Enter task title"
              placeholderTextColor="#6B7280"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-300 mb-2 font-medium">Description</Text>
            <TextInput
              className="border border-gray-700 rounded-lg p-3 bg-gray-800 text-white h-32"
              placeholder="Enter task description (optional)"
              placeholderTextColor="#6B7280"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          {renderPrioritySelector()}

          <View className="mb-6">
            <Text className="text-gray-300 mb-2 font-medium">Due Date (Optional)</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="border border-gray-700 rounded-lg p-3 bg-gray-800 flex-row items-center"
            >
              <Feather name="calendar" size={20} color="#6B7280" className="mr-2" />
              <Text className={dueDate ? "text-white" : "text-gray-500"}>
                {dueDate 
                  ? dueDate.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'long', 
                      day: 'numeric'
                    })
                  : 'Select due date'
                }
              </Text>
            </TouchableOpacity>
            
            {dueDate && (
              <TouchableOpacity 
                onPress={() => setDueDate(null)}
                className="mt-2 flex-row items-center"
              >
                <Feather name="x-circle" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 ml-1">Clear date</Text>
              </TouchableOpacity>
            )}
            
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={handleCancelDate}
              date={dueDate || new Date()}
              minimumDate={new Date()}
              accentColor="#4F46E5"
              themeVariant="dark"
            />
          </View>

          <LinearGradient
            colors={['#4F46E5', '#6366F1']}
            className="rounded-lg mt-6"
          >
            <TouchableOpacity
              className="p-4 items-center"
              onPress={handleAddTask}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View className="flex-row items-center">
                  <Feather name="plus" size={20} color="white" className="mr-2" />
                  <Text className="text-white font-bold text-center">Create Task</Text>
                </View>
              )}
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity 
            className="mt-4 p-3" 
            onPress={() => navigation.goBack()}
          >
            <Text className="text-gray-400 text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddTaskScreen;