import { useState, useEffect } from 'react';
import { thoughtsAPI } from '@/lib/api';

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
      const thoughtsData = await thoughtsAPI.getAll();
      setThoughts(thoughtsData);
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