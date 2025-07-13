import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { Heart, MessageCircle, Share, CreditCard as Edit3, Trash2, User } from 'lucide-react-native';
import { formatDistanceToNow } from '@/utils/dateUtils';

interface ThoughtCardProps {
  thought: any;
  currentUserId: string;
  onUpdate: () => void;
  onEdit?: () => void;
  showEditDelete?: boolean;
}

export function ThoughtCard({
  thought,
  currentUserId,
  onUpdate,
  onEdit,
  showEditDelete = false,
}: ThoughtCardProps) {
  const colorScheme = useColorScheme();
  const [isLiked, setIsLiked] = useState(thought.isLiked || false);
  const [likeCount, setLikeCount] = useState(thought.likeCount || 0);

  const styles = createStyles(colorScheme);
  const isOwnThought = thought.userId === currentUserId;

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      // TODO: Implement actual like API call
      
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Thought',
      'Are you sure you want to delete this thought? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement delete API call
            onUpdate();
          },
        },
      ]
    );
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  const handleComment = () => {
    // TODO: Implement comment functionality
    Alert.alert('Comments', 'Comment functionality coming soon!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <User size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          </View>
          <View>
            <Text style={styles.username}>
              {thought.user?.displayName || 'Anonymous'}
            </Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(new Date(thought.createdAt))}
            </Text>
          </View>
        </View>
        
        {showEditDelete && isOwnThought && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Edit3 size={16} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.content}>{thought.content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, isLiked && styles.likedButton]}
          onPress={handleLike}
        >
          <Heart
            size={16}
            color={isLiked ? '#EF4444' : (colorScheme === 'dark' ? '#9CA3AF' : '#6B7280')}
            fill={isLiked ? '#EF4444' : 'transparent'}
          />
          <Text style={[styles.footerButtonText, isLiked && styles.likedText]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={handleComment}>
          <MessageCircle
            size={16}
            color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
          <Text style={styles.footerButtonText}>
            {thought.commentCount || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={handleShare}>
          <Share
            size={16}
            color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#374151' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 2,
    },
    timestamp: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
    content: {
      fontSize: 16,
      lineHeight: 24,
      color: isDark ? '#D1D5DB' : '#374151',
      marginBottom: 16,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    footerButtonText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    likedButton: {
      // No additional styling needed
    },
    likedText: {
      color: '#EF4444',
    },
  });
}