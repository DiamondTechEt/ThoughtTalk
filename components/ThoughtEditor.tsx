import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { prisma } from '@/lib/prisma';
import { useAuth } from '@/hooks/useAuth';

interface ThoughtEditorProps {
  visible: boolean;
  thought?: any;
  onClose: () => void;
}

export function ThoughtEditor({ visible, thought, onClose }: ThoughtEditorProps) {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const styles = createStyles(colorScheme);
  const isEditing = !!thought;
  const maxLength = 280;

  useEffect(() => {
    if (visible) {
      setContent(thought?.content || '');
    }
  }, [visible, thought]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be signed in to save thoughts.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your thought.');
      return;
    }

    if (content.length > maxLength) {
      Alert.alert('Error', `Thoughts must be ${maxLength} characters or less.`);
      return;
    }

    try {
      setIsSaving(true);
      
      if (isEditing) {
        await prisma.thought.update({
          where: { id: thought.id },
          data: { content: content.trim() },
        });
      } else {
        await prisma.thought.create({
          data: {
            content: content.trim(),
            userId: user.id,
          },
        });
      }
      
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save thought. Please try again.');
      console.error('Error saving thought:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (content.trim() && content !== (thought?.content || '')) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onClose },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
              <X size={24} color={colorScheme === 'dark' ? '#FFFFFF' : '#111827'} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Thought' : 'New Thought'}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.headerButton,
                styles.saveButton,
                (!content.trim() || isSaving) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!content.trim() || isSaving}
            >
              <Check
                size={24}
                color={
                  !content.trim() || isSaving
                    ? (colorScheme === 'dark' ? '#6B7280' : '#9CA3AF')
                    : '#3B82F6'
                }
              />
            </TouchableOpacity>
          </View>

          <View style={styles.editorContainer}>
            <TextInput
              style={styles.textInput}
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
              multiline
              autoFocus
              maxLength={maxLength}
              textAlignVertical="top"
            />
            
            <View style={styles.footer}>
              <Text style={[
                styles.characterCount,
                content.length > maxLength * 0.9 && styles.characterCountWarning,
                content.length >= maxLength && styles.characterCountError,
              ]}>
                {content.length}/{maxLength}
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#FFFFFF',
    },
    keyboardContainer: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2D2D2D' : '#E5E7EB',
    },
    headerButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButton: {
      // Additional styling can be added here if needed
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    editorContainer: {
      flex: 1,
      padding: 16,
    },
    textInput: {
      flex: 1,
      fontSize: 18,
      lineHeight: 26,
      color: isDark ? '#F9FAFB' : '#111827',
      textAlignVertical: 'top',
    },
    footer: {
      alignItems: 'flex-end',
      paddingTop: 16,
    },
    characterCount: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    characterCountWarning: {
      color: '#F59E0B',
    },
    characterCountError: {
      color: '#EF4444',
    },
  });
}