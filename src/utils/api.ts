// API module for interacting with MongoDB and other services
import { getConfigKey } from '../config/keys';
import { translateText, getChatbotResponse } from './gemini-api';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  profileImage?: string;
  patients: string[];
  username?: string;
  password?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  doctorId: string;
  profileImage?: string;
  medicalHistory: string;
  username?: string;
  password?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  notes: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  testName: string;
  date: string;
  results: string;
  normalRange?: string;
  status: 'normal' | 'abnormal' | 'pending';
}

// MongoDB collection names
const COLLECTIONS = {
  DOCTORS: 'doctors',
  PATIENTS: 'patients',
  PRESCRIPTIONS: 'prescriptions',
  LAB_TESTS: 'labTests'
};

// Cache for data to reduce API calls
let cachedDoctors: Doctor[] | null = null;
let cachedPatients: Patient[] | null = null;
let cachedPrescriptions: Prescription[] | null = null;
let cachedLabTests: LabTest[] | null = null;

// MongoDB connection helper
async function connectToMongoDB() {
  const mongodbUri = getConfigKey('MONGODB_URI');
  if (!mongodbUri) {
    throw new Error('MongoDB URI is not configured');
  }
  
  console.log('Attempting to connect to MongoDB...');
  
  try {
    // Instead of directly using MongoDB URI in fetch (which causes security errors),
    // we'll use a proxy approach or serverless function
    // For demo purposes, we'll create a URL that doesn't include credentials directly
    
    // Extract the database name from the MongoDB URI
    const dbNameMatch = mongodbUri.match(/\/([^/]+)(\?|$)/);
    const dbName = dbNameMatch ? dbNameMatch[1] : 'healthcare';
    
    // Use a serverless API endpoint format instead
    const apiEndpoint = 'https://healthcare-api-proxy.example.com/api/data';
    
    // We'll log that we're attempting to connect but actually use mock data for now
    console.log(`Would connect to database: ${dbName} (using mock data for demo)`);
    
    // In a real implementation, you would set up a backend proxy service or
    // serverless function to handle the MongoDB connection
    
    // For the healthcare app demo, we'll continue using the mock data
    return false; // Return false to use mock data
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Fall back to mock data
    console.log('Falling back to mock data');
    return false;
  }
}

// Initialize mock data (used as fallback if MongoDB is unavailable)
const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
    patients: ["p1", "p2"],
    username: "jane",
    password: "jane"
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
    patients: ["p3"],
    username: "michael",
    password: "michael"
  }
];

let patients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    age: 45,
    gender: "Male",
    doctorId: "d1",
    profileImage: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
    medicalHistory: "Hypertension, Type 2 Diabetes",
    username: "john",
    password: "john"
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    age: 35,
    gender: "Female",
    doctorId: "d1",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    medicalHistory: "Asthma",
    username: "sarah",
    password: "sarah"
  },
  {
    id: "p3",
    name: "Robert Chen",
    age: 65,
    gender: "Male",
    doctorId: "d2",
    profileImage: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop",
    medicalHistory: "Stroke (2018), Migraines",
    username: "robert",
    password: "robert"
  }
];

const prescriptions: Prescription[] = [
  {
    id: "rx1",
    patientId: "p1",
    doctorId: "d1",
    date: "2023-05-15",
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily with meals" }
    ],
    notes: "Continue with diet and exercise regimen. Monitor blood glucose levels."
  },
  {
    id: "rx2",
    patientId: "p1",
    doctorId: "d1",
    date: "2023-06-20",
    medications: [
      { name: "Lisinopril", dosage: "20mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily with meals" }
    ],
    notes: "Increased Lisinopril dosage due to consistently elevated blood pressure readings. Follow up in 4 weeks."
  }
];

const labTests: LabTest[] = [
  {
    id: "lab1",
    patientId: "p1",
    testName: "Comprehensive Metabolic Panel",
    date: "2023-05-10",
    results: "Glucose: 140 mg/dL, Potassium: 4.1 mEq/L, Sodium: 139 mEq/L",
    normalRange: "Glucose: 70-99 mg/dL, Potassium: 3.5-5.0 mEq/L, Sodium: 135-145 mEq/L",
    status: "abnormal"
  },
  {
    id: "lab2",
    patientId: "p1",
    testName: "Lipid Panel",
    date: "2023-05-10",
    results: "Total Cholesterol: 210 mg/dL, LDL: 130 mg/dL, HDL: 45 mg/dL, Triglycerides: 150 mg/dL",
    normalRange: "Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL, Triglycerides: <150 mg/dL",
    status: "abnormal"
  }
];

// API Functions with MongoDB integration
export const fetchDoctors = async (): Promise<Doctor[]> => {
  // If we have cached data, return it
  if (cachedDoctors) return cachedDoctors;
  
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data
      cachedDoctors = [...doctors];
      return cachedDoctors;
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/doctors`);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    
    const data = await response.json();
    cachedDoctors = data;
    return data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    // Fall back to mock data
    cachedDoctors = [...doctors];
    return cachedDoctors;
  }
};

export const fetchPatients = async (): Promise<Patient[]> => {
  // If we have cached data, return it
  if (cachedPatients) return cachedPatients;
  
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data
      cachedPatients = [...patients];
      return cachedPatients;
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/patients`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    
    const data = await response.json();
    cachedPatients = data;
    return data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Fall back to mock data
    cachedPatients = [...patients];
    return cachedPatients;
  }
};

export const createDoctor = async (doctorData: Omit<Doctor, 'id' | 'patients'>): Promise<Doctor> => {
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data approach
      // Generate a unique ID for the new doctor
      const newId = `d${doctors.length + Math.floor(Math.random() * 1000) + 1}`;
      
      const newDoctor: Doctor = {
        id: newId,
        ...doctorData,
        patients: [] // New doctors start with no patients
      };
      
      doctors.push(newDoctor);
      
      // Update cache
      cachedDoctors = null; // Invalidate cache
      
      return newDoctor;
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });
    
    if (!response.ok) throw new Error('Failed to create doctor');
    const newDoctor = await response.json();
    
    // Invalidate cache
    cachedDoctors = null;
    
    return newDoctor;
  } catch (error) {
    console.error('Error creating doctor:', error);
    
    // Fall back to mock data approach
    const newId = `d${doctors.length + Math.floor(Math.random() * 1000) + 1}`;
    
    const newDoctor: Doctor = {
      id: newId,
      ...doctorData,
      patients: []
    };
    
    doctors.push(newDoctor);
    
    // Invalidate cache
    cachedDoctors = null;
    
    return newDoctor;
  }
};

export const createPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Generate a unique ID for the new patient
      const newId = `p${patients.length + Math.floor(Math.random() * 1000) + 1}`;
      
      const newPatient: Patient = {
        id: newId,
        ...patientData
      };
      
      patients.push(newPatient);
      
      // Update the doctor's patients array
      const doctorIndex = doctors.findIndex(doctor => doctor.id === patientData.doctorId);
      if (doctorIndex !== -1) {
        doctors[doctorIndex].patients.push(newPatient.id);
      }
      
      // Invalidate cache
      cachedPatients = null;
      
      return newPatient;
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) throw new Error('Failed to create patient');
    const newPatient = await response.json();
    
    // Invalidate cache
    cachedPatients = null;
    cachedDoctors = null; // Doctor's patients array has changed
    
    return newPatient;
  } catch (error) {
    console.error('Error creating patient:', error);
    
    // Fall back to mock data approach
    const newId = `p${patients.length + Math.floor(Math.random() * 1000) + 1}`;
    
    const newPatient: Patient = {
      id: newId,
      ...patientData
    };
    
    patients.push(newPatient);
    
    // Update the doctor's patients array
    const doctorIndex = doctors.findIndex(doctor => doctor.id === patientData.doctorId);
    if (doctorIndex !== -1) {
      doctors[doctorIndex].patients.push(newPatient.id);
    }
    
    // Invalidate cache
    cachedPatients = null;
    
    return newPatient;
  }
};

export const fetchPatientsByDoctor = async (doctorId: string): Promise<Patient[]> => {
  try {
    // Try to use the main patients list if it's already cached
    if (cachedPatients) {
      return cachedPatients.filter(patient => patient.doctorId === doctorId);
    }
    
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data
      return patients.filter(patient => patient.doctorId === doctorId);
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/doctors/${doctorId}/patients`);
    if (!response.ok) throw new Error('Failed to fetch patients by doctor');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching patients by doctor:', error);
    // Fall back to mock data
    return patients.filter(patient => patient.doctorId === doctorId);
  }
};

export const fetchPatientById = async (patientId: string): Promise<Patient | undefined> => {
  try {
    // Try to use the cache first
    if (cachedPatients) {
      return cachedPatients.find(patient => patient.id === patientId);
    }
    
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data
      return patients.find(patient => patient.id === patientId);
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/patients/${patientId}`);
    if (!response.ok) throw new Error('Failed to fetch patient');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    // Fall back to mock data
    return patients.find(patient => patient.id === patientId);
  }
};

export const fetchDoctorById = async (doctorId: string): Promise<Doctor | undefined> => {
  try {
    // Try to use the cache first
    if (cachedDoctors) {
      return cachedDoctors.find(doctor => doctor.id === doctorId);
    }
    
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data
      return doctors.find(doctor => doctor.id === doctorId);
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/doctors/${doctorId}`);
    if (!response.ok) throw new Error('Failed to fetch doctor');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    // Fall back to mock data
    return doctors.find(doctor => doctor.id === doctorId);
  }
};

export const fetchPrescriptionsByPatient = async (patientId: string): Promise<Prescription[]> => {
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data
      return prescriptions.filter(prescription => prescription.patientId === patientId);
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/patients/${patientId}/prescriptions`);
    if (!response.ok) throw new Error('Failed to fetch prescriptions');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    // Fall back to mock data
    return prescriptions.filter(prescription => prescription.patientId === patientId);
  }
};

export const fetchLabTestsByPatient = async (patientId: string): Promise<LabTest[]> => {
  try {
    const isConnected = await connectToMongoDB();
    if (!isConnected) {
      // Fall back to mock data
      return labTests.filter(test => test.patientId === patientId);
    }
    
    const mongodbUri = getConfigKey('MONGODB_URI');
    const response = await fetch(`${mongodbUri}/api/patients/${patientId}/labtests`);
    if (!response.ok) throw new Error('Failed to fetch lab tests');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lab tests:', error);
    // Fall back to mock data
    return labTests.filter(test => test.patientId === patientId);
  }
};

// Add a new function to validate API credentials
export const validateApiCredentials = async (): Promise<{ valid: boolean; missing: string[] }> => {
  const result = { valid: false, missing: [] as string[] };
  
  const mongodbUri = getConfigKey('MONGODB_URI');
  const geminiKey = getConfigKey('GEMINI_API_KEY');
  
  if (!mongodbUri) result.missing.push('MongoDB URI');
  if (!geminiKey) result.missing.push('Gemini API Key');
  
  result.valid = result.missing.length === 0;
  
  return result;
};

// Export Gemini functions
export { translateText, getChatbotResponse } from './gemini-api';
