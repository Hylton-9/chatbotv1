import React, { useState, useCallback } from 'react';
import { ChatMessage, MessageAuthor } from './types';
import { askWithHandbook } from './services/geminiService';  // renamed service
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = useCallback(async () => {
    const prompt = inputValue;
    if (!prompt.trim() || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    try {
      const aiResponseText = await askWithHandbook(prompt); // <-- no file
      const aiMessage: ChatMessage = { author: MessageAuthor.AI, text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      const aiErrorMessage: ChatMessage = { 
          author: MessageAuthor.AI, 
          text: `Sorry, something went wrong. ${errorMessage}`,
          isError: true,
      };
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, inputValue]);

  const handleSampleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  const hasChatStarted = messages.length > 0;

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto pr-4">
            {hasChatStarted ? <ChatWindow messages={messages} isLoading={isLoading} /> : <WelcomeScreen onSampleQuestionClick={handleSampleQuestionClick} />}
        </div>
        <div className="mt-4 md:mt-6 w-full max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            inputValue={inputValue}
            onInputChange={setInputValue}
          />
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;
