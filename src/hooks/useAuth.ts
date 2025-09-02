interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Simplified auth hook for demo
export const useAuth = () => {
  return {
    user: {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user' as const
    },
    login: async (email: string, password: string) => true,
    logout: () => {},
    isLoading: false
  };
};