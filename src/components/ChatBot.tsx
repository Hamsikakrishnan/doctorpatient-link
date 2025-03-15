
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { getChatbotResponse } from '../utils/api';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: "Hello! I'm your healthcare assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsLoading(true);
    
    try {
      const botResponse = await getChatbotResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I'm having trouble connecting. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="glass-card rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-healthcare-600 text-white p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-medium">Healthcare Assistant</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-healthcare-100 text-healthcare-800'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === 'bot' ? (
                  <Bot className="h-4 w-4 text-healthcare-500" />
                ) : (
                  <User className="h-4 w-4 text-healthcare-500" />
                )}
                <span className="text-xs font-medium text-gray-500">
                  {message.sender === 'bot' ? 'Assistant' : 'You'}
                </span>
              </div>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm max-w-[75%] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-4 w-4 text-healthcare-500" />
                <span className="text-xs font-medium text-gray-500">Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-healthcare-300 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-healthcare-400 rounded-full animate-pulse delay-100"></div>
                <div className="h-2 w-2 bg-healthcare-500 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about diet, exercise, or medications..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-healthcare-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-healthcare-600 text-white p-2 rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
