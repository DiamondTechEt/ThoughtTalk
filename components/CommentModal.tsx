import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send, User } from 'lucide-react-native';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { thoughtsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Comment {
  id: string;
  content: string;
  userId: string;
  user: {
    displayName: string;
    email: string;
  };
  createdAt: string;
}

interface CommentModalProps {
  visible: boolean;
  thoughtId: string;
  onClose: () => void;
}

export function CommentModal({ visible, thoughtId, onClose }: CommentModalProps) {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const styles = createStyles(colorScheme);

  useEffect(() => {
    if (visible) {
      fetchComments();
    }
  }, [visible, thoughtId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const commentsData = await thoughtsAPI.getComments(thoughtId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await thoughtsAPI.addComment(thoughtId, newComment.trim(), user.id);
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment. Please try again.');
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.commentAvatar}>
          <User size={16} color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'} />
        </View>
        <View style={styles.commentInfo}>
          <Text style={styles.commentUsername}>{item.user.displayName}</Text>
          <Text style={styles.commentTimestamp}>
            {formatDistanceToNow(new Date(item.createdAt))}
          </Text>
        </View>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

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
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colorScheme === 'dark' ? '#F9FAFB' : '#111827'} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Comments</Text>
            <View style={styles.placeholder} />
          </View>

          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={renderComment}
            contentContainerStyle={styles.commentsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No comments yet. Be the first to share your thoughts!
                </Text>
              </View>
            }
          />

          {user && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                multiline
                maxLength={280}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!newComment.trim() || submitting) && styles.sendButtonDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
              >
                <Send
                  size={20}
                  color={
                    !newComment.trim() || submitting
                      ? (colorScheme === 'dark' ? '#9CA3AF' : '#6B7280')
                      : '#FFFFFF'
                  }
                />
              </TouchableOpacity>
            </View>
          )}
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
    closeButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    placeholder: {
      width: 40,
    },
    commentsList: {
      padding: 16,
      flexGrow: 1,
    },
    commentItem: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB',
      borderRadius: 12,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? '#2D2D2D' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    commentInfo: {
      flex: 1,
    },
    commentUsername: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    commentTimestamp: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    commentContent: {
      fontSize: 14,
      lineHeight: 20,
      color: isDark ? '#F9FAFB' : '#111827',
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#2D2D2D' : '#E5E7EB',
      backgroundColor: isDark ? '#121212' : '#FFFFFF',
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: isDark ? '#2D2D2D' : '#E5E7EB',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: isDark ? '#F9FAFB' : '#111827',
      backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB',
      maxHeight: 100,
      marginRight: 8,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#6366F1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: isDark ? '#2D2D2D' : '#E5E7EB',
    },
  });
}