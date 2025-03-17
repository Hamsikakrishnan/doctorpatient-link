
// This file manages API keys and configuration
// In production, these should be managed through environment variables or a backend

interface ConfigKeys {
  MONGODB_URI?: string;
  GEMINI_API_KEY?: string;
}

// Initial empty config
let config: ConfigKeys = {};

// Function to set a key in the config and optionally persist it
export const setConfigKey = (key: keyof ConfigKeys, value: string, persist: boolean = true) => {
  config[key] = value;
  
  // Optionally store in localStorage (not recommended for production)
  if (persist) {
    try {
      const storedConfig = JSON.parse(localStorage.getItem('healthcareConfig') || '{}');
      localStorage.setItem('healthcareConfig', JSON.stringify({
        ...storedConfig,
        [key]: value
      }));
    } catch (error) {
      console.error('Failed to persist config:', error);
    }
  }
};

// Function to get a key from the config
export const getConfigKey = (key: keyof ConfigKeys): string | undefined => {
  return config[key];
};

// Load any stored config from localStorage on initialization
export const initializeConfig = (): void => {
  try {
    const storedConfig = localStorage.getItem('healthcareConfig');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      config = { ...config, ...parsedConfig };
    }
  } catch (error) {
    console.error('Failed to load config from localStorage:', error);
  }
};
