
import { getConfigKey } from '../config/keys';

/**
 * Translates text using the Gemini API
 * @param text The text to translate
 * @param targetLanguage The language to translate to
 * @returns Promise<string> The translated text
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const apiKey = getConfigKey('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }
  
  try {
    // For demo purposes, using a mock response if no API key is available
    // In a real app, you would make an actual API call to Gemini
    if (apiKey === 'demo') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `[Translated to ${targetLanguage}] ${text}`;
    }
    
    // When API key is configured, make an actual call to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate the following text to ${targetLanguage}: "${text}"`
              }
            ]
          }
        ]
      })
    });
    
    const data = await response.json();
    
    // Handle Gemini API response format
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};

/**
 * Gets a chatbot response from Gemini API
 * @param message User's message
 * @returns Promise<string> The chatbot response
 */
export const getChatbotResponse = async (message: string): Promise<string> => {
  const apiKey = getConfigKey('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }
  
  try {
    // For demo purposes, using fallbacks if no API key is available
    if (apiKey === 'demo' || !apiKey) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Very simple pattern matching for demo purposes
      if (message.toLowerCase().includes('diet')) {
        return "For a heart-healthy diet, focus on fruits, vegetables, whole grains, and lean proteins. Limit sodium, sugar, and saturated fats. Try to eat fish twice a week and choose foods high in fiber.";
      } else if (message.toLowerCase().includes('exercise')) {
        return "Regular physical activity is important. Aim for at least 150 minutes of moderate-intensity exercise per week. This could include brisk walking, swimming, or cycling. Always consult your doctor before starting a new exercise program.";
      } else if (message.toLowerCase().includes('medication') || message.toLowerCase().includes('medicine')) {
        return "Always take medications as prescribed by your doctor. Don't skip doses or stop taking a medication without consulting your healthcare provider first. Keep a list of all your medications with you.";
      } else {
        return "I'm your healthcare assistant. I can provide general information about diet, exercise, and medication. For specific medical advice, please consult your doctor.";
      }
    }
    
    // When API key is configured, make an actual call to Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful healthcare assistant. You can provide general health information, but should clarify that you're not a doctor and can't provide specific medical advice. The user query is: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });
    
    const data = await response.json();
    
    // Handle Gemini API response format
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    throw error;
  }
};
