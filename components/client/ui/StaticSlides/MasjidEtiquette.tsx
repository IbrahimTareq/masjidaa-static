import PrayerLayout from "@/components/LayoutWithHeader";

export default function MasjidEtiquette() {
  const etiquettePoints = [
    {
      number: 1,
      text: "Wear clean and modest attire when visiting the mosque",
    },
    {
      number: 2,
      text: "Turn off or silence your mobile phone to maintain the peaceful atmosphere",
    },
    {
      number: 3,
      text: "Abstain from talking during prayer times, khutbah, or when others are engaged in worship",
    },
    {
      number: 4,
      text: "Avoid loud conversations that may distract others from prayer and worship",
    },
    {
      number: 5,
      text: "Keep the mosque clean and dispose of any trash in the proper receptacles",
    },
  ];

  return (
    <PrayerLayout headerTitle="Masjid Etiquette">
      <div className="w-full overflow-x-hidden bg-white h-full flex items-center justify-center">
        <div
          className="w-full mx-auto px-[2vw] py-[1.5vh]"
          style={{
            maxWidth: 'clamp(800px, 95vw, 1600px)',
          }}
        >
          {/* Etiquette List */}
          <div
            className="w-full mx-auto"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(0.625rem, 1vh, 1.75rem)',
            }}
          >
            {etiquettePoints.map((point) => (
              <div
                key={point.number}
                className="flex gap-[1vw] items-start"
                style={{
                  padding: 'clamp(0.375rem, 0.7vw, 1.25rem)',
                }}
              >
                {/* Number Circle */}
                <div className="flex-shrink-0">
                  <div
                    className="bg-theme text-white rounded-full flex items-center justify-center font-bold"
                    style={{
                      width: 'clamp(1.5rem, 2.2vw, 3.5rem)',
                      height: 'clamp(1.5rem, 2.2vw, 3.5rem)',
                      fontSize: 'clamp(0.75rem, 1.2vw, 1.875rem)',
                    }}
                  >
                    {point.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-gray-700 font-medium break-words"
                    style={{
                      fontSize: 'clamp(0.875rem, 1.3vw, 2rem)',
                      lineHeight: '1.2',
                    }}
                  >
                    {point.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}
