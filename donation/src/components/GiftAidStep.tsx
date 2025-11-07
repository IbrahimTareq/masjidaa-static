"use client";

import { formatCurrency } from "@/utils/currency";
import Image from "next/image";
import { ExtendedDonationStep } from "../hooks/useDonationForm";
import { useDonationGiftAid } from "../hooks/useDonationGiftAid";
import {
  DonationButton,
  DonationCheckbox,
  DonationStepLayout
} from "./ui";

interface GiftAidStepProps {
  onSubmit: (giftAidDeclared: boolean) => void;
  onBack: () => void;
  isLoading?: boolean;
  currentStep?: ExtendedDonationStep;
  donationAmount?: number; // Added prop for donation amount
}

export default function GiftAidStep({
  onSubmit,
  onBack,
  isLoading = false,
  currentStep = "gift_aid",
  donationAmount = 0,
}: GiftAidStepProps) {
  const {
    giftAidDeclared,
    setGiftAidDeclared,
    handleSubmit,
  } = useDonationGiftAid({
    onSubmit,
  });
  
  // Calculate Gift Aid amount (25% of donation amount)
  const giftAidAmount = donationAmount * 0.25;
  const totalAmount = donationAmount + giftAidAmount;
  
  return (
    <DonationStepLayout
      title="Boost your donation with Gift Aid"
      onBack={onBack}
      currentStep={currentStep}
    >
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="space-y-3 md:space-y-4">
          <div className="rounded-lg">
            <h3 className="font-medium text-theme mb-2 text-sm md:text-base">
              Make your donation go 25% further – at no extra cost.
            </h3>
            
            {/* Gift Aid Summary Box */}
            <div className="border border-gray-200 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
              <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Your donation</p>
                  <p className="text-gray-900 text-base md:text-xl font-semibold">
                    {formatCurrency({ amount: donationAmount, currency: 'GBP', decimals: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-theme text-xs md:text-sm">Gift Aid boost</p>
                  <p className="text-theme text-base md:text-xl font-semibold">
                    + {formatCurrency({ amount: giftAidAmount, currency: 'GBP', decimals: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Total received</p>
                  <p className="text-gray-900 text-base md:text-xl font-semibold">
                    {formatCurrency({ amount: totalAmount, currency: 'GBP', decimals: 2 })}
                  </p>
                </div>
              </div>
            </div>
            
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
            <Image src="/gift-aid.svg" alt="Gift Aid" width={160} height={60} className="w-32 md:w-40 h-auto" />
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