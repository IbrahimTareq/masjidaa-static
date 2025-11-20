interface PrayerTimeCardProps {
  name: string;
  arabicName: string;
  adhanTime: string;
  iqamahTime: string | null;
  isActive?: boolean;
}

export function PrayerTimeCard({
  name,
  arabicName,
  adhanTime,
  iqamahTime,
  isActive = false,
}: PrayerTimeCardProps) {
  return (
    <div
      className={`text-center p-6 rounded-lg transition-all ${
        isActive
          ? "bg-theme text-white shadow-lg"
          : "bg-gray-100 text-gray-700 shadow-sm"
      }`}
    >
      <div className="mb-2">
        <h3
          className={`text-lg font-medium uppercase ${
            isActive ? "text-white" : "text-gray-700"
          }`}
        >
          {name} {arabicName}
        </h3>
      </div>
      <div className="mb-1">
        <span
          className={`text-3xl md:text-4xl font-bold ${
            isActive ? "text-white" : "text-theme"
          }`}
        >
          {adhanTime}
        </span>
      </div>
      {iqamahTime && (
        <div
          className={`text-sm uppercase ${
            isActive ? "text-theme-accent" : "text-gray-500"
          }`}
        >
          Iqamah {iqamahTime}
        </div>
      )}
    </div>
  );
}

