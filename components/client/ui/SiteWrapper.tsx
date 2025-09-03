"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";

export default function SiteWrapper({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: Tables<"masjid_site_settings"> | null;
}) {
  const masjid = useMasjidContext();

  const [isOpen, setIsOpen] = useState(false);

  if (!masjid) {
    return <div>Masjid not found</div>;
  }

  return (
    <div className="min-h-screen text-white font-montserrat">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-theme-gradient font-semibold">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <a href={`/${masjid.slug}`} className="flex-shrink-0">
              <div className="h-20 w-20 p-2">
                <img
                  src={masjid.logo || ""}
                  alt={`${masjid.name} Logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href={`/${masjid.slug}`}>Home</NavLink>
              <NavLink href={`/${masjid.slug}/events`}>Events</NavLink>
              <NavLink href={`/${masjid.slug}/announcements`}>
                Announcements
              </NavLink>
              <NavLink href={`/${masjid.slug}/services`}>Services</NavLink>
              <NavLink href={`/${masjid.slug}/contact`}>Contact</NavLink>
              <NavLink
                href={`/${masjid.slug}/donations`}
                className="bg-theme-gradient text-white font-medium px-6 py-2 rounded hover:bg-theme-gradient/90 transition-colors"
              >
                Donate Now
              </NavLink>
            </div>

            {/* Mobile Navigation Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-theme-gradient p-2 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
              isOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="py-4 space-y-2">
              <NavLink href={`/${masjid.slug}`} mobile>
                Home
              </NavLink>
              <NavLink href={`/${masjid.slug}/events`} mobile>
                Events
              </NavLink>
              <NavLink href={`/${masjid.slug}/announcements`} mobile>
                Announcements
              </NavLink>
              <NavLink href={`/${masjid.slug}/services`} mobile>
                Services
              </NavLink>
              <NavLink href={`/${masjid.slug}/contact`} mobile>
                Contact
              </NavLink>
              <NavLink
                href={`/${masjid.slug}/donations`}
                className="block w-full bg-theme-gradient text-white text-center font-medium px-6 py-2 rounded hover:bg-theme-accent/90 transition-colors mt-4"
              >
                Donate Now
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Spacer */}
      <div className="h-24" />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white text-black pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 pt-10 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Mosque Logo and Name */}
            <div>
              <div className="w-48 h-48 rounded-lg flex items-center justify-center mb-4">
                <img
                  src={masjid.logo || ""}
                  alt={`${masjid.name} Logo`}
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
              <h2 className="text-2xl font-bold">{masjid.name}</h2>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
              <ul className="space-y-3">
                <li>
                  <FooterLink href={`/${masjid.slug}/events`}>
                    Events
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`/${masjid.slug}/announcements`}>
                    Announcements
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`/${masjid.slug}/services`}>
                    Services
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`/${masjid.slug}/donations`}>
                    Donations
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`/${masjid.slug}/contact`}>
                    Contact
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <address className="not-italic space-y-3 text-gray-600">
                <p>{masjid.address_label}</p>
                <p>Phone: {masjid.contact_number || "N/A"}</p>
                <p>Email: {masjid.email || "N/A"}</p>
              </address>
            </div>

            {/* Social Links */}
            {(siteSettings?.facebook_url ||
              siteSettings?.twitter_url ||
              siteSettings?.instagram_url ||
              siteSettings?.youtube_url ||
              siteSettings?.tiktok_url) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
                  <div className="flex gap-4">
                    {siteSettings?.facebook_url && (
                      <SocialLink
                        href={siteSettings?.facebook_url || ""}
                        icon="facebook"
                      />
                    )}
                    {siteSettings?.twitter_url && (
                      <SocialLink
                        href={siteSettings?.twitter_url || ""}
                        icon="twitter"
                      />
                    )}
                    {siteSettings?.instagram_url && (
                      <SocialLink
                        href={siteSettings?.instagram_url || ""}
                        icon="instagram"
                      />
                    )}
                    {siteSettings?.youtube_url && (
                      <SocialLink
                        href={siteSettings?.youtube_url || ""}
                        icon="youtube"
                      />
                    )}
                    {siteSettings?.tiktok_url && (
                      <SocialLink
                        href={siteSettings?.tiktok_url || ""}
                        icon="tiktok"
                      />
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600">
                © {new Date().getFullYear()} {masjid.name}. All rights reserved.
              </p>
              <p className="text-gray-600">Powered by Masjidaa</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  className?: string;
}> = ({ href, children, mobile = false, className }) => (
  <a
    href={href}
    className={
      className ||
      `text-theme-gradient hover:text-theme-gradient/70 transition-colors ${
        mobile ? "block py-3 text-center text-lg" : ""
      }`
    }
  >
    {children}
  </a>
);

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    className="text-gray-600 hover:text-theme-gradient transition-colors"
  >
    {children}
  </a>
);

const SocialLink: React.FC<{ href: string; icon: string }> = ({
  href,
  icon,
}) => (
  <SocialIcon
    url={href}
    network={icon}
    target="_blank"
    rel="noopener noreferrer"
    className="transition-transform hover:scale-110"
    style={{ width: 40, height: 40 }}
    bgColor="transparent"
    fgColor="#666666"
  />
);
