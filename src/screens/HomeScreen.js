import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api/api';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user } = useAuth();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await api.fetchTasks();
      
      
      const sortedData = [...data].sort((a, b) => {
        
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        
        if (a.priority && b.priority && a.priority !== b.priority) 
          return a.priority - b.priority;
        
        if (a.dueDate && b.dueDate) 
          return new Date(a.dueDate) - new Date(b.dueDate);
        return 0;
      });
      
      setTasks(sortedData);
    } catch (error) {
      Alert.alert('Error', error.error || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await logout();
              
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  const handleTaskStatusToggle = async (taskId, currentStatus) => {
    try {
      await api.updateTaskStatus(taskId, !currentStatus);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? {...task, completed: !currentStatus} : task
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return '#6B7280'; 
    
    switch(priority) {
      case 1: return '#EF4444';
      case 2: return '#F59E0B';
      case 3: return '#10B981';
      default: return '#6B7280'; 
    }
  };

  const renderItem = ({ item }) => {
    const priorityColor = getPriorityColor(item.priority);
    const dueDate = item.dueDate ? new Date(item.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date() && !item.completed;
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetail', { task: item })}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[item.completed ? '#1F2937' : '#18181B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4 overflow-hidden rounded-xl mb-3 border border-gray-800"
          style={{
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                onPress={() => handleTaskStatusToggle(item._id, item.completed)}
                className={`mr-3 rounded-full border-2 p-1 ${item.completed ? 'border-green-500 bg-green-900' : 'border-gray-600'}`}
              >
                {item.completed && <Feather name="check" size={14} color="#10B981" />}
              </TouchableOpacity>
              
              <View className="flex-1">
                <Text 
                  className={`text-lg font-semibold ${item.completed ? 'text-gray-400 line-through' : 'text-gray-100'}`}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                
                {item.description ? (
                  <Text 
                    className={`text-sm mt-1 ${item.completed ? 'text-gray-500' : 'text-gray-300'}`}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                ) : null}
                
                <View className="flex-row mt-2 items-center">
                  {item.priority && (
                    <View 
                      className="px-2 py-1 rounded-md mr-2"
                      style={{ backgroundColor: `${priorityColor}20` }}
                    >
                      <Text style={{ color: priorityColor, fontSize: 12 }}>
                        {item.priority === 1 ? 'High' : item.priority === 2 ? 'Medium' : 'Low'}
                      </Text>
                    </View>
                  )}
                  
                  {dueDate && (
                    <View className="flex-row items-center">
                      <Feather name="calendar" size={12} color={isOverdue ? '#EF4444' : '#9CA3AF'} />
                      <Text 
                        className={`text-xs ml-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}
                      >
                        {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <Feather name="chevron-right" size={18} color="#6B7280" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      
      
      <LinearGradient
        colors={['#111827', '#0F172A']}
        className="px-4 pt-5 pb-4"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-white">My Tasks</Text>
            <Text className="text-gray-400 mt-1">
              {tasks.filter(t => !t.completed).length} active, {tasks.filter(t => t.completed).length} completed
            </Text>
          </View>
          
          <View className="flex-row">
            <TouchableOpacity 
              onPress={() => navigation.navigate('Search')}
              className="p-2 mr-2 bg-gray-800 rounded-full"
            >
              <Feather name="search" size={22} color="#E5E7EB" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleLogout}
              className="p-2 bg-gray-800 rounded-full"
            >
              <Feather name="log-out" size={22} color="#E5E7EB" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Task filters */}
        {/* <View className="flex-row mt-4 space-x-2">
          <TouchableOpacity 
            className="px-4 py-2 bg-indigo-600 rounded-lg"
            onPress={() => navigation.navigate('FilterTasks')}
          >
            <Text className="text-white font-medium">All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="px-4 py-2 bg-gray-800 rounded-lg"
            onPress={() => navigation.navigate('FilterTasks', { filter: 'today' })}
          >
            <Text className="text-gray-200">Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="px-4 py-2 bg-gray-800 rounded-lg"
            onPress={() => navigation.navigate('FilterTasks', { filter: 'priority' })}
          >
            <Text className="text-gray-200">Priority</Text>
          </TouchableOpacity>
        </View> */}
      </LinearGradient>

      {isLoading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={["#6366F1"]}
              tintColor="#6366F1"
              progressBackgroundColor="#1F2937"
            />
          }
          ListEmptyComponent={
            <View className="py-12 justify-center items-center">
              <View className="bg-gray-800 p-6 rounded-full mb-4">
                <Feather name="clipboard" size={50} color="#6366F1" />
              </View>
              <Text className="text-gray-300 text-lg font-medium">No tasks found</Text>
              <Text className="text-gray-500 mt-2 text-center px-6">Pull down to refresh or tap the + button to add a new task</Text>
              <TouchableOpacity
                className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg"
                onPress={() => navigation.navigate('AddTask')}
              >
                <Text className="text-white font-semibold">Create First Task</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      
      <TouchableOpacity
        className="absolute bottom-6 right-6 justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('AddTask')}
        style={{
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
      >
        <LinearGradient
          colors={['#4F46E5', '#6366F1']}
          className="w-16 h-16 rounded-full justify-center items-center"
        >
          <Feather name="plus" size={26} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;