
// In a real application, this would interact with your MongoDB backend

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  profileImage?: string;
  patients: string[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  doctorId: string;
  profileImage?: string;
  medicalHistory: string;
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

// Mock data
const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
    patients: ["p1", "p2"]
  },
  {
    id: "d2",
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
    patients: ["p3"]
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
    medicalHistory: "Hypertension, Type 2 Diabetes"
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    age: 35,
    gender: "Female",
    doctorId: "d1",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    medicalHistory: "Asthma"
  },
  {
    id: "p3",
    name: "Robert Chen",
    age: 65,
    gender: "Male",
    doctorId: "d2",
    profileImage: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop",
    medicalHistory: "Stroke (2018), Migraines"
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

// API Functions
export const fetchDoctors = async (): Promise<Doctor[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return doctors;
};

export const fetchPatients = async (): Promise<Patient[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return patients;
};

export const createPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPatient: Patient = {
    id: `p${patients.length + 4}`, // Generate a new ID
    ...patientData
  };
  
  patients = [...patients, newPatient];
  
  // Update the doctor's patients array
  const doctorIndex = doctors.findIndex(doctor => doctor.id === patientData.doctorId);
  if (doctorIndex !== -1) {
    doctors[doctorIndex].patients.push(newPatient.id);
  }
  
  return newPatient;
};

export const fetchPatientsByDoctor = async (doctorId: string): Promise<Patient[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return patients.filter(patient => patient.doctorId === doctorId);
};

export const fetchPatientById = async (patientId: string): Promise<Patient | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return patients.find(patient => patient.id === patientId);
};

export const fetchDoctorById = async (doctorId: string): Promise<Doctor | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return doctors.find(doctor => doctor.id === doctorId);
};

export const fetchPrescriptionsByPatient = async (patientId: string): Promise<Prescription[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return prescriptions.filter(prescription => prescription.patientId === patientId);
};

export const fetchLabTestsByPatient = async (patientId: string): Promise<LabTest[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return labTests.filter(test => test.patientId === patientId);
};

// This would be a call to an LLM API in a real app
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is just a mock response - in a real app, this would call an actual
  // translation API or LLM model
  return `[Translated to ${targetLanguage}] ${text}`;
};

// Mock chatbot response
export const getChatbotResponse = async (message: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Very simple pattern matching for demo purposes
  if (message.toLowerCase().includes('diet')) {
    return "For a heart-healthy diet, focus on fruits, vegetables, whole grains, and lean proteins. Limit sodium, sugar, and saturated fats. Try to eat fish twice a week and choose foods high in fiber.";
  } else if (message.toLowerCase().includes('exercise')) {
    return "Regular physical activity is important. Aim for at least 150 minutes of moderate-intensity exercise per week. This could include brisk walking, swimming, or cycling. Always consult your doctor before starting a new exercise program.";
  } else if (message.toLowerCase().includes('medication') || message.toLowerCase().includes('medicine')) {
    return "Always take medications as prescribed by your doctor. Don't skip doses or stop taking a medication without consulting your healthcare provider first. Keep a list of all your medications with you.";
  } else {
    return "I'm your healthcare assistant. I can provide general information about diet, exercise, and medication. For specific medical advice, please consult your doctor.";
  }
};
