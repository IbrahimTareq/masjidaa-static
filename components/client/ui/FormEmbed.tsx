"use client";

import Script from "next/script";

export default function FormEmbed() {
  return (
    <div className="w-full max-w-3xl h-[80vh]">
      <iframe
        src="https://tally.so/embed/woXyzX?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
        className="w-full h-full border-none"
        title="Masjidaa form"
      />

      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          Tally.loadEmbeds();
        }}
      />
    </div>
  );
}
