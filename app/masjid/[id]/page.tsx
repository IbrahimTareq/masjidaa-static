"use client";

import NotFound from "@/components/client/ui/NotFound";
import LayoutWithHeader from "@/components/LayoutWithHeader";
import { useMasjidContext } from "@/context/masjidContext";
import { Calendar, Home, Layout, Megaphone, Monitor, User } from "lucide-react";
import Link from "next/link";

export default function LandingDisplay() {
  const masjid = useMasjidContext();

  const navigationItems = [
    {
      title: "Masjid Site",
      description: "Main website",
      icon: Home,
      path: `/${masjid?.slug}`,
    },
    {
      title: "Prayer Screen",
      description: "Prayer times display",
      icon: Monitor,
      path: `/masjid/${masjid?.id}/prayer-screens/theme1`,
    },
    {
      title: "Advanced Layout",
      description: "Full featured display",
      icon: Layout,
      path: `/masjid/${masjid?.id}/layout/advanced`,
    },
    {
      title: "Simple Layout",
      description: "Clean minimal display",
      icon: Layout,
      path: `/masjid/${masjid?.id}/layout/simple`,
    },
    {
      title: "Events",
      description: "View events and programs",
      icon: Calendar,
      path: `/${masjid?.slug}/events`,
    },
    {
      title: "Announcements",
      description: "Community updates",
      icon: Megaphone,
      path: `/${masjid?.slug}/announcements`,
    },
  ];

  if (!masjid) return <NotFound />;

  return (
    <LayoutWithHeader headerTitle={masjid.name}>
      <div className="flex flex-col text-center px-4 pt-12 sm:pt-16 lg:pt-20 overflow-y-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-8">
          Welcome to {masjid?.name}&apos;s display system
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          A modern display system featuring prayer times, announcements, and
          community information. Get started by selecting a feature example
          below.
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  href={item.path}
                  className="group flex flex-col items-center text-center hover:opacity-80 transition-opacity duration-200 min-w-[100px]"
                >
                  <div className="w-16 h-16 bg-theme rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm sm:text-base mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-tight max-w-[120px]">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </LayoutWithHeader>
  );
}
