
# Healthcare Dashboard

A comprehensive healthcare management application for patients and medical professionals.

## Features

- **Doctor Dashboard:** Manage patients, write prescriptions, and view medical records
- **Patient Dashboard:** View prescriptions, lab results, and communicate with healthcare providers
- **AI-Powered Assistant:** Healthcare chatbot to answer general health questions
- **Translation:** Translate medical information into different languages

## AI API Integration Options

This application can use the following AI API services for the chatbot and translation features:

1. **OpenAI API** (Recommended free tier option)
   - Free tier provides $5 of credit for new users
   - Offers GPT-3.5-Turbo which is suitable for most use cases
   - Sign up at: https://platform.openai.com/signup

2. **Google Gemini API**
   - Free tier available with generous limits
   - Sign up at: https://aistudio.google.com/

3. **Azure OpenAI Service**
   - Free tier with Azure subscription
   - Sign up at: https://azure.microsoft.com/en-us/products/ai-services/openai-service

4. **Hugging Face Inference API**
   - Free tier available with usage limits
   - Open-source models
   - Sign up at: https://huggingface.co/inference-api

## Configuration

To set up the application with an AI service:

1. Sign up for one of the AI services listed above
2. Get your API key
3. In the application settings, add your API key
4. Choose either OPENAI_API_KEY or GEMINI_API_KEY in the configuration

## Getting Started

1. Install dependencies: `npm install`
2. Run the application: `npm run dev`
3. Open browser at: `http://localhost:5173`
