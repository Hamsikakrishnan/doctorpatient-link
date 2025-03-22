
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PrescriptionCard from '../components/PrescriptionCard';
import LabResultCard from '../components/LabResultCard';
import ChatBot from '../components/ChatBot';
import { useAuth } from '../context/AuthContext';
import { fetchPrescriptionsByPatient, fetchLabTestsByPatient, fetchPatientById, Patient, Prescription, LabTest } from '../utils/api';
import { UserRound, FileText, FlaskConical, MessageSquare } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'labTests' | 'chatbot'>('prescriptions');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (!user || !user.id) {
          toast({
            title: 'Error',
            description: 'User information not found. Please log in again.',
            variant: 'destructive',
          });
          return;
        }

        // Use the logged-in patient's ID
        const patientId = user.id;
        const [patientData, prescriptionsData, labTestsData] = await Promise.all([
          fetchPatientById(patientId),
          fetchPrescriptionsByPatient(patientId),
          fetchLabTestsByPatient(patientId),
        ]);
        
        if (patientData) {
          setPatient(patientData);
        }
        setPrescriptions(prescriptionsData);
        setLabTests(labTestsData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-healthcare-50 flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-healthcare-800">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || patient?.name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="glass-card rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-healthcare-100 flex items-center justify-center mb-4">
                  {patient?.profileImage || user?.profileImage ? (
                    <img 
                      src={patient?.profileImage || user?.profileImage} 
                      alt={patient?.name || user?.name || "Profile"} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <UserRound className="h-10 w-10 text-healthcare-500" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-healthcare-800">{patient?.name || user?.name}</h2>
                <p className="text-gray-600">{patient?.gender}, {patient?.age} years</p>
                
                <div className="w-full mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Doctor:</span>{' '}
                      <span className="text-healthcare-700">{patient?.doctorName || "Dr. Jane Smith"}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-600">Medical History:</span>{' '}
                      <span className="text-gray-700">{patient?.medicalHistory || "No medical history recorded"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium flex justify-center items-center gap-2 ${
                    activeTab === 'prescriptions'
                      ? 'text-healthcare-600 border-b-2 border-healthcare-500'
                      : 'text-gray-500 hover:text-healthcare-600'
                  }`}
                  onClick={() => setActiveTab('prescriptions')}
                >
                  <FileText className="h-4 w-4" />
                  Prescriptions
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium flex justify-center items-center gap-2 ${
                    activeTab === 'labTests'
                      ? 'text-healthcare-600 border-b-2 border-healthcare-500'
                      : 'text-gray-500 hover:text-healthcare-600'
                  }`}
                  onClick={() => setActiveTab('labTests')}
                >
                  <FlaskConical className="h-4 w-4" />
                  Lab Tests
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium flex justify-center items-center gap-2 ${
                    activeTab === 'chatbot'
                      ? 'text-healthcare-600 border-b-2 border-healthcare-500'
                      : 'text-gray-500 hover:text-healthcare-600'
                  }`}
                  onClick={() => setActiveTab('chatbot')}
                >
                  <MessageSquare className="h-4 w-4" />
                  AI Assistant
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-100 rounded-lg mb-4"></div>
                <div className="h-64 bg-gray-100 rounded-lg"></div>
              </div>
            ) : (
              <>
                {activeTab === 'prescriptions' && (
                  <div className="space-y-4">
                    {prescriptions.length > 0 ? (
                      prescriptions.map(prescription => (
                        <PrescriptionCard key={prescription.id} prescription={prescription} />
                      ))
                    ) : (
                      <div className="glass-card rounded-lg flex items-center justify-center h-64">
                        <div className="text-center p-6">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-500">No prescriptions yet</h3>
                          <p className="text-gray-400 mt-1">
                            Your prescriptions will appear here when your doctor creates them
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'labTests' && (
                  <div className="space-y-4">
                    {labTests.length > 0 ? (
                      labTests.map(labTest => (
                        <LabResultCard key={labTest.id} labTest={labTest} />
                      ))
                    ) : (
                      <div className="glass-card rounded-lg flex items-center justify-center h-64">
                        <div className="text-center p-6">
                          <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-lg font-medium text-gray-500">No lab tests yet</h3>
                          <p className="text-gray-400 mt-1">
                            Your lab test results will appear here when they are ready
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'chatbot' && (
                  <div className="h-[calc(100vh-240px)]">
                    <ChatBot />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
