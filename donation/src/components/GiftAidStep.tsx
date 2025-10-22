"use client";

import React, { useState } from "react";
import { BeatLoader } from "react-spinners";

interface GiftAidStepProps {
  onSubmit: (giftAidDeclared: boolean) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function GiftAidStep({
  onSubmit,
  onBack,
  isLoading = false,
}: GiftAidStepProps) {
  const [giftAidDeclared, setGiftAidDeclared] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(giftAidDeclared);
  };

  return (
    <div className="p-5 pb-4">
      <div className="flex justify-between items-center mb-8">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          ← Back
        </button>
        <div className="text-lg font-medium">Gift Aid Declaration</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="rounded-lg">
            <h3 className="font-medium text-theme mb-2">
              Make your donation go 25% further – at no extra cost.
            </h3>
            <p className="text-sm">
              By applying Gift Aid to your donation, you acknowledge that you
              are a UK taxpayer and understand that if you pay less income
              and/or Capital Gains Tax than the amount of Gift Aid claimed on
              all your donations in the relevant tax year, it is your
              responsibility to pay any difference.{" "}
              <a
                href="https://www.gov.uk/donating-to-charity/gift-aid"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Learn more
              </a>
              .
            </p>
          </div>

          <div className="flex justify-start">
            <img src="/gift-aid.svg" alt="Gift Aid" className="w-40 h-auto" />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="giftAidDeclared"
                  checked={giftAidDeclared}
                  onChange={(e) => setGiftAidDeclared(e.target.checked)}
                  className="rounded border-gray-300 text-[var(--theme-color)] focus:ring-[var(--theme-color)]"
                />
              </div>
              <span>Claim Gift Aid on this donation.</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-theme hover:bg-theme-gradient disabled:bg-theme-accent text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isLoading ? <BeatLoader color="#fff" size={8} /> : "Continue"}
        </button>
      </form>
    </div>
  );
}
