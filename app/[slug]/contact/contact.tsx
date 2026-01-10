"use client";

import { useLocationContext } from "@/context/locationContext";
import { useMasjid } from "@/context/masjidContext";

const ContactClient = () => {
  const masjid = useMasjid();
  const location = useLocationContext();

  const encodedAddress = location?.address_label
    ? encodeURI(location.address_label)
    : "";

  const hasContactInfo =
    location?.address_label || masjid.contact_number || masjid.email;

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/pattern8.jpg')] bg-repeat opacity-10"
          style={{ backgroundSize: "400px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-theme-gradient">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              We're here to help and answer any questions you might have. Feel
              free to reach out to us through any of the methods below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact and Map Section */}
      <section className="bg-gray-50 text-black p-4 md:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-0">
          {!hasContactInfo ? (
            <div className="text-center py-8 md:py-12">
              <p className="text-sm md:text-base text-gray-500">
                There is currently no contact information available. Please
                check back later for updates.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <div className="space-y-6 md:space-y-8">
                  {location?.address_label && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        Visit Us
                      </h3>
                      <p className="text-base md:text-lg text-gray-600">
                        {location.address_label}
                      </p>
                    </div>
                  )}

                  {masjid.contact_number && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        Call Us
                      </h3>
                      <a
                        href={`tel:${masjid.contact_number}`}
                        className="flex items-center min-h-[44px] text-base md:text-lg text-theme-gradient hover:text-theme-accent/70 transition-colors"
                      >
                        {masjid.contact_number}
                      </a>
                    </div>
                  )}

                  {masjid.email && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        Email Us
                      </h3>
                      <a
                        href={`mailto:${masjid.email}`}
                        className="flex items-center min-h-[44px] text-base md:text-lg text-theme-gradient hover:text-theme-accent/70 transition-colors break-all"
                      >
                        {masjid.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {encodedAddress && (
                <div className="h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    title="Mosque Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactClient;
