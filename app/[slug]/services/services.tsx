"use client";

import { useMasjidSiteSettings } from "@/context/masjidSiteSettingsContext";
import { Info } from "lucide-react";
import { ReactNode } from "react";

interface ServiceCTA {
  text: string;
  link: string;
}

interface Service {
  title: string;
  description: string;
  icon?: ReactNode;
  cta?: ServiceCTA;
}


export default function ServicesClient() {
  const { siteSettings } = useMasjidSiteSettings();
  const services: Service[] = (siteSettings?.services as unknown as Service[]) || [];

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-0">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-theme-gradient">
              Our Services
            </h1>
            <p className="text-xl text-gray-600">
              Discover the range of services we offer to support our community's
              spiritual, educational, and social needs. From daily prayers to
              community support, we're here to serve and grow together.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                  <div className="text-theme-gradient mb-4">
                    <Info className="w-10 h-10" />
                  </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                {service.cta && (
                  <a
                    href={service.cta.link}
                    className="mt-auto inline-flex items-center px-4 py-2 text-theme-gradient border border-theme-gradient/20 rounded-md font-medium hover:bg-theme-gradient hover:text-white transition-all duration-200 group whitespace-nowrap"
                  >
                    {service.cta.text}
                    <svg
                      className="w-4 h-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
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
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
