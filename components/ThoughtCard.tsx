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
import { prisma } from '@/lib/prisma';
import { CommentModal } from './CommentModal';
import { ShareModal } from './ShareModal';

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
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [commentCount, setCommentCount] = useState(thought.commentCount || 0);

  const styles = createStyles(colorScheme);
  const isOwnThought = thought.userId === currentUserId;

  const handleLike = async () => {
    if (!currentUserId) return;

    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      if (newIsLiked) {
        await prisma.like.create({
          data: {
            userId: currentUserId,
            thoughtId: thought.id,
          },
        });
      } else {
        await prisma.like.deleteMany({
          where: {
            userId: currentUserId,
            thoughtId: thought.id,
          },
        });
      }
      
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
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
            try {
              await prisma.thought.delete({
                where: { id: thought.id },
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete thought. Please try again.');
              console.error('Error deleting thought:', error);
              return;
            }
            onUpdate();
          },
        },
      ]
    );
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleCommentsClose = () => {
    setShowComments(false);
    // Refresh comment count
    refreshCommentCount();
  };

  const refreshCommentCount = async () => {
    try {
      const count = await prisma.comment.count({
        where: { thoughtId: thought.id },
      });
      setCommentCount(count);
    } catch (error) {
      console.error('Error refreshing comment count:', error);
    }
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
            color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'}
          />
          <Text style={styles.footerButtonText}>
            {commentCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={handleShare}>
          <Share
            size={16}
            color={colorScheme === 'dark' ? '#E5E7EB' : '#374151'}
          />
        </TouchableOpacity>
      </View>

      <CommentModal
        visible={showComments}
        thoughtId={thought.id}
        onClose={handleCommentsClose}
      />

      <ShareModal
        visible={showShare}
        thought={thought}
        onClose={() => setShowShare(false)}
      />
    </View>
  );
}

function createStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';
  
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
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
      backgroundColor: isDark ? '#2D2D2D' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
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
      color: isDark ? '#F9FAFB' : '#111827',
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