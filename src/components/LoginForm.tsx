
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/toast';
import { User, Lock, Hospital, Stethoscope, UserRound } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'hospital' | 'doctor' | 'patient'>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both username and password',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      // The redirect will be handled in the login function
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 glass-card rounded-xl animate-fade-in animate-slide-up">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-healthcare-800">Welcome to HealthLink</h2>
        <p className="text-gray-600 mt-1">Log in to access your healthcare dashboard</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              selectedRole === 'hospital'
                ? 'bg-white text-healthcare-600 shadow-sm'
                : 'text-gray-500 hover:text-healthcare-600'
            }`}
            onClick={() => setSelectedRole('hospital')}
            type="button"
          >
            <Hospital className="h-4 w-4" />
            <span className="text-sm font-medium">Hospital</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              selectedRole === 'doctor'
                ? 'bg-white text-healthcare-600 shadow-sm'
                : 'text-gray-500 hover:text-healthcare-600'
            }`}
            onClick={() => setSelectedRole('doctor')}
            type="button"
          >
            <Stethoscope className="h-4 w-4" />
            <span className="text-sm font-medium">Doctor</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              selectedRole === 'patient'
                ? 'bg-white text-healthcare-600 shadow-sm'
                : 'text-gray-500 hover:text-healthcare-600'
            }`}
            onClick={() => setSelectedRole('patient')}
            type="button"
          >
            <UserRound className="h-4 w-4" />
            <span className="text-sm font-medium">Patient</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`Enter your ${selectedRole} username`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-healthcare-600 text-white py-2 px-4 rounded-md hover:bg-healthcare-700 transition-colors focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          For demo purposes, use username: "{selectedRole}" and password: "password"
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
