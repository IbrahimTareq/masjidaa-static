import PrayerLayout from "@/components/LayoutWithHeader";

export default function Parking() {
  const parkingGuidelines = [
    {
      text: "Do not block driveways, fire hydrants, or emergency vehicle access points",
    },
    {
      text: "Park within designated spaces and avoid taking up multiple spots or parking on private property",
    },
    {
      text: "Allow adequate space for other vehicles to maneuver and exit their parking spots safely",
    },
    {
      text: "Walk the extra distance rather than inconveniencing others with inconsiderate parking",
    },
  ];

  return (
    <PrayerLayout headerTitle="Parking Etiquette">
      <div className="w-full overflow-x-hidden bg-white h-full flex items-center justify-center">
        <div
          className="w-full mx-auto px-[2vw] py-[1.5vh]"
          style={{
            maxWidth: "clamp(800px, 95vw, 1600px)",
          }}
        >
          {/* Hadith Section - Centered */}
          <div className="text-center mb-[2vh]">
            <div
              className="text-theme-gradient rounded-lg inline-block"
              style={{
                padding: "clamp(1rem, 1.6vw, 2.5rem)",
              }}
            >
              <p
                className="font-medium leading-relaxed break-words"
                style={{
                  fontSize: "clamp(1rem, 1.5vw, 2.25rem)",
                  lineHeight: "1.4",
                  maxWidth: "none",
                }}
              >
                "He will not enter Paradise whose neighbour is not secure from
                his wrongful conduct."&nbsp;
                <span
                  className="opacity-75 italic"
                  style={{
                    fontSize: "clamp(0.875rem, 1.2vw, 1.75rem)",
                  }}
                >
                  - Sahih Muslim 46
                </span>
              </p>
            </div>
          </div>

          <div
            className="bg-gray-200"
            style={{
              height: "clamp(2px, 0.25vh, 5px)",
              margin: "clamp(1rem, 1.5vh, 2.5rem) 0",
            }}
          />

          {/* Parking Guidelines */}
          <div className="w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.2vw]">
              {parkingGuidelines.map((guideline, index) => (
                <div
                  key={index}
                  className="flex gap-[1vw] items-start"
                  style={{
                    padding: "clamp(0.625rem, 1vw, 1.5rem)",
                  }}
                >
                  {/* Bullet Point */}
                  <div className="flex-shrink-0">
                    <div
                      className="bg-theme rounded-full"
                      style={{
                        width: "clamp(0.5rem, 0.8vw, 1.25rem)",
                        height: "clamp(0.5rem, 0.8vw, 1.25rem)",
                        marginTop: "clamp(0.3rem, 0.5vh, 0.6rem)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-gray-700 font-medium break-words"
                      style={{
                        fontSize: "clamp(1rem, 1.4vw, 2rem)",
                        lineHeight: "1.3",
                      }}
                    >
                      {guideline.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}
