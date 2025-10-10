import PrayerLayout from "@/components/LayoutWithHeader";

export default function MasjidEtiquette() {
  const etiquettePoints = [
    {
      text: "Wear clean and pure attire when visiting the mosque, ensuring your clothing is modest and appropriate",
    },
    {
      text: "Avoid raising your voice or engaging in loud conversations that may distract others from prayer and worship",
    },
    {
      text: "Abstain from talking during prayer times, khutbah, or when others are engaged in worship",
    },
    {
      text: "Turn off or silence your mobile phone to avoid disturbing the peaceful atmosphere of the mosque",
    },
    {
      text: "Avoid coming to the mosque with bad odor from strong-smelling foods like garlic, onions, or cigarettes",
    },
    {
      text: "Practice proper hygiene by covering your mouth and nose when sneezing or coughing to protect others",
    },
    {
      text: "Keep the mosque clean and dispose of any trash in the proper receptacles",
    },
  ];

  return (
    <PrayerLayout headerTitle="Masjid Etiquette">
      <main className="px-4 py-6">
        <div className="w-full mx-auto space-y-2">
          {etiquettePoints.map((point, index) => (
            <div key={index} className="flex gap-4 p-4">
              {/* Bullet Point */}
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-theme rounded-full mt-2"></div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm sm:text-base lg:text-xl text-gray-700 font-medium leading-relaxed">
                  {point.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PrayerLayout>
  );
}
