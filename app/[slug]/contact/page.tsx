"use client";

import { useMasjidContext } from "@/context/masjidContext";

const ContactUs = () => {
  const masjid = useMasjidContext();

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  const encodedAddress = encodeURI(masjid.address_label);

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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              We're here to help and answer any questions you might have. Feel
              free to reach out to us through any of the methods below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact and Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Visit Us</h3>
                  <p className="text-lg text-gray-600">
                    {masjid.address_label}
                  </p>
                </div>

                {masjid.contact_number && (
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Call Us</h3>
                    <a
                      href={`tel:${masjid.contact_number}`}
                      className="text-lg text-theme-gradient hover:text-theme-accent/70 transition-colors"
                    >
                      {masjid.contact_number}
                    </a>
                  </div>
                )}

                {masjid.email && (
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Email Us</h3>
                    <a
                      href={`mailto:${masjid.email}`}
                      className="text-lg text-theme-gradient hover:text-theme-accent/70 transition-colors"
                    >
                      {masjid.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Mosque Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodedAddress}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
