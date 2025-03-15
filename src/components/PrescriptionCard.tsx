
import React, { useState } from 'react';
import { Calendar, FileText, MessageSquare, Languages } from 'lucide-react';
import { Prescription, translateText } from '../utils/api';
import { toast } from '../components/ui/toast';

interface PrescriptionCardProps {
  prescription: Prescription;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedNotes, setTranslatedNotes] = useState<string | null>(null);
  const [translationLanguage, setTranslationLanguage] = useState('Spanish');

  const handleTranslate = async () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateText(prescription.notes, translationLanguage);
      setTranslatedNotes(translated);
      toast({
        title: 'Translation complete',
        description: `Notes translated to ${translationLanguage}`,
      });
    } catch (error) {
      toast({
        title: 'Translation failed',
        description: 'Unable to translate notes',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const formattedDate = new Date(prescription.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="bg-healthcare-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h3 className="font-medium">Prescription</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Medications</h4>
          <ul className="space-y-2">
            {prescription.medications.map((med, index) => (
              <li key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="font-medium text-healthcare-800">{med.name}</div>
                <div className="text-sm text-gray-600">
                  {med.dosage} - {med.frequency}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-500 flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Doctor's Notes
            </h4>
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="flex items-center text-xs gap-1 text-healthcare-600 hover:text-healthcare-700 transition-colors"
            >
              <Languages className="h-3.5 w-3.5" />
              {isTranslating ? 'Translating...' : `Translate to ${translationLanguage}`}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-gray-700">{prescription.notes}</p>
            {translatedNotes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-healthcare-600 mb-1">{translationLanguage} Translation:</p>
                <p className="text-gray-700 italic">{translatedNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
