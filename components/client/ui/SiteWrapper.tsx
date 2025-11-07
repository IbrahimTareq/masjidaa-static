"use client";

import { useMasjidContext } from "@/context/masjidContext";
import { Tables } from "@/database.types";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import Image from "next/image";
import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";

export default function SiteWrapper({
  children,
  socials,
}: {
  children: React.ReactNode;
  socials: Tables<"masjid_socials"> | null;
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <a href={`/${masjid.slug}`} className="flex-shrink-0">
              <div className="relative h-16 w-16 md:h-20 md:w-20 p-2">
                {masjid.logo && (
                  <Image
                    src={masjid.logo}
                    alt={`${masjid.name} Logo`}
                    fill
                    className="object-contain"
                    sizes="80px"
                    priority
                  />
                )}
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <NavLink href={`/${masjid.slug}`}>Home</NavLink>
              <NavLink href={`/${masjid.slug}/events`}>Events</NavLink>
              <NavLink href={`/${masjid.slug}/announcements`}>
                Announcements
              </NavLink>
              <NavLink href={`/${masjid.slug}/services`}>Services</NavLink>
              <NavLink href={`/${masjid.slug}/donations`}>Donations</NavLink>
              <NavLink href={`/${masjid.slug}/contact`}>Contact</NavLink>
              <NavLink
                href={`/${masjid.slug}/app-download`}
                className="bg-theme-gradient text-white font-medium px-4 xl:px-6 py-2 rounded hover:bg-theme-gradient/90 transition-colors min-h-[44px] inline-flex items-center"
              >
                Download App
              </NavLink>
            </div>

            {/* Mobile Navigation Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-theme-gradient p-3 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
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
              isOpen ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <div className="py-4 space-y-1">
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
              <NavLink href={`/${masjid.slug}/donations`} mobile>
                Donations
              </NavLink>
              <NavLink href={`/${masjid.slug}/contact`} mobile>
                Contact
              </NavLink>
              <NavLink
                href={`/${masjid.slug}/app-download`}
                className="w-full bg-theme-gradient text-white text-center font-medium px-6 py-3 rounded hover:bg-theme-accent/90 transition-colors mt-4 min-h-[44px] flex items-center justify-center"
              >
                Download App
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 md:pt-24">{children}</main>

      {/* Footer */}
      <footer className="bg-white text-black pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 pt-8 md:pt-10 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Mosque Logo and Name */}
            <div>
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-lg flex items-center justify-center mb-4">
                {masjid.logo && (
                  <Image
                    src={masjid.logo}
                    alt={`${masjid.name} Logo`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 160px, 192px"
                  />
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{masjid.name}</h2>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Quick Links</h2>
              <ul className="space-y-2 md:space-y-3">
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
                  <FooterLink href={`/${masjid.slug}/app-download`}>
                    Download App
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
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Contact Us</h2>
              <address className="not-italic space-y-2 md:space-y-3 text-sm md:text-base text-gray-600">
                <p>{masjid.address_label}</p>
                <p>Phone: {masjid.contact_number || "N/A"}</p>
                <p className="break-all">Email: {masjid.email || "N/A"}</p>
              </address>
            </div>

            {/* Social Links */}
            {(socials?.facebook_url ||
              socials?.twitter_url ||
              socials?.instagram_url ||
              socials?.youtube_url ||
              socials?.tiktok_url) && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Follow Us</h2>
                <div className="flex gap-3 md:gap-4 flex-wrap">
                  {socials?.facebook_url && (
                    <SocialLink
                      href={socials?.facebook_url || ""}
                      icon="facebook"
                    />
                  )}
                  {socials?.twitter_url && (
                    <SocialLink
                      href={socials?.twitter_url || ""}
                      icon="twitter"
                    />
                  )}
                  {socials?.instagram_url && (
                    <SocialLink
                      href={socials?.instagram_url || ""}
                      icon="instagram"
                    />
                  )}
                  {socials?.youtube_url && (
                    <SocialLink
                      href={socials?.youtube_url || ""}
                      icon="youtube"
                    />
                  )}
                  {socials?.tiktok_url && (
                    <SocialLink
                      href={socials?.tiktok_url || ""}
                      icon="tiktok"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 md:mt-10 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 py-4 md:py-6">
              <p className="text-sm md:text-base text-gray-600 leading-none text-center md:text-left">
                © {new Date().getFullYear()} {masjid.name}. All rights reserved.
              </p>
              <div className="flex items-center text-gray-600">
                <a
                  href={DOMAIN_NAME}
                  className="flex items-center text-black hover:text-gray-600 transition-colors min-h-[44px]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="mr-2 leading-none text-sm md:text-base">Powered by</span>
                  <Image
                    src="https://images.masjidaa.com/assets/brand/logo-secondary.svg"
                    alt="Masjidaa"
                    width={100}
                    height={24}
                    className="h-5 md:h-6 w-auto"
                  />
                </a>
              </div>
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
}> = ({ href, children, mobile = false, className }) => {
  // Base mobile styles
  const mobileStyles = mobile 
    ? "py-3 text-center text-base md:text-lg min-h-[44px] flex items-center justify-center" 
    : "";
  
  // Default styles when no custom className provided
  const defaultStyles = "text-theme-gradient hover:text-theme-gradient/70 transition-colors";
  
  // Combine: use custom className if provided, otherwise use default + mobile styles
  const finalClassName = className || `${defaultStyles} ${mobileStyles}`;
  
  return (
    <a href={href} className={finalClassName}>
      {children}
    </a>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    className="text-sm md:text-base text-gray-600 hover:text-theme-gradient transition-colors min-h-[44px] flex items-center"
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
    style={{ width: 44, height: 44 }}
    bgColor="transparent"
    fgColor="#666666"
  />
);
