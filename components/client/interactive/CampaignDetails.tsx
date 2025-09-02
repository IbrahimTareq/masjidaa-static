"use client";

import React, { useState } from "react";
import { Tables } from "@/database.types";
import { Calendar } from "lucide-react";

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
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-8">
        {campaign.name}
      </h1>

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
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 sm:w-32 sm:h-32 text-gray-300" />
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
    </div>
  );
};
