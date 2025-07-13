import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';

interface Thought {
  id: string;
  content: string;
  userId: string;
  user: {
    displayName: string;
    email: string;
  };
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export function useThoughts(currentUserId?: string) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshThoughts = async () => {
    try {
      setLoading(true);
      const thoughtsData = await prisma.thought.findMany({
        include: {
          user: {
            select: {
              displayName: true,
              email: true,
            },
          },
          likes: currentUserId ? {
            where: { userId: currentUserId },
            select: { id: true },
          } : false,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      const formattedThoughts: Thought[] = thoughtsData.map(thought => ({
        id: thought.id,
        content: thought.content,
        userId: thought.userId,
        user: {
          displayName: thought.user.displayName || 'Anonymous',
          email: thought.user.email,
        },
        createdAt: thought.createdAt.toISOString(),
        likeCount: thought._count.likes,
        commentCount: thought._count.comments,
        isLiked: currentUserId ? thought.likes.length > 0 : false,
      }));
      
      setThoughts(formattedThoughts);
    } catch (error) {
      console.error('Failed to fetch thoughts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshThoughts();
  }, [currentUserId]);

  return {
    thoughts,
    loading,
    refreshThoughts,
  };
}