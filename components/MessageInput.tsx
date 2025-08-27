import React, { useState, useRef, useEffect } from 'react';
import { UploadedFile } from '../types';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { SendIcon } from './icons/SendIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

// Fix for TypeScript: Add type definitions for the Web Speech API to resolve "Cannot find name 'SpeechRecognition'".
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition };
    webkitSpeechRecognition: { new (): SpeechRecognition };
  }
}

interface MessageInputProps {
  onSendMessage: () => void;
  onFileChange: (file: UploadedFile | null) => void;
  isLoading: boolean;
  uploadedFileName?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
    onSendMessage, 
    onFileChange, 
    isLoading, 
    uploadedFileName,
    inputValue,
    onInputChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        onInputChange(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (isListening) {
            setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, [onInputChange, isListening]);

  const handleListen = () => {
    if (isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      onInputChange(''); // Clear input before starting
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFileIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            const base64Data = base64String.split(',')[1];
            if (base64Data) {
                onFileChange({
                    name: file.name,
                    data: base64Data,
                    mimeType: file.type,
                });
            } else {
                 onFileChange(null);
                 alert("Could not read the file. Please try again.");
            }
        };
        reader.onerror = () => {
            onFileChange(null);
            alert("Error reading file. Please try again.");
        };
        reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a PDF file.');
    }
    e.target.value = '';
  };
  
  const handleRemoveFile = () => {
    onFileChange(null);
  }

  return (
    <div className="bg-white border-t p-4 rounded-xl shadow-lg">
      {uploadedFileName && (
        <div className="mb-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center text-sm">
            <div className="flex items-center text-blue-700">
                <DocumentIcon className="h-5 w-5 mr-2" />
                <span className="font-medium">{uploadedFileName}</span>
            </div>
            <button onClick={handleRemoveFile} className="text-blue-500 hover:text-blue-700">
                <XCircleIcon className="h-5 w-5" />
            </button>
        </div>
      )}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleFileIconClick}
          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Upload PDF"
        >
          <PaperclipIcon className="h-6 w-6" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={uploadedFileName ? "Ask a question or use the microphone..." : "Upload a PDF to begin..."}
          className="flex-1 p-3 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow w-full bg-gray-100"
          disabled={isLoading || !uploadedFileName}
        />
        <button
            onClick={handleListen}
            disabled={isLoading || !recognitionRef.current || !uploadedFileName}
            className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'text-red-500 bg-red-100' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'}`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
        >
            <MicrophoneIcon className="h-6 w-6" />
        </button>
        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Send message"
        >
          <SendIcon className="h-6 w-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          accept=".pdf"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MessageInput;