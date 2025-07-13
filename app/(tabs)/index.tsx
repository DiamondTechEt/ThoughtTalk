import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThoughtCard } from '@/components/ThoughtCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useThoughts } from '@/hooks/useThoughts';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { thoughts, loading, refreshThoughts } = useThoughts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshThoughts();
    setRefreshing(false);
  };

  const styles = createStyles(colorScheme);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authPromptText}>Sign in to view the community feed</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && thoughts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Feed</Text>
        <Text style={styles.headerSubtitle}>Share your thoughts with the world</Text>
      </View>
      
      <FlatList
        data={thoughts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThoughtCard
            thought={item}
            currentUserId={user.id}
            onUpdate={refreshThoughts}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
    },
    header: {
      padding: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    authPrompt: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    authPromptText: {
      fontSize: 18,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
  });
}