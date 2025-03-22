
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { X, Plus, FileText, CalendarIcon } from 'lucide-react';
import { Patient } from '../utils/api';
import { toast } from '../hooks/use-toast';

// Schema for a medication in the prescription
const medicationSchema = z.object({
  name: z.string().min(1, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
});

// Schema for the entire prescription form
const formSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  medications: z.array(medicationSchema).min(1, { message: "At least one medication is required" }),
  notes: z.string().optional(),
});

// Initial medication state
const emptyMedication = {
  name: "",
  dosage: "",
  frequency: "",
};

interface PrescriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  patient: Patient;
}

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  patient
}) => {
  const [medications, setMedications] = React.useState([{ ...emptyMedication }]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      medications: [{ ...emptyMedication }],
      notes: "",
    },
  });

  // Add a new medication field
  const addMedication = () => {
    setMedications([...medications, { ...emptyMedication }]);
    const currentMedications = form.getValues("medications");
    form.setValue("medications", [...currentMedications, { ...emptyMedication }]);
  };

  // Remove a medication field
  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      const updatedMedications = [...medications];
      updatedMedications.splice(index, 1);
      setMedications(updatedMedications);
      
      const currentMedications = form.getValues("medications");
      const updatedFormMedications = [...currentMedications];
      updatedFormMedications.splice(index, 1);
      form.setValue("medications", updatedFormMedications);
    } else {
      toast({
        title: "Cannot remove",
        description: "At least one medication is required",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const prescriptionData = {
      ...data,
      patientId: patient.id,
      doctorId: patient.doctorId,
    };
    
    onSubmit(prescriptionData);
    form.reset();
    setMedications([{ ...emptyMedication }]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-healthcare-600" />
              New Prescription for {patient.name}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prescription Date</FormLabel>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="pl-10" 
                        {...field} 
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Medications</h3>
                <Button 
                  type="button" 
                  onClick={addMedication} 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Medication
                </Button>
              </div>
              
              {medications.map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Medication #{index + 1}</h4>
                    {medications.length > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => removeMedication(index)} 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`medications.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medication</FormLabel>
                          <FormControl>
                            <Input placeholder="Medication name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`medications.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10mg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`medications.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Twice daily" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional instructions or notes"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full sm:w-auto">Create Prescription</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionForm;
