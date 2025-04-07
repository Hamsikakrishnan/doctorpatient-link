
import { getConfigKey } from '../config/keys';
import { toast } from '../hooks/use-toast';

/**
 * Translates text using OpenAI or Gemini API
 * @param text The text to translate
 * @param targetLanguage The language to translate to
 * @returns Promise<string> The translated text
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Try to use OpenAI API if available, otherwise fallback to Gemini
  const openaiApiKey = getConfigKey('OPENAI_API_KEY');
  const geminiApiKey = getConfigKey('GEMINI_API_KEY');
  
  if (openaiApiKey) {
    return translateWithOpenAI(text, targetLanguage, openaiApiKey);
  } else if (geminiApiKey) {
    return translateWithGemini(text, targetLanguage, geminiApiKey);
  } else {
    console.error('No API key is configured for translation');
    toast({
      title: "API Key Missing",
      description: "Please configure an OpenAI or Gemini API key in settings",
      variant: "destructive"
    });
    throw new Error('No API key is configured for translation');
  }
};

/**
 * Translates text using OpenAI API
 */
const translateWithOpenAI = async (text: string, targetLanguage: string, apiKey: string): Promise<string> => {
  console.log(`Translating text to ${targetLanguage} using OpenAI API`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Using the more affordable GPT-3.5 model
        messages: [
          {
            role: "system",
            content: `You are a translator. Translate the text to ${targetLanguage}. Only respond with the translated text, nothing else.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }
    
    throw new Error('Invalid response format from OpenAI API');
  } catch (error) {
    console.error('Error translating text with OpenAI:', error);
    // Fall back to mock translation
    return fallbackTranslation(text, targetLanguage);
  }
};

/**
 * Translates text using Gemini API
 */
const translateWithGemini = async (text: string, targetLanguage: string, apiKey: string): Promise<string> => {
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
          temperature: 0.2,
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
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const translatedText = data.candidates[0].content.parts[0].text;
      return translatedText.replace(/^["']|["']$/g, '').replace(/^Translation: /i, '');
    }
    
    throw new Error('Invalid response format from Gemini API');
  } catch (error) {
    console.error('Error translating text with Gemini:', error);
    return fallbackTranslation(text, targetLanguage);
  }
};

/**
 * Fallback translation function
 */
const fallbackTranslation = async (text: string, targetLanguage: string): Promise<string> => {
  // Simple mock translation
  await new Promise(resolve => setTimeout(resolve, 500));
  return `[Translated to ${targetLanguage}] ${text}`;
};

/**
 * Gets a chatbot response from an AI API
 * @param message User's message
 * @returns Promise<string> The chatbot response
 */
export const getChatbotResponse = async (message: string): Promise<string> => {
  // Try to use OpenAI API if available, otherwise fallback to Gemini
  const openaiApiKey = getConfigKey('OPENAI_API_KEY');
  const geminiApiKey = getConfigKey('GEMINI_API_KEY');
  
  if (openaiApiKey) {
    return getChatbotResponseFromOpenAI(message, openaiApiKey);
  } else if (geminiApiKey) {
    return getChatbotResponseFromGemini(message, geminiApiKey);
  } else {
    console.error('No API key is configured for chatbot');
    toast({
      title: "API Key Missing",
      description: "Please configure an OpenAI or Gemini API key in settings",
      variant: "destructive"
    });
    return getChatbotResponseFallback(message);
  }
};

/**
 * Gets a chatbot response from OpenAI
 */
const getChatbotResponseFromOpenAI = async (message: string, apiKey: string): Promise<string> => {
  console.log(`Getting chatbot response from OpenAI for message: "${message.substring(0, 50)}..."`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Using the more affordable GPT-3.5 model
        messages: [
          {
            role: "system",
            content: "You are a helpful healthcare assistant. You can provide general health information, but should clarify that you're not a doctor and can't provide specific medical advice. Respond concisely in a friendly, helpful tone."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }
    
    throw new Error('Invalid response format from OpenAI API');
  } catch (error) {
    console.error('Error getting chatbot response from OpenAI:', error);
    return getChatbotResponseFallback(message);
  }
};

/**
 * Gets a chatbot response from Gemini
 */
const getChatbotResponseFromGemini = async (message: string, apiKey: string): Promise<string> => {
  console.log(`Getting chatbot response from Gemini for message: "${message.substring(0, 50)}..."`);
  
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
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response format from Gemini API');
  } catch (error) {
    console.error('Error getting chatbot response from Gemini:', error);
    return getChatbotResponseFallback(message);
  }
};

/**
 * Fallback chatbot response when APIs fail
 */
const getChatbotResponseFallback = async (message: string): Promise<string> => {
  // Simulate API delay
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
};
