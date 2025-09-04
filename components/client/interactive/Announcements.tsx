"use client";

import { Tables } from "@/database.types";
import { Pin, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AnnouncementsProps {
  announcements: Tables<"announcements">[];
  slug: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return { day, month };
};

export const Announcements: React.FC<AnnouncementsProps> = ({
  announcements,
  slug,
}) => {
  const getStatusBadge = (announcement: Tables<"announcements">) => {
    const badges = [];

    // Check for pinned status first (highest priority)
    if (announcement.pinned) {
      badges.push(
        <span
          key="pinned"
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-theme-accent text-theme-gradient"
        >
          <Pin
            className="w-3 h-3 mr-1"
            fill="currentColor"
            stroke="currentColor"
          />
          Pinned
        </span>
      );
    }

    // Check if announcement is recent (within last 7 days)
    const createdDate = new Date(announcement.created_at || "");
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    if (createdDate > weekAgo) {
      badges.push(
        <span
          key="added"
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
        >
          <Plus className="w-3 h-3 mr-1" />
          added
        </span>
      );
    }

    // Check if updated recently (and not already showing "added")
    if (
      announcement.updated_at &&
      announcement.updated_at !== announcement.created_at &&
      !(createdDate > weekAgo)
    ) {
      const updatedDate = new Date(announcement.updated_at);
      if (updatedDate > weekAgo) {
        badges.push(
          <span
            key="updated"
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            updated
          </span>
        );
      }
    }

    return badges.length > 0 ? (
      <div className="flex gap-2 flex-wrap">{badges}</div>
    ) : null;
  };

  return (
    <>
      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            There are currently no announcements listed. Please check back later
            for updates.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {[...announcements]
            .sort((a, b) => {
              // Sort pinned announcements first
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              // Then sort by created_at date (newest first)
              return (
                new Date(b.created_at || "").getTime() -
                new Date(a.created_at || "").getTime()
              );
            })
            .map((announcement) => {
              const { day, month } = formatDate(announcement.created_at || "");
              const statusBadge = getStatusBadge(announcement);

              return (
                <Link
                  key={announcement.id}
                  href={`/${slug}/announcement/${announcement.id}`}
                  className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="flex">
                    {/* Date Sidebar */}
                    <div className="flex-shrink-0 w-24 bg-gray-100 p-6 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-gray-800">
                        {day}
                      </div>
                      <div className="text-sm font-medium text-gray-600 uppercase">
                        {month}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-theme-gradient transition-colors duration-200">
                              {announcement.title}
                            </h3>
                            {statusBadge}
                          </div>

                          {announcement.description && (
                            <p
                              className="text-gray-600 leading-relaxed mb-4 overflow-hidden text-ellipsis"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {announcement.description}
                            </p>
                          )}
                        </div>

                        {/* Arrow Icon */}
                        <div className="ml-4 flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-theme-gradient transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div>
                          Published{" "}
                          {new Date(
                            announcement.created_at || ""
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>

                        <div className="text-gray-400 group-hover:text-theme-gradient transition-colors duration-200">
                          Read more
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          <div className="flex justify-center">
            Announcements older than 3 months are not available.
          </div>
        </div>
      )}
    </>
  );
};
