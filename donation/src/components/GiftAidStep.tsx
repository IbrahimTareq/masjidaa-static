"use client";

import React from "react";
import { useDonationGiftAid } from "../hooks/useDonationGiftAid";
import { 
  DonationStepLayout, 
  DonationButton,
  DonationCheckbox
} from "./ui";
import { ExtendedDonationStep } from "../hooks/useDonationForm";

interface GiftAidStepProps {
  onSubmit: (giftAidDeclared: boolean) => void;
  onBack: () => void;
  isLoading?: boolean;
  currentStep?: ExtendedDonationStep;
}

export default function GiftAidStep({
  onSubmit,
  onBack,
  isLoading = false,
  currentStep = "gift_aid",
}: GiftAidStepProps) {
  const {
    giftAidDeclared,
    setGiftAidDeclared,
    handleSubmit,
  } = useDonationGiftAid({
    onSubmit,
  });

  return (
    <DonationStepLayout
      title="Gift Aid Declaration"
      onBack={onBack}
      currentStep={currentStep}
    >
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

          <DonationCheckbox
            id="giftAidDeclared"
            checked={giftAidDeclared}
            onChange={(e) => setGiftAidDeclared(e.target.checked)}
            label="Claim Gift Aid on this donation."
            className="pt-2"
          />
        </div>

        <DonationButton
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          fullWidth
        >
          Continue
        </DonationButton>
      </form>
    </DonationStepLayout>
  );
}