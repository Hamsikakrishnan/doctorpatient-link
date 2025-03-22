import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PatientCard from '../components/PatientCard';
import { useAuth } from '../context/AuthContext';
import { fetchPatientsByDoctor, fetchDoctorById, Patient, Doctor } from '../utils/api';
import { UserRound, Search, ClipboardList, FileText } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

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

        // Use the logged-in doctor's ID
        const doctorId = user.id;
        const [doctorInfo, patientsData] = await Promise.all([
          fetchDoctorById(doctorId),
          fetchPatientsByDoctor(doctorId),
        ]);
        
        if (doctorInfo) {
          setDoctorData(doctorInfo);
        }
        setPatients(patientsData);
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

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleNewPrescription = () => {
    setShowPrescriptionForm(true);
    toast({
      title: 'Feature coming soon',
      description: 'New prescription functionality will be available soon',
    });
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalHistory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-healthcare-50 flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-healthcare-800">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || doctorData?.name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="glass-card rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-healthcare-800">Your Patients</h2>
                <span className="text-xs bg-healthcare-100 text-healthcare-600 px-2 py-0.5 rounded-full">
                  {patients.length}
                </span>
              </div>
              
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent text-sm"
                />
              </div>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                      <div 
                        key={patient.id} 
                        onClick={() => setSelectedPatient(patient)}
                        className={`cursor-pointer transition-all ${
                          selectedPatient?.id === patient.id
                            ? 'ring-2 ring-healthcare-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <PatientCard patient={patient} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <UserRound className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No patients found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            {selectedPatient ? (
              <div className="glass-card rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-healthcare-100 flex items-center justify-center">
                    {selectedPatient.profileImage ? (
                      <img src={selectedPatient.profileImage} alt={selectedPatient.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="h-10 w-10 text-healthcare-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-healthcare-800">{selectedPatient.name}</h2>
                    <p className="text-gray-600">{selectedPatient.gender}, {selectedPatient.age} years</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p><span className="font-medium">Medical History:</span> {selectedPatient.medicalHistory}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-healthcare-800 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Medical Records
                  </h3>
                  <button
                    onClick={() => {
                      setShowPrescriptionForm(true);
                      toast({
                        title: 'Feature coming soon',
                        description: 'New prescription functionality will be available soon',
                      });
                    }}
                    className="bg-healthcare-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-healthcare-700 transition-colors flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    New Prescription
                  </button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="mb-1">No prescriptions yet</p>
                  <p className="text-sm text-gray-400">Create a new prescription to get started</p>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-lg flex items-center justify-center h-64">
                <div className="text-center p-6">
                  <UserRound className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xl font-medium text-gray-500">No patient selected</h3>
                  <p className="text-gray-400 mt-1">
                    Select a patient from the list to view their details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
