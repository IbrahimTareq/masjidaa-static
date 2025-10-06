"use client";

import React, { useState } from "react";
import { Tables } from "@/database.types";
import { Calendar, Heart, Share2 } from "lucide-react";

interface CampaignDetailsProps {
  campaign: Tables<"donation_campaigns">;
  onImageClick?: () => void;
}

export const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaign,
  onImageClick,
}) => {
  return (
    <div className="flex-1 mb-8 lg:mb-0">
      {/* Title */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          {campaign.name}
        </h1>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-4">
          <Share2 className="w-8 h-8 text-theme" />
        </button>
      </div>

      {/* Campaign Image */}
      <div
        className="aspect-[4/3] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 cursor-pointer transition-transform hover:scale-[1.02] mb-8"
        onClick={onImageClick}
      >
        {campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-full h-full bg-theme-gradient/10 flex items-center justify-center">
            <Heart className="w-16 h-16 sm:w-32 sm:h-32 text-theme opacity-70" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">
          About this Campaign
        </h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {campaign.description}
        </div>
      </div>

      {campaign.video && (
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 cursor-pointer transition-transform hover:scale-[1.02] mb-8">
          <iframe
            src={campaign.video}
            title={campaign.name}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};
