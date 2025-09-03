"use client";

import { Copy } from "lucide-react";
import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";

// Props for the ShareSection component
export interface ShareSectionProps {
  title?: string;
  entityName: string; // Masjid name or campaign name
  shareUrl: string;
  showQuote?: boolean;
  containerClassName?: string;
  iconSize?: "small" | "medium" | "large";
  gridCols?: number;
}

// Social sharing links generator
export const getSocialLinks = (entityName: string, url: string) => [
  {
    name: "Facebook",
    network: "facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    network: "whatsapp",
    href: `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Messenger",
    network: "facebook",
    href: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}`,
  },
  {
    name: "Email",
    network: "email",
    href: `mailto:?subject=Support ${entityName}&body=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    network: "linkedin",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    network: "x",
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
];

// Copy link hook
export const useCopyLink = () => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  
  return { copied, handleCopy };
};

// ShareSection component
export default function ShareSection({
  title,
  entityName,
  shareUrl,
  showQuote = true,
  containerClassName = "bg-white rounded-2xl shadow-sm p-8",
  iconSize = "medium",
  gridCols = 4,
}: ShareSectionProps) {
  const { copied, handleCopy } = useCopyLink();
  const socialLinks = getSocialLinks(entityName, shareUrl);
  
  // Determine icon size
  const iconSizeClass = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }[iconSize];
  
  return (
    <div className={containerClassName}>
      {title && <h3 className="text-xl font-bold text-gray-900 mb-4">
        {title}
      </h3>}
      <p className="mb-6">
        By simply sharing this cause, you could help someone donate and
        you'll share in every reward that follows.
      </p>
      
      {showQuote && (
        <div className="mb-6">
          <p className="text-gray-500 text-sm italic">
            "Whoever guides someone to goodness will have a reward like the
            one who does it." — Sahih Muslim</p>
        </div>
      )}

      {/* Copy Link */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-[#F8F9FA] text-gray-600"
        />
        <button
          onClick={() => handleCopy(shareUrl)}
          className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 cursor-pointer ${
            copied 
              ? "bg-theme-gradient text-white" 
              : "bg-theme text-white hover:bg-theme-gradient"
          }`}
        >
          <Copy className={`w-4 h-4 transition-transform duration-300 ${copied ? "scale-110" : ""}`} />
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      {/* Social Links Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-${gridCols} gap-4`}>
        {socialLinks.map((link) => (
          <div
            key={link.name}
            onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
            className="flex flex-col items-center gap-2 p-4 hover:bg-[#F8F9FA] rounded-lg transition-colors cursor-pointer"
          >
            <div className={iconSizeClass}>
              <SocialIcon
                network={link.network}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <span className="text-sm text-gray-600">{link.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}