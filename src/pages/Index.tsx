
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { Hospital, Stethoscope, UserRound, HeartPulse, MessageSquare, FileText } from 'lucide-react';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}-dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const features = [
    {
      icon: <Hospital className="h-6 w-6 text-healthcare-600" />,
      title: 'Hospital Management',
      description: 'Create and manage doctor and patient profiles, update records, and assign patients to doctors.',
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-healthcare-600" />,
      title: 'Doctor Dashboard',
      description: 'View patient information, create prescriptions, and add treatment notes.',
    },
    {
      icon: <UserRound className="h-6 w-6 text-healthcare-600" />,
      title: 'Patient Portal',
      description: 'Access prescriptions, lab results, and communicate with your healthcare providers.',
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-healthcare-600" />,
      title: 'Health Records',
      description: 'Store and access comprehensive medical records including lab tests and prescriptions.',
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-healthcare-600" />,
      title: 'AI Assistant',
      description: 'Get answers to common healthcare questions and basic guidance on diet and exercise.',
    },
    {
      icon: <FileText className="h-6 w-6 text-healthcare-600" />,
      title: 'Prescription Translation',
      description: 'Translate medical instructions and prescriptions with a single click.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-healthcare-50 page-transition">
      <div className="container px-4 py-12 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block">
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-1 bg-healthcare-100 text-healthcare-700 rounded-full mb-2">
                <HeartPulse className="h-4 w-4" />
                <span>Healthcare Management System</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-healthcare-900">
              Connect doctors and patients seamlessly
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              A comprehensive platform for hospitals, doctors, and patients with integrated AI assistance for better healthcare experiences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="glass-card p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium text-healthcare-800">{feature.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
