"use client";

import { ExternalLink } from "lucide-react";

interface ResourceItem {
  url: string;
  displayName: string;
}

interface BookingResourcesProps {
  resources: ResourceItem[];
}

const BookingResources: React.FC<BookingResourcesProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
        Resources
      </h2>
      
      <ul className="space-y-3">
        {resources.map((resource, index) => (
          <li key={index}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-theme hover:text-theme-gradient transition-colors group"
            >
              <span className="underline decoration-1 underline-offset-2 group-hover:decoration-2">
                {resource.displayName}
              </span>
              <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingResources;
