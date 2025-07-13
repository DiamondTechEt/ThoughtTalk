import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { ThoughtCard } from '@/components/ThoughtCard';
import { ThoughtEditor } from '@/components/ThoughtEditor';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useMyThoughts } from '@/hooks/useMyThoughts';

export default function MyThoughtsScreen() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { thoughts, loading, refreshThoughts } = useMyThoughts(user?.id);
  const [showEditor, setShowEditor] = useState(false);
  const [editingThought, setEditingThought] = useState(null);

  const styles = createStyles(colorScheme);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authPromptText}>Sign in to manage your thoughts</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCreateThought = () => {
    setEditingThought(null);
    setShowEditor(true);
  };

  const handleEditThought = (thought: any) => {
    setEditingThought(thought);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingThought(null);
    refreshThoughts();
  };

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
        <Text style={styles.headerTitle}>My Thoughts</Text>
        <Text style={styles.headerSubtitle}>
          {thoughts.length} thought{thoughts.length !== 1 ? 's' : ''} shared
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateThought}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>New Thought</Text>
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
            onEdit={() => handleEditThought(item)}
            showEditDelete={true}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You haven't shared any thoughts yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Tap "New Thought" to get started
            </Text>
          </View>
        }
      />

      <ThoughtEditor
        visible={showEditor}
        thought={editingThought}
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
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
  });
}