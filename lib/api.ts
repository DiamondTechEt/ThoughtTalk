// Client-side API functions that make HTTP requests to our API routes

const API_BASE = '';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

export const authAPI = {
  signUp: async (email: string, password: string, displayName?: string) => {
    return apiRequest<{ user: any; token: string }>('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
  },

  signIn: async (email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>('/api/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  verify: async (token: string) => {
    return apiRequest<{ user: any }>('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

export const thoughtsAPI = {
  getAll: async () => {
    return apiRequest<any[]>('/api/thoughts');
  },

  getByUser: async (userId: string) => {
    return apiRequest<any[]>(`/api/thoughts?userId=${userId}`);
  },

  create: async (content: string, userId: string) => {
    return apiRequest<any>('/api/thoughts', {
      method: 'POST',
      body: JSON.stringify({ content, userId }),
    });
  },

  update: async (id: string, content: string) => {
    return apiRequest<any>(`/api/thoughts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean }>(`/api/thoughts/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id: string, userId: string) => {
    return apiRequest<{ success: boolean }>(`/api/thoughts/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  getComments: async (thoughtId: string) => {
    return apiRequest<any[]>(`/api/thoughts/${thoughtId}/comments`);
  },

  addComment: async (thoughtId: string, content: string, userId: string) => {
    return apiRequest<any>(`/api/thoughts/${thoughtId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, userId }),
    });
  },
};

export const usersAPI = {
  update: async (id: string, data: { displayName?: string; bio?: string }) => {
    return apiRequest<any>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};