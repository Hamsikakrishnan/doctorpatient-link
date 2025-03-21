
import { getConfigKey } from '../config/keys';
import { toast } from '../hooks/use-toast';

/**
 * Translates text using the Gemini API
 * @param text The text to translate
 * @param targetLanguage The language to translate to
 * @returns Promise<string> The translated text
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const apiKey = getConfigKey('GEMINI_API_KEY');
  
  if (!apiKey) {
    console.error('Gemini API key is not configured');
    toast({
      title: "API Key Missing",
      description: "Please configure your Gemini API key in settings",
      variant: "destructive"
    });
    throw new Error('Gemini API key is not configured');
  }
  
  console.log(`Translating text to ${targetLanguage} using Gemini API`);
  
  try {
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
        ],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more deterministic outputs
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the translated text from Gemini's response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const translatedText = data.candidates[0].content.parts[0].text;
      // Clean up the response - sometimes Gemini includes quotes or prefixes
      return translatedText.replace(/^["']|["']$/g, '').replace(/^Translation: /i, '');
    }
    
    throw new Error('Invalid response format from Gemini API');
  } catch (error) {
    console.error('Error translating text:', error);
    
    // Fall back to a simple mock translation if API fails
    await new Promise(resolve => setTimeout(resolve, 500));
    return `[Translated to ${targetLanguage}] ${text}`;
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
    console.error('Gemini API key is not configured');
    toast({
      title: "API Key Missing",
      description: "Please configure your Gemini API key in settings",
      variant: "destructive"
    });
    throw new Error('Gemini API key is not configured');
  }
  
  console.log(`Getting chatbot response for message: "${message.substring(0, 50)}..."`);
  
  try {
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
                text: `You are a helpful healthcare assistant. You can provide general health information, but should clarify that you're not a doctor and can't provide specific medical advice. Respond concisely in a friendly, helpful tone.

User query: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the response text from Gemini's output
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response format from Gemini API');
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    
    // Fall back to simple pattern matching if API fails
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
};
