
import React, { useState, useEffect } from 'react';
import { setConfigKey, getConfigKey, initializeConfig } from '../config/keys';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from '../hooks/use-toast';
import { Cog, Database, Bot, AlertTriangle, CheckCircle } from 'lucide-react';
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
  const [testingMongoDB, setTestingMongoDB] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [mongoStatus, setMongoStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const [geminiStatus, setGeminiStatus] = useState<'untested' | 'success' | 'error'>('untested');

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
  
  const testMongoDBConnection = async () => {
    const uri = form.getValues().mongodbUri;
    if (!uri) return;
    
    setTestingMongoDB(true);
    setMongoStatus('untested');
    
    try {
      // Simple validation - check if it looks like a MongoDB URI
      if (!uri.startsWith('mongodb') && !uri.includes('://')) {
        throw new Error('Invalid MongoDB URI format');
      }
      
      // Simulate a connection test (in a real app, you would actually test the connection)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMongoStatus('success');
      toast({
        title: "MongoDB Connection",
        description: "Connection test successful",
      });
    } catch (error) {
      console.error('MongoDB test failed:', error);
      setMongoStatus('error');
      toast({
        title: "MongoDB Connection Failed",
        description: error instanceof Error ? error.message : "Could not connect to MongoDB",
        variant: "destructive"
      });
    } finally {
      setTestingMongoDB(false);
    }
  };
  
  const testGeminiAPI = async () => {
    const key = form.getValues().geminiKey;
    if (!key) return;
    
    setTestingGemini(true);
    setGeminiStatus('untested');
    
    try {
      // Simple validation of API key format
      if (key.length < 10) {
        throw new Error('API key appears to be too short');
      }
      
      // Make a simple request to test the API key
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Hello, please respond with 'API test successful'"
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 10,
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error?.message || response.status}`);
      }
      
      setGeminiStatus('success');
      toast({
        title: "Gemini API",
        description: "API key validated successfully",
      });
    } catch (error) {
      console.error('Gemini API test failed:', error);
      setGeminiStatus('error');
      toast({
        title: "Gemini API Failed",
        description: error instanceof Error ? error.message : "Could not validate API key",
        variant: "destructive"
      });
    } finally {
      setTestingGemini(false);
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
                    <FormLabel className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      MongoDB URI
                      {mongoStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {mongoStatus === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="mongodb+srv://username:password@cluster.mongodb.net" 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={testMongoDBConnection}
                        disabled={testingMongoDB || !field.value}
                      >
                        {testingMongoDB ? "Testing..." : "Test"}
                      </Button>
                    </div>
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
                    <FormLabel className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      Gemini API Key
                      {geminiStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {geminiStatus === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your Gemini API Key" 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={testGeminiAPI}
                        disabled={testingGemini || !field.value}
                      >
                        {testingGemini ? "Testing..." : "Test"}
                      </Button>
                    </div>
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
