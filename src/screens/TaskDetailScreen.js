import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, StatusBar } from 'react-native';
import * as api from '../api/api';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TaskDetailScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState(task.priority || 3); 

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const toggleEditMode = () => {
    if (isEditing) {
      
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority || 3);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      setIsLoading(true);
      const updatedTask = await api.updateTask(task._id, { 
        title, 
        description, 
        priority,
        
        completed: task.completed,
        dueDate: task.dueDate
      });
      setIsEditing(false);
      navigation.navigate('Home', { updatedTask });
    } catch (error) {
      Alert.alert('Error', error.error || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await api.deleteTask(task._id);
              navigation.navigate('Home', { deletedTaskId: task._id });
            } catch (error) {
              Alert.alert('Error', error.error || 'Failed to delete task');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleComplete = async () => {
    try {
      setIsLoading(true);
      const updatedTask = await api.toggleTaskCompletion(task._id);
      navigation.navigate('Home', { updatedTask });
    } catch (error) {
      Alert.alert('Error', error.error || 'Failed to update task status');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priorityLevel) => {
    switch(priorityLevel) {
      case 1: return '#EF4444';
      case 2: return '#F59E0B';
      case 3: return '#10B981'; 
      default: return '#6B7280'; 
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
            className={`flex-1 p-3 rounded-lg border-2 flex-row justify-center items-center ${
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

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      
      <LinearGradient
        colors={['#111827', '#0F172A']}
        className="px-4 pt-12 pb-4"
      >
        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Feather name="arrow-left" size={24} color="#E5E7EB" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-white">
            {isEditing ? 'Edit Task' : 'Task Details'}
          </Text>

          <TouchableOpacity 
            onPress={toggleEditMode}
            className="p-2"
          >
            <Feather 
              name={isEditing ? "x" : "edit-2"} 
              size={20} 
              color="#E5E7EB" 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1">
        <View className="p-6">
          {isEditing ? (
            <>
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
                  placeholder="Enter task description"
                  placeholderTextColor="#6B7280"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              {renderPrioritySelector()}

              <TouchableOpacity
                className={`rounded-lg p-4 mt-6 ${isLoading ? 'bg-indigo-700' : 'bg-indigo-600'}`}
                onPress={handleUpdateTask}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-center">Save Changes</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View className="mb-6">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-sm">Title</Text>
                    <Text className="text-xl font-semibold mt-1 text-white">{title}</Text>
                  </View>
                  
                  {task.priority && (
                    <View 
                      className="px-3 py-1 rounded-md"
                      style={{ backgroundColor: `${getPriorityColor(task.priority)}20` }}
                    >
                      <Text style={{ color: getPriorityColor(task.priority) }}>
                        {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {task.dueDate && (
                <View className="mb-6">
                  <Text className="text-gray-400 text-sm">Due Date</Text>
                  <View className="flex-row items-center mt-1">
                    <Feather name="calendar" size={16} color="#9CA3AF" className="mr-2" />
                    <Text className="text-gray-300">
                      {new Date(task.dueDate).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
              )}

              <View className="mb-6">
                <Text className="text-gray-400 text-sm">Description</Text>
                <Text className="mt-1 text-gray-300">
                  {description || 'No description provided'}
                </Text>
              </View>

              <View className="mb-6">
                <Text className="text-gray-400 text-sm">Status</Text>
                <View className="flex-row items-center mt-2">
                  <View 
                    className={`px-3 py-1 rounded-full ${
                      task.completed 
                        ? 'bg-green-900 border border-green-700' 
                        : 'bg-blue-900 border border-blue-700'
                    }`}
                  >
                    <Text 
                      className={`${
                        task.completed ? 'text-green-400' : 'text-blue-400'
                      }`}
                    >
                      {task.completed ? 'Completed' : 'In Progress'}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className={`rounded-lg p-4 flex-row items-center justify-center mt-6 ${
                  task.completed ? 'bg-yellow-600' : 'bg-green-600'
                }`}
                onPress={handleToggleComplete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Feather 
                      name={task.completed ? "refresh-ccw" : "check"} 
                      size={20} 
                      color="white" 
                      className="mr-2" 
                    />
                    <Text className="text-white font-bold">
                      {task.completed ? 'Mark as In Progress' : 'Mark as Completed'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-lg p-4 bg-red-600 mt-4 flex-row items-center justify-center"
                onPress={handleDeleteTask}
                disabled={isLoading}
              >
                <Feather name="trash-2" size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold">Delete Task</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TaskDetailScreen;