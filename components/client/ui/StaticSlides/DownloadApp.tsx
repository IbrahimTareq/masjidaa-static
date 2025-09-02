import { Calendar, DollarSign, Megaphone, Users } from "lucide-react";
import Xarrow, { Xwrapper } from "react-xarrows";
import PrayerLayout from "@/components/LayoutWithHeader";

export default function DownloadApp() {
  return (
    <PrayerLayout headerTitle="Join our community online">
      <div className="h-full bg-white relative overflow-hidden">
        {/* Main Content */}
        <div className="h-full flex flex-col">
          {/* Center Content with Phone and Features */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <Xwrapper>
              <div className="relative max-w-4xl w-full">
                {/* Feature Icons - Desktop Layout */}
                <div className="hidden lg:block">
                  {/* Left Side Features */}
                  <div className="absolute -left-32 top-1/2 -translate-y-1/2 space-y-32">
                    <div
                      id="different-groups"
                      className="flex flex-col items-center text-center text-gray-700"
                    >
                      <Users className="w-12 h-12 mb-3" />
                      <div className="font-semibold text-xl">Prayer Times</div>
                    </div>
                    <div
                      id="donations"
                      className="flex flex-col items-center text-center text-gray-700"
                    >
                      <DollarSign className="w-12 h-12 mb-3" />
                      <div className="font-semibold text-xl">Donations and</div>
                      <div className="font-semibold text-xl">Projects</div>
                    </div>
                  </div>

                  {/* Right Side Features */}
                  <div className="absolute -right-32 top-1/2 -translate-y-1/2 space-y-32">
                    <div
                      id="event-updates"
                      className="flex flex-col items-center text-center text-gray-700"
                    >
                      <Calendar className="w-12 h-12 mb-3" />
                      <div className="font-semibold text-xl">Event Updates</div>
                    </div>
                    <div
                      id="announcements"
                      className="flex flex-col items-center text-center text-gray-700"
                    >
                      <Megaphone className="w-12 h-12 mb-3" />
                      <div className="font-semibold text-xl">Announcements</div>
                    </div>
                  </div>
                </div>

                {/* Phone Mockup - Center */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Background Phone 1 - Left tilted */}
                    <div className="absolute -left-20 top-4 w-64 h-[520px] sm:w-72 sm:h-[580px] bg-black rounded-[3rem] p-4 shadow-xl transform -rotate-12 scale-90 opacity-60 z-10">
                      <div className="w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden relative">
                        <div className="w-full h-full bg-white flex flex-col">
                          {/* WhatsApp Header */}
                          <div className="bg-theme h-16 flex items-center px-4"></div>
                          {/* Chat content */}
                          <div className="flex-1 p-4 space-y-3">
                            <div className="bg-gray-200 rounded-lg p-2 w-3/4">
                              <div className="w-full h-3 bg-gray-300 rounded"></div>
                            </div>
                            <div className="bg-theme-accent rounded-lg p-2 w-2/3 ml-auto">
                              <div className="w-full h-3 bg-theme rounded"></div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-2 w-1/2">
                              <div className="w-full h-3 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Background Phone 2 - Right tilted */}
                    <div className="absolute -right-20 top-4 w-64 h-[520px] sm:w-72 sm:h-[580px] bg-black rounded-[3rem] p-4 transform rotate-12 scale-90 opacity-60 z-10">
                      <div className="w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden relative">
                        <div className="w-full h-full bg-white flex flex-col">
                          {/* WhatsApp Header */}
                          <div className="bg-theme h-16 flex items-center px-4"></div>
                          {/* Chat content */}
                          <div className="flex-1 p-4 space-y-3">
                            <div className="bg-theme-accent rounded-lg p-2 w-2/3 ml-auto">
                              <div className="w-full h-3 bg-theme rounded"></div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-2 w-3/4">
                              <div className="w-full h-3 bg-gray-300 rounded"></div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-2 w-1/2">
                              <div className="w-full h-3 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main Phone Frame - Front */}
                    <div
                      id="main-phone"
                      className="relative w-64 h-[520px] sm:w-72 sm:h-[580px] bg-black rounded-[3rem] p-4 z-20"
                    >
                      <div className="w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden relative">
                        {/* Phone Screen Content */}
                        <div className="w-full h-full bg-white flex flex-col">
                          {/* WhatsApp Header */}
                          <div className="bg-theme h-16 flex items-center px-4"></div>

                          {/* Chat Messages */}
                          <div className="flex-1 p-4 space-y-3">
                            <div className="bg-gray-200 rounded-lg p-2 w-3/4">
                              <div className="w-full h-3 bg-gray-300 rounded mb-1"></div>
                            </div>
                            <div className="bg-theme-accent rounded-lg p-2 w-2/3 ml-auto">
                              <div className="w-full h-3 bg-theme rounded mb-1"></div>
                            </div>

                            {/* QR Code Section */}
                            <div className="flex justify-center my-6">
                              <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                <img
                                  src="/qrcode.png"
                                  alt="QR Code"
                                  className="w-64 h-64 object-contain"
                                />
                              </div>
                            </div>

                            <div className="bg-gray-200 rounded-lg p-2 w-3/4">
                              <div className="w-full h-3 bg-gray-300 rounded mb-1"></div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-2 w-1/2">
                              <div className="w-full h-3 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scan Me Button */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                      <div className="bg-theme text-white px-8 py-3 rounded-xl font-bold text-4xl whitespace-nowrap">
                        SCAN ME
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connecting Arrows - Desktop Only */}
                <div className="hidden lg:block">
                  <Xarrow
                    start="main-phone"
                    end="event-updates"
                    color="gray"
                    strokeWidth={2}
                    headSize={4}
                    startAnchor={{ position: "right", offset: { y: -80 } }}
                    endAnchor="left"
                    path="smooth"
                  />
                  <Xarrow
                    start="main-phone"
                    end="donations"
                    color="gray"
                    strokeWidth={2}
                    headSize={4}
                    startAnchor={{ position: "left", offset: { y: 80 } }}
                    endAnchor="right"
                    path="smooth"
                  />
                  <Xarrow
                    start="main-phone"
                    end="different-groups"
                    color="gray"
                    strokeWidth={2}
                    headSize={4}
                    startAnchor={{ position: "left", offset: { y: -80 } }}
                    endAnchor="right"
                    path="smooth"
                  />
                  <Xarrow
                    start="main-phone"
                    end="announcements"
                    color="gray"
                    strokeWidth={2}
                    headSize={4}
                    startAnchor={{ position: "right", offset: { y: 80 } }}
                    endAnchor="left"
                    path="smooth"
                  />
                </div>

                {/* Mobile Features - Below Phone */}
                <div className="lg:hidden mt-16 grid grid-cols-2 gap-12 text-gray-700">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-3" />
                    <div className="font-semibold text-lg">Event Updates</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-3" />
                    <div className="font-semibold text-lg">
                      Different groups
                    </div>
                    <div className="font-semibold text-lg">and classes</div>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-3" />
                    <div className="font-semibold text-lg">Donations and</div>
                    <div className="font-semibold text-lg">Projects</div>
                  </div>
                  <div className="text-center">
                    <Megaphone className="w-12 h-12 mx-auto mb-3" />
                    <div className="font-semibold text-lg">Announcements</div>
                  </div>
                </div>
              </div>
            </Xwrapper>
          </div>
        </div>
      </div>
    </PrayerLayout>
  );
}
