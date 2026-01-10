"use client";

import Image from "next/image";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {/* Illustration */}
        <div className="flex-shrink-0">
          <div className="relative w-72 h-72 md:w-90 md:h-90 lg:w-120 lg:h-120">
            <Image
              src="/404.png"
              alt="Page not found"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            OOPS! PAGE
            <br />
            NOT FOUND.
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-sm mb-8">
            Looks like this page made hijrah and forgot to
            leave a forwarding address.
          </p>
          <a
            href="/"
            className="inline-block bg-theme-gradient hover:bg-theme-gradient/90 text-white font-semibold px-10 py-3 rounded-xl transition-colors uppercase tracking-wide"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
