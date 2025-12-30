"use client";

import Image from "next/image";

interface FloatingWhatsAppButtonProps {
  whatsappUrl: string;
  masjidName: string;
}

export default function FloatingWhatsAppButton({
  whatsappUrl,
  masjidName,
}: FloatingWhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={handleWhatsAppClick}
        className="bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-3 py-2.5 shadow-lg transition-all hover:shadow-xl flex items-center gap-2.5 border border-gray-200 cursor-pointer"
        aria-label="Join WhatsApp community"
      >
        <Image
          src="/social-icons/WhatsApp.svg"
          alt="WhatsApp"
          width={20}
          height={20}
          className="flex-shrink-0"
        />
        <span className="text-xs font-normal text-left leading-snug whitespace-nowrap">
          Be part of our community
          <br />
          on <strong className="font-semibold">WhatsApp</strong>
        </span>
      </button>
    </div>
  );
}
