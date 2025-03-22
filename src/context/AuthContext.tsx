import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfigKey } from '../config/keys';
import { toast } from '../hooks/use-toast';
import { fetchDoctors, fetchPatients } from '../utils/api';

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
      
      // First try to match against the static admin credentials
      let mockUser: User | null = null;
      
      if (username === 'hospital' && password === 'password') {
        mockUser = { id: '1', name: 'City Hospital Admin', role: 'hospital' };
        setUser(mockUser);
        localStorage.setItem('healthcareUser', JSON.stringify(mockUser));
        navigate('/hospital-dashboard');
        return;
      }
      
      // If not admin, check doctors and patients from the API
      const doctors = await fetchDoctors();
      const patients = await fetchPatients();
      
      // Check if the credentials match any doctor
      const matchedDoctor = doctors.find(
        doctor => doctor.username?.toLowerCase() === username.toLowerCase() && 
                  doctor.password === password
      );
      
      if (matchedDoctor) {
        mockUser = { 
          id: matchedDoctor.id, 
          name: matchedDoctor.name, 
          role: 'doctor',
          profileImage: matchedDoctor.profileImage 
        };
        setUser(mockUser);
        localStorage.setItem('healthcareUser', JSON.stringify(mockUser));
        navigate('/doctor-dashboard');
        return;
      }
      
      // Check if the credentials match any patient
      const matchedPatient = patients.find(
        patient => patient.username?.toLowerCase() === username.toLowerCase() && 
                   patient.password === password
      );
      
      if (matchedPatient) {
        mockUser = { 
          id: matchedPatient.id, 
          name: matchedPatient.name, 
          role: 'patient',
          profileImage: matchedPatient.profileImage 
        };
        setUser(mockUser);
        localStorage.setItem('healthcareUser', JSON.stringify(mockUser));
        navigate('/patient-dashboard');
        return;
      }
      
      // For backward compatibility, keep the old static user checks
      if (username === 'doctor' && password === 'password' || 
          (username === 'jane' && password === 'jane') || 
          (username === 'michael' && password === 'michael')) {
        mockUser = { id: '2', name: 'Dr. Jane Smith', role: 'doctor' };
        setUser(mockUser);
        localStorage.setItem('healthcareUser', JSON.stringify(mockUser));
        navigate('/doctor-dashboard');
        return;
      } else if (username === 'patient' && password === 'password' || 
                (username === 'john' && password === 'john')) {
        mockUser = { id: '3', name: 'John Doe', role: 'patient' };
        setUser(mockUser);
        localStorage.setItem('healthcareUser', JSON.stringify(mockUser));
        navigate('/patient-dashboard');
        return;
      }
      
      // If we get here, no valid user was found
      throw new Error('Invalid credentials');
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
