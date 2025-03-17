
import React, { useState, useEffect } from 'react';
import { setConfigKey, getConfigKey, initializeConfig } from '../config/keys';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '../hooks/use-toast';

interface ConfigSetupProps {
  onComplete?: () => void;
}

const ConfigSetup: React.FC<ConfigSetupProps> = ({ onComplete }) => {
  const [open, setOpen] = useState(false);
  const [mongodbUri, setMongodbUri] = useState(getConfigKey('MONGODB_URI') || '');
  const [geminiKey, setGeminiKey] = useState(getConfigKey('GEMINI_API_KEY') || '');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    initializeConfig();
    
    // Check if we already have configuration
    const hasMongodbUri = !!getConfigKey('MONGODB_URI');
    const hasGeminiKey = !!getConfigKey('GEMINI_API_KEY');
    
    setMongodbUri(getConfigKey('MONGODB_URI') || '');
    setGeminiKey(getConfigKey('GEMINI_API_KEY') || '');
    
    setIsConfigured(hasMongodbUri && hasGeminiKey);
    
    // Open dialog if we're missing configuration
    if (!(hasMongodbUri && hasGeminiKey)) {
      setOpen(true);
    }
  }, []);

  const saveConfiguration = () => {
    setConfigKey('MONGODB_URI', mongodbUri);
    setConfigKey('GEMINI_API_KEY', geminiKey);
    
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
            <DialogTitle>Healthcare System Configuration</DialogTitle>
            <DialogDescription>
              Enter your API keys and configuration values to connect the system to your services.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="mongodbUri">MongoDB URI</Label>
              <Input
                id="mongodbUri"
                value={mongodbUri}
                onChange={(e) => setMongodbUri(e.target.value)}
                placeholder="mongodb+srv://username:password@cluster.mongodb.net"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="geminiKey">Gemini API Key</Label>
              <Input
                id="geminiKey"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API Key"
                type="password"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={saveConfiguration}>Save Configuration</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {isConfigured && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4"
          onClick={() => setOpen(true)}
        >
          Configure API Keys
        </Button>
      )}
    </>
  );
};

export default ConfigSetup;
