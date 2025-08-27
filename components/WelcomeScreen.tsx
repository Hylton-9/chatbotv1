import React from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface WelcomeScreenProps {
  onSampleQuestionClick: (question: string) => void;
}

const sampleQuestions = [
  { title: "Course Overview", question: "What is the main objective of this course?" },
  { title: "Assessment Breakdown", question: "How is the final grade calculated? List the assessments and their weights." },
  { title: "Weekly Topics", question: "What topics will be covered in week 5?" },
  { title: "Contact Information", question: "How can I contact the course coordinator?" },
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSampleQuestionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 p-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the AI Document Assistant</h2>
        <p className="text-lg mb-8">
          Get instant answers from your documents. Simply upload a PDF and start asking questions.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-4">
            <DocumentTextIcon className="h-12 w-12 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-700">1. Upload Document</h3>
            <p className="text-sm">Click the paperclip icon to upload your course syllabus, handbook, or any PDF.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <ChatBubbleIcon className="h-12 w-12 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-700">2. Ask Questions</h3>
            <p className="text-sm">Ask specific questions about the content of your uploaded document.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <LightBulbIcon className="h-12 w-12 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-700">3. Get Insights</h3>
            <p className="text-sm">Receive intelligent, context-aware answers in seconds.</p>
          </div>
        </div>
         <div className="w-full max-w-3xl mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Or, try an example question about your handbook</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleQuestions.map((q) => (
                <button
                  key={q.title}
                  onClick={() => onSampleQuestionClick(q.question)}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all text-left"
                  aria-label={`Ask: ${q.question}`}
                >
                  <p className="font-semibold text-gray-700">{q.title}</p>
                  <p className="text-sm text-gray-500 mt-1">"{q.question}"</p>
                </button>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;