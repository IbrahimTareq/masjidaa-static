"use client";

import { Tables } from "@/database.types";
import { Announcements as AnnouncementsComponent } from "@/components/client/interactive/Announcements";

export default function Announcements({
  announcements,
  slug,
}: {
  announcements: Tables<"announcements">[];
  slug: string;
}) {
  return (
    <div className="bg-white text-black font-montserrat">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <AnnouncementsComponent announcements={announcements} slug={slug} />
      </div>
    </div>
  );
}
