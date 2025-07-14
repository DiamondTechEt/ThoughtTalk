import { useState, useEffect } from 'react';
import { thoughtsAPI } from '@/lib/api';

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
      const thoughtsData = await thoughtsAPI.getByUser(userId);
      setThoughts(thoughtsData);
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