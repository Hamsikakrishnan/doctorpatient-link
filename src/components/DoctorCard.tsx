
import React from 'react';
import { Stethoscope, Users } from 'lucide-react';
import { Doctor } from '../utils/api';

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  return (
    <div 
      className="glass-card card-transition rounded-lg p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-healthcare-100 flex items-center justify-center">
          {doctor.profileImage ? (
            <img src={doctor.profileImage} alt={doctor.name} className="h-full w-full object-cover" />
          ) : (
            <Stethoscope className="h-8 w-8 text-healthcare-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg text-healthcare-800">{doctor.name}</h3>
          <p className="text-sm text-gray-600">{doctor.specialty}</p>
          <div className="flex items-center mt-1 text-sm text-healthcare-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{doctor.patients.length} Patients</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
