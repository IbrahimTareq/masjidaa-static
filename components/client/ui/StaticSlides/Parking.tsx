import PrayerLayout from "@/components/LayoutWithHeader";

export default function Parking() {
  const parkingGuidelines = [
    {
      text: "Be considerate of your neighbors and avoid parking in front of their homes",
    },
    {
      text: "Observe all 'No Standing' and 'No Parking' signs in the surrounding area",
    },
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
      <main className="px-4 py-6">
        {/* Hadith Section - Centered */}
        <div className="text-center mb-8">
          <div className="text-theme-gradient px-6 py-4 rounded-lg inline-block">
            <p className="text-sm sm:text-base lg:text-3xl font-medium leading-relaxed max-w-6xl">
              It is narrated on the authority of Abu Huraira that the Messenger
              of Allah ﷺ said:
              <br />
              "He will not enter Paradise whose neighbour is not secure from his
              wrongful conduct."
              <br />
              <span className="text-sm opacity-75 mt-2 block">
                [Sahih Muslim 46]
              </span>
            </p>
          </div>
        </div>

        <div className="h-1 bg-gray-200 my-6"></div>

        {/* Parking Guidelines */}
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {parkingGuidelines.map((guideline, index) => (
              <div key={index} className="flex gap-4 p-4">
                {/* Bullet Point */}
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-theme rounded-full mt-2"></div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm sm:text-base lg:text-2xl text-gray-700 font-medium leading-relaxed">
                    {guideline.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PrayerLayout>
  );
}
