
import React from 'react';
import { UserRound, CalendarDays } from 'lucide-react';
import { Patient } from '../utils/api';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  return (
    <div 
      className="glass-card card-transition rounded-lg p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-healthcare-100 flex items-center justify-center">
          {patient.profileImage ? (
            <img src={patient.profileImage} alt={patient.name} className="h-full w-full object-cover" />
          ) : (
            <UserRound className="h-8 w-8 text-healthcare-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-healthcare-800">{patient.name}</h3>
          <p className="text-sm text-gray-600">{patient.gender}, {patient.age} years</p>
          <p className="text-xs mt-1 text-gray-500 line-clamp-1">
            <CalendarDays className="h-3 w-3 inline mr-1" />
            Medical History: {patient.medicalHistory}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
