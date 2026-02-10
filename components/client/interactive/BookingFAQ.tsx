"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface BookingFAQProps {
  faqs: FAQItem[];
}

const BookingFAQ: React.FC<BookingFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
        Frequently Asked Questions
      </h2>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-gray-900 pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? "max-h-[1000px]" : "max-h-0"
              }`}
            >
              <div 
                className="p-4 text-gray-600 leading-relaxed whitespace-pre-line [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingFAQ;

