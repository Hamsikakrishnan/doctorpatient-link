
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfigKey } from '../config/keys';
import { toast } from '../hooks/use-toast';

type UserRole = 'hospital' | 'doctor' | 'patient';

type User = {
  id: string;
  name: string;
  role: UserRole;
  profileImage?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem('healthcareUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function with optional API keys check
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check if API keys are configured - but make them optional
      const mongodbUri = getConfigKey('MONGODB_URI');
      const geminiKey = getConfigKey('GEMINI_API_KEY');
      
      // Display a warning toast but don't block login if keys are missing
      if (!mongodbUri || !geminiKey) {
        toast({
          title: "Note: API Keys Missing",
          description: "Some features may be limited. Configure API keys in settings.",
          variant: "default"
        });
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login logic (would be replaced with actual API calls)
      let mockUser: User | null = null;
      
      // This is just for development/demo purposes
      if (username === 'hospital' && password === 'password') {
        mockUser = { id: '1', name: 'City Hospital Admin', role: 'hospital' };
        navigate('/hospital-dashboard');
      } else if (username === 'doctor' && password === 'password' || 
                (username === 'jane' && password === 'jane') || 
                (username === 'michael' && password === 'michael')) {
        mockUser = { id: '2', name: 'Dr. Jane Smith', role: 'doctor' };
        navigate('/doctor-dashboard');
      } else if (username === 'patient' && password === 'password' || 
                (username === 'john' && password === 'john')) {
        mockUser = { id: '3', name: 'John Doe', role: 'patient' };
        navigate('/patient-dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
      
      setUser(mockUser);
      localStorage.setItem('healthcareUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthcareUser');
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
