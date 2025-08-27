import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { SpeakerXMarkIcon } from './icons/SpeakerXMarkIcon';


const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;

    return () => {
      // Ensure speech stops if the component unmounts while speaking
      if (utterance) {
          window.speechSynthesis.cancel();
      }
    };
  }, [message.text]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      if (utteranceRef.current) {
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  };

  const isUser = message.author === MessageAuthor.USER;

  const wrapperClasses = `flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;
  const messageClasses = `px-4 py-3 rounded-2xl max-w-xl lg:max-w-2xl break-words ${
    isUser
      ? 'bg-blue-600 text-white rounded-br-none'
      : message.isError 
      ? 'bg-red-100 text-red-800 border border-red-200 rounded-bl-none'
      : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
  }`;

  const Icon = isUser ? UserIcon : SparklesIcon;
  const iconClasses = `h-8 w-8 p-1.5 rounded-full ${isUser ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-700'}`;

  return (
    <div className={wrapperClasses}>
      {!isUser && (
        <div className="flex-shrink-0">
          <Icon className={iconClasses} />
        </div>
      )}
      <div className={messageClasses}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       {isUser && (
        <div className="flex-shrink-0">
          <Icon className={iconClasses} />
        </div>
      )}
      {!isUser && !message.isError && (
        <div className="flex-shrink-0 self-center">
             <button
                onClick={handleToggleSpeech}
                className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={isSpeaking ? "Stop reading aloud" : "Read message aloud"}
            >
                {isSpeaking ? <SpeakerXMarkIcon className="h-5 w-5" /> : <SpeakerWaveIcon className="h-5 w-5" />}
            </button>
        </div>
      )}
    </div>
  );
};

export default Message;