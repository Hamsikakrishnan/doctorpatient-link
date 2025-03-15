import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DoctorCard from '../components/DoctorCard';
import PatientCard from '../components/PatientCard';
import { useAuth } from '../context/AuthContext';
import { fetchDoctors, fetchPatients, Doctor, Patient } from '../utils/api';
import { Users, UserRound, Plus, Search, Stethoscope } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const HospitalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'doctors' | 'patients'>('doctors');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [doctorsData, patientsData] = await Promise.all([
          fetchDoctors(),
          fetchPatients(),
        ]);
        setDoctors(doctorsData);
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
  }, []);

  const handleCreateNew = () => {
    toast({
      title: 'Feature coming soon',
      description: `Create new ${activeTab === 'doctors' ? 'doctor' : 'patient'} functionality will be available soon`,
    });
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalHistory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-healthcare-50 flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-healthcare-800">Hospital Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'doctors'
                  ? 'bg-white text-healthcare-600 shadow-sm'
                  : 'text-gray-500 hover:text-healthcare-600'
              }`}
              onClick={() => setActiveTab('doctors')}
            >
              <Stethoscope className="h-4 w-4" />
              <span className="font-medium">Doctors</span>
              <span className="ml-1 text-xs bg-healthcare-100 text-healthcare-600 px-2 py-0.5 rounded-full">
                {doctors.length}
              </span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === 'patients'
                  ? 'bg-white text-healthcare-600 shadow-sm'
                  : 'text-gray-500 hover:text-healthcare-600'
              }`}
              onClick={() => setActiveTab('patients')}
            >
              <UserRound className="h-4 w-4" />
              <span className="font-medium">Patients</span>
              <span className="ml-1 text-xs bg-healthcare-100 text-healthcare-600 px-2 py-0.5 rounded-full">
                {patients.length}
              </span>
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-healthcare-600 text-white px-4 py-2 rounded-md hover:bg-healthcare-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create {activeTab === 'doctors' ? 'Doctor' : 'Patient'}</span>
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="h-10 w-10 bg-healthcare-200 rounded-full"></div>
              <div className="h-4 w-24 bg-healthcare-100 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTab === 'doctors' ? (
              filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-500">No doctors found</h3>
                  <p className="text-gray-400 mt-1">
                    {searchTerm ? 'Try a different search term' : 'Add a doctor to get started'}
                  </p>
                </div>
              )
            ) : (
              filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <UserRound className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-500">No patients found</h3>
                  <p className="text-gray-400 mt-1">
                    {searchTerm ? 'Try a different search term' : 'Add a patient to get started'}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HospitalDashboard;
