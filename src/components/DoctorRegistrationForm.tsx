
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { toast } from '../hooks/use-toast';
import { X } from 'lucide-react';

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  specialty: z.string().min(2, { message: "Specialty is required" }),
});

interface DoctorRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const DoctorRegistrationForm: React.FC<DoctorRegistrationFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Generate username and password based on first name
    const firstName = data.name.split(' ')[0].toLowerCase();
    
    const doctorData = {
      ...data,
      username: firstName,
      password: firstName,
      profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
    };
    
    onSubmit(doctorData);
    form.reset();
    onClose();
    
    toast({
      title: "Doctor registered",
      description: `Dr. ${data.name} has been successfully added.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Register New Doctor
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <FormControl>
                    <Input placeholder="Cardiology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-3">
              <p className="text-sm text-muted-foreground mb-4">
                Username and password will automatically be generated based on the doctor's first name.
              </p>
            </div>
            
            <DialogFooter>
              <Button type="submit">Register Doctor</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorRegistrationForm;
