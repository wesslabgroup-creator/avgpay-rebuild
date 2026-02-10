// avgpay/src/components/ExpandableFAQ.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableFAQProps {
  question: string;
  answer: string;
}

export const ExpandableFAQ: React.FC<ExpandableFAQProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-left text-lg font-semibold text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s+/g, '-')}`}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <div
        id={`faq-answer-${question.replace(/\s+/g, '-')}`}
        className={`mt-3 text-gray-600 transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}
        // Using dangerouslySetInnerHTML for potential HTML content in answers.
        // Ensure answers are sanitized if coming from untrusted sources.
        dangerouslySetInnerHTML={{ __html: answer }}
      />
    </div>
  );
};
