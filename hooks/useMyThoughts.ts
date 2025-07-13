import { useState, useEffect } from 'react';
import { prisma } from '@/lib/prisma';

interface Thought {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export function useMyThoughts(userId?: string) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshThoughts = async () => {
    if (!userId) {
      setThoughts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const thoughtsData = await prisma.thought.findMany({
        where: {
          userId: userId,
        },
        include: {
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
        createdAt: thought.createdAt.toISOString(),
        likeCount: thought._count.likes,
        commentCount: thought._count.comments,
      }));
      
      setThoughts(formattedThoughts);
    } catch (error) {
      console.error('Failed to fetch my thoughts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshThoughts();
  }, [userId]);

  return {
    thoughts,
    loading,
    refreshThoughts,
  };
}