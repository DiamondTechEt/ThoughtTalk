import { Tabs } from 'expo-router';
import { Chrome as Home, PenTool, Settings } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  const tabBarOptions = {
    activeTintColor: '#6366F1',
    inactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    style: {
      backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderTopColor: colorScheme === 'dark' ? '#2D2D2D' : '#E5E7EB',
      borderTopWidth: 1,
    },
  };

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarOptions }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-thoughts"
        options={{
          title: 'My Thoughts',
          tabBarIcon: ({ size, color }) => (
            <PenTool size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}