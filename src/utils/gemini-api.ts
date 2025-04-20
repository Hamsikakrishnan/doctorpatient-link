
import { getConfigKey } from '../config/keys';
import { toast } from '../hooks/use-toast';

/**
 * Translates text using hardcoded responses 
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Simple mock translation with delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Very basic translations for demo purposes
  const translations: Record<string, Record<string, string>> = {
    "Take two tablets daily after meals": {
      "Spanish": "Tomar dos tabletas diariamente después de las comidas",
      "French": "Prenez deux comprimés par jour après les repas",
      "German": "Nehmen Sie zweimal täglich nach den Mahlzeiten",
    },
    "Take one capsule in the morning": {
      "Spanish": "Tomar una cápsula por la mañana",
      "French": "Prenez une gélule le matin",
      "German": "Nehmen Sie eine Kapsel am Morgen",
    }
  };

  // Check if we have a translation for this text and language
  if (translations[text]?.[targetLanguage]) {
    return translations[text][targetLanguage];
  }

  // If no translation is found, return a placeholder
  return `[Translated to ${targetLanguage}] ${text}`;
};

/**
 * Gets a chatbot response using hardcoded answers
 */
export const getChatbotResponse = async (message: string): Promise<string> => {
  // Add delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Convert message to lowercase for easier matching
  const query = message.toLowerCase();
  
  // Basic healthcare-related responses
  if (query.includes('headache') || query.includes('head pain')) {
    return "For headaches, try resting in a quiet, dark room, staying hydrated, and if needed, take over-the-counter pain relievers. If headaches persist or are severe, please consult your doctor.";
  } 
  
  if (query.includes('sleep') || query.includes('insomnia')) {
    return "To improve sleep: maintain a regular sleep schedule, avoid screens before bedtime, create a relaxing bedtime routine, and ensure your bedroom is dark and cool. If sleep problems persist, consult your healthcare provider.";
  }
  
  if (query.includes('diet') || query.includes('nutrition')) {
    return "A healthy diet should include plenty of fruits, vegetables, whole grains, and lean proteins. Limit processed foods, sugary drinks, and excessive salt. Consider consulting a nutritionist for personalized advice.";
  }
  
  if (query.includes('exercise') || query.includes('workout')) {
    return "Regular exercise is important for health. Aim for at least 150 minutes of moderate activity per week. Start slowly with walking, swimming, or cycling. Always check with your doctor before starting a new exercise program.";
  }
  
  if (query.includes('stress') || query.includes('anxiety')) {
    return "To manage stress, try deep breathing exercises, regular physical activity, meditation, or talking to friends and family. If stress significantly impacts your daily life, consider speaking with a mental health professional.";
  }
  
  if (query.includes('vitamin') || query.includes('supplement')) {
    return "While a balanced diet is best for getting nutrients, some people may need supplements. Always consult your healthcare provider before starting any supplements, as they can interact with medications.";
  }
  
  // Default response for unmatched queries
  return "I'm your healthcare assistant. I can provide general information about common health topics. For specific medical advice, please consult your healthcare provider. How can I help you today?";
};

