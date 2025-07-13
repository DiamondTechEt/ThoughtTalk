import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { ThoughtCard } from '@/components/ThoughtCard';
import { ThoughtEditor } from '@/components/ThoughtEditor';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useThoughts } from '@/hooks/useThoughts';

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  // const { thoughts, loading, refreshThoughts } = useThoughts();
  const { thoughts, loading, refreshThoughts } = useThoughts(user?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshThoughts();
    setRefreshing(false);
  };

  const handleCreateThought = () => {
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    refreshThoughts();
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
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateThought}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Share a Thought</Text>
        </TouchableOpacity>
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

      <ThoughtEditor
        visible={showEditor}
        onClose={handleEditorClose}
      />
    </SafeAreaView>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F9FAFB',
    },
    header: {
      padding: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 16,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#6366F1',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
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