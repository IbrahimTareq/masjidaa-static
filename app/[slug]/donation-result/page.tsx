"use client";

import React from "react";
import Confetti from "react-confetti";

import LoadingPage from "@/components/client/ui/LoadingPage";
import ShareSection from "@/components/client/ui/ShareSection";
import { formatCurrency } from "@/utils/currency";
import { AlertCircle, Check } from "lucide-react";

import { useRouter } from "next/navigation";

import { useMasjidContext } from "@/context/masjidContext";
import { DonationMeta, usePaymentStatus } from "@/hooks/usePaymentStatus";
import { DOMAIN_NAME } from "@/utils/shared/constants";

// Success message component
const SuccessMessage: React.FC<{
  masjidName: string;
  masjidLogo?: string;
  donorName?: string | null;
  amount?: string | null;
  currency: string;
}> = ({ masjidName, masjidLogo, donorName, amount, currency }) => (
  <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
    <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
      <img
        src={masjidLogo || ""}
        alt={masjidName}
        className="w-full h-full object-contain border-2 border-theme rounded-full"
      />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      {donorName ? `${donorName}, ` : ""}Jazakallah khair for your donation
    </h2>
    {amount && (
      <p className="text-gray-600 flex items-center justify-center gap-2 text-lg mb-2">
        <Check className="w-5 h-5 text-green-500" />
        You donated{" "}
        {formatCurrency({
          amount: Number(amount),
          currency: currency,
        })}
      </p>
    )}
    <p className="text-sm text-gray-500">
      A donation receipt has been emailed to you. You can view and manage your
      donations via the&nbsp;
      <a
        href="https://donor.masjidaa.com/"
        className="text-theme hover:text-theme-gradient"
      >
        donor portal.
      </a>
    </p>
  </div>
);

// Processing message component
const ProcessingMessage = () => (
  <div className="bg-white rounded-2xl py-20 text-center mb-6">
    <div className="flex justify-center mb-4">
      <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-theme animate-spin"></div>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      Your donation is being processed
    </h2>
    <p className="text-sm text-gray-500">
      This may take a few moments. You'll receive an email confirmation once the
      transaction is complete.
    </p>
  </div>
);

// Failed message component
const FailedMessage: React.FC<{
  masjidName: string;
  masjidLogo?: string;
  errorMessage?: string;
}> = ({ masjidName, masjidLogo, errorMessage }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
        <img
          src={masjidLogo || ""}
          alt={masjidName}
          className="w-full h-full object-contain border-2 border-theme rounded-full"
        />
      </div>
      <div className="flex justify-center mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation Failed</h2>
      <p className="text-gray-500 mb-4">
        We encountered an issue processing your donation.
      </p>
      {errorMessage && (
        <p className="text-sm bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {errorMessage}
        </p>
      )}
      <div className="mt-6">
        <a
          href="#"
          onClick={() => router.back()}
          className="px-6 py-3 bg-theme hover:bg-theme-gradient text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </a>
      </div>
    </div>
  );
};

export default function DonationResult() {
  const masjid = useMasjidContext();
  const { status, isLoading, error } = usePaymentStatus();

  // Show loading state while determining payment status
  if (!masjid) {
    return <LoadingPage />;
  }

  // Try to get donation metadata (common to both one-off and recurring)
  const rawDonationMeta = sessionStorage.getItem("donationMeta");
  const donationMeta = rawDonationMeta
    ? (JSON.parse(rawDonationMeta) as DonationMeta)
    : null;

  const currency = donationMeta?.currency || masjid.local_currency;
  const name = donationMeta?.first_name || "";
  const shortLink = donationMeta?.short_link || "";

  const shareUrl = shortLink
    ? `${DOMAIN_NAME}/r/${shortLink}`
    : window.location.origin;

  // Format amount for display
  const amount = donationMeta?.amount_cents
    ? String(Math.round(Number(donationMeta.amount_cents) / 100))
    : null;

  if (isLoading) {
    return (
      <ProcessingMessage />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black">
      {/* Confetti overlay on successful donation */}
      {status === "success" && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={900}
          initialVelocityY={20}
          recycle={false}
          gravity={0.2}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Render the appropriate component based on status */}
        {status === "success" && (
          <>
            <SuccessMessage
              masjidName={masjid.name}
              masjidLogo={masjid.logo || undefined}
              donorName={name || undefined}
              amount={amount || undefined}
              currency={currency}
            />
            <ShareSection
              entityName={masjid.name}
              title="Reach more donors by sharing"
              shareUrl={shareUrl}
              showQuote={true}
              iconSize="medium"
            />
          </>
        )}

        {status === "processing" && (
          <ProcessingMessage />
        )}

        {status === "failed" && (
          <FailedMessage
            masjidName={masjid.name}
            masjidLogo={masjid.logo || undefined}
            errorMessage={error}
          />
        )}
      </div>
    </div>
  );
}
