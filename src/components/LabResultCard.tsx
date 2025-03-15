
import React from 'react';
import { FlaskConical, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { LabTest } from '../utils/api';

interface LabResultCardProps {
  labTest: LabTest;
}

const LabResultCard: React.FC<LabResultCardProps> = ({ labTest }) => {
  const formattedDate = new Date(labTest.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusIcon = () => {
    switch(labTest.status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'abnormal':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch(labTest.status) {
      case 'normal':
        return 'Normal';
      case 'abnormal':
        return 'Abnormal';
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch(labTest.status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'abnormal':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return '';
    }
  };

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="bg-healthcare-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            <h3 className="font-medium">{labTest.testName}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-500">Results</h4>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            {getStatusText()}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-700 whitespace-pre-line">{labTest.results}</p>
          </div>
          
          {labTest.normalRange && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="text-xs font-medium text-gray-500 mb-1">Normal Range</h5>
              <p className="text-xs text-gray-600 whitespace-pre-line">{labTest.normalRange}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabResultCard;
