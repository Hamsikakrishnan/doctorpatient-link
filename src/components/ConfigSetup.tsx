
import React, { useState, useEffect } from 'react';
import { setConfigKey, getConfigKey, initializeConfig } from '../config/keys';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '../hooks/use-toast';
import { Cog } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ConfigSetupProps {
  onComplete?: () => void;
}

const configSchema = z.object({
  mongodbUri: z.string().min(1, "MongoDB URI is required"),
  geminiKey: z.string().min(1, "Gemini API Key is required")
});

const ConfigSetup: React.FC<ConfigSetupProps> = ({ onComplete }) => {
  const [open, setOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      mongodbUri: getConfigKey('MONGODB_URI') || '',
      geminiKey: getConfigKey('GEMINI_API_KEY') || '',
    },
  });

  useEffect(() => {
    initializeConfig();
    
    // Check if we already have configuration
    const hasMongodbUri = !!getConfigKey('MONGODB_URI');
    const hasGeminiKey = !!getConfigKey('GEMINI_API_KEY');
    
    form.reset({
      mongodbUri: getConfigKey('MONGODB_URI') || '',
      geminiKey: getConfigKey('GEMINI_API_KEY') || '',
    });
    
    setIsConfigured(hasMongodbUri && hasGeminiKey);
    
    // Open dialog if we're missing configuration
    if (!(hasMongodbUri && hasGeminiKey)) {
      setOpen(true);
    }
  }, [form]);

  const saveConfiguration = (data: z.infer<typeof configSchema>) => {
    setConfigKey('MONGODB_URI', data.mongodbUri);
    setConfigKey('GEMINI_API_KEY', data.geminiKey);
    
    setIsConfigured(true);
    setOpen(false);
    
    toast({
      title: "Configuration saved",
      description: "Your API keys have been saved successfully."
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>API Credentials Setup</DialogTitle>
            <DialogDescription>
              Enter your API keys to connect the healthcare system to your services.
              These credentials will be stored securely in your browser.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(saveConfiguration)} className="space-y-6">
              <FormField
                control={form.control}
                name="mongodbUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MongoDB URI</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="mongodb+srv://username:password@cluster.mongodb.net" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Connect to your MongoDB database for storing healthcare data.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="geminiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gemini API Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your Gemini API Key" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Used for AI-powered chat assistance and translations.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Save Configuration</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Button
        variant="outline"
        size="sm"
        className="fixed z-50 bottom-4 right-4 flex items-center gap-2 shadow-md"
        onClick={() => setOpen(true)}
      >
        <Cog className="h-4 w-4" />
        {isConfigured ? "Update API Keys" : "Configure API Keys"}
      </Button>
    </>
  );
};

export default ConfigSetup;
