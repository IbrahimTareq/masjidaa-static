"use client";

export default function PrayerScreens({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen p-2 sm:p-4 lg:p-5 bg-gradient-to-br from-theme to-theme flex flex-col">
      <div className="flex-1 w-full rounded-t-2xl rounded-b-2xl sm:rounded-t-3xl sm:rounded-b-3xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
