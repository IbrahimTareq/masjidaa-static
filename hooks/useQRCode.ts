import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRCodeOptions {
  width?: number;
  height?: number;
  data: string;
}

export function useQRCode(
  options: QRCodeOptions,
  containerRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!containerRef.current || !options.data) return;

    // Clear previous QR code
    containerRef.current.innerHTML = "";

    // Create QR code with styling
    const qrCode = new QRCodeStyling({
      width: options.width || 300,
      height: options.height || 300,
      type: "svg",
      data: options.data,
      dotsOptions: {
        color: "#374151",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        color: "#374151",
        type: "rounded",
      },
      cornersDotOptions: {
        color: "#374151",
        type: "rounded",
      },
    });

    // Render QR code
    qrCode.append(containerRef.current);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [options, containerRef]);
}