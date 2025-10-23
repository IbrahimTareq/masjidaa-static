"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

import LoadingPage from "@/components/client/ui/LoadingPage";
import ShareSection from "@/components/client/ui/ShareSection";
import { formatCurrency } from "@/utils/currency";
import { AlertCircle, Check, ChevronDown, ChevronUp } from "lucide-react";

import { useRouter } from "next/navigation";

import { useMasjidContext } from "@/context/masjidContext";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { DOMAIN_NAME } from "@/utils/shared/constants";
import { DotLoader } from "react-spinners";

// Success message component
const SuccessMessage: React.FC<{
  masjid: any;
  donorName?: string | null;
  amount?: string | null;
  currency: string;
  isRecurring?: boolean;
}> = ({ masjid, donorName, amount, currency, isRecurring }) => (
  <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
    <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
      <img
        src={masjid.logo || ""}
        alt={masjid.name}
        className="w-full h-full object-contain border-2 border-theme rounded-full"
      />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      {donorName ? `${donorName}, ` : ""}Jazakallah khair for your donation
    </h2>
    {amount && (
      <p className="text-gray-600 flex items-center justify-center gap-2 text-lg mb-2">
        <Check className="w-5 h-5 text-green-500" />
        You donated&nbsp;
        {formatCurrency({
          amount: parseFloat(amount),
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
      <DotLoader color="var(--theme-color)" size={50} />
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
  masjid: any;
  errorMessage?: string;
  errorDetails?: Record<string, any>;
}> = ({ masjid, errorMessage, errorDetails }) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-6">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
        <img
          src={masjid.logo || ""}
          alt={masjid.name}
          className="w-full h-full object-contain border-2 border-theme rounded-full"
        />
      </div>
      <div className="flex justify-center mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Donation Failed
      </h2>
      <p className="text-gray-500 mb-4">
        We encountered an issue processing your donation.
      </p>
      {errorMessage && (
        <p className="text-sm bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {errorMessage}
        </p>
      )}
      
      {errorDetails && (
        <div className="mb-4 text-left">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm flex items-center justify-center mx-auto text-gray-500 hover:text-gray-700"
          >
            {showDetails ? (
              <>
                Hide technical details <ChevronUp className="ml-1 w-4 h-4" />
              </>
            ) : (
              <>
                Show technical details <ChevronDown className="ml-1 w-4 h-4" />
              </>
            )}
          </button>
          
          {showDetails && (
            <pre className="mt-2 p-3 bg-gray-100 text-xs overflow-auto rounded-lg">
              {JSON.stringify(errorDetails, null, 2)}
            </pre>
          )}
        </div>
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

/**
 * Donation result page - displays the result of a donation payment
 * This is a purely presentational component that shows success, processing, or error states
 */
export default function DonationResult() {
  const masjid = useMasjidContext();
  const [donationMeta, setDonationMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);

  // Get payment status
  const { 
    status: paymentStatus, 
    isLoading: paymentLoading, 
    error: paymentError
  } = usePaymentStatus();

  // Initialize state from session storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Try to get donation metadata
    const rawDonationMeta = sessionStorage.getItem("donationMeta");
    if (rawDonationMeta) {
      try {
        const parsedMeta = JSON.parse(rawDonationMeta);
        setDonationMeta(parsedMeta);
        
        // Check if this was a recurring donation from the URL params
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        setIsRecurring(mode === 'recurring');
      } catch (e) {
        console.error("Error parsing donation metadata", e);
      }
    }

    setIsLoading(false);
  }, []);

  // Show loading state while determining payment status
  if (!masjid || isLoading || paymentLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-black">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <ProcessingMessage />
        </div>
      </div>
    );
  }

  // Get donation details for display
  const currency = donationMeta?.currency || masjid.local_currency;
  const name = donationMeta?.first_name || "";
  const shortLink = donationMeta?.short_link || "";

  const shareUrl = shortLink
    ? `${DOMAIN_NAME}/r/${shortLink}`
    : window.location.origin;

  // Format amount for display
  const amount = donationMeta?.amount_cents
    ? String(Number(donationMeta.amount_cents) / 100)
    : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black">
      {/* Confetti overlay on successful donation */}
      {paymentStatus === "success" && (
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
        {paymentStatus === "success" ? (
          <>
            <SuccessMessage
              masjid={masjid}
              donorName={name || undefined}
              amount={amount || undefined}
              currency={currency}
              isRecurring={isRecurring}
            />
            <ShareSection
              entityName={masjid.name}
              title="Reach more donors by sharing"
              shareUrl={shareUrl}
              showQuote={true}
              iconSize="medium"
            />
          </>
        ) : paymentStatus === "processing" ? (
          <ProcessingMessage />
        ) : (
          <FailedMessage
            masjid={masjid}
            errorMessage={paymentError}
          />
        )}
      </div>
    </div>
  );
}