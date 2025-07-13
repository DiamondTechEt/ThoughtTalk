import { useState, useEffect } from 'react';

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

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshThoughts = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockThoughts: Thought[] = [
        {
          id: '1',
          content: 'Just launched my first React Native app! The learning curve was steep but totally worth it. Expo made the development process so much smoother.',
          userId: '2',
          user: {
            displayName: 'Sarah Chen',
            email: 'sarah@example.com',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          likeCount: 12,
          commentCount: 3,
          isLiked: false,
        },
        {
          id: '2',
          content: 'The best code is written when you understand the problem deeply, not when you know all the syntax.',
          userId: '3',
          user: {
            displayName: 'Alex Rodriguez',
            email: 'alex@example.com',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          likeCount: 8,
          commentCount: 1,
          isLiked: true,
        },
        {
          id: '3',
          content: 'Working remotely has taught me that communication is just as important as technical skills. Clear, concise updates make all the difference.',
          userId: '4',
          user: {
            displayName: 'Jamie Park',
            email: 'jamie@example.com',
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          likeCount: 15,
          commentCount: 7,
          isLiked: false,
        },
      ];
      
      setThoughts(mockThoughts);
    } catch (error) {
      console.error('Failed to fetch thoughts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshThoughts();
  }, []);

  return {
    thoughts,
    loading,
    refreshThoughts,
  };
}