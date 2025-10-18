"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function AccessDeniedPageContent() {
  const params = useSearchParams();
  const plan = params.get("plan") ?? "starter";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-theme flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          Access Restricted
        </h1>
        <p className="text-gray-600 mb-8">
          You are currently on the{" "}
          <strong>{plan.charAt(0).toUpperCase() + plan.slice(1)}</strong> plan.
          <br />
          Please upgrade to unlock this feature and enjoy full access.
        </p>

        <Link
          href="https://admin.masjidaa.com/account-management"
          className="inline-flex items-center gap-2 bg-theme text-white px-5 py-2.5 rounded-full font-medium hover:bg-theme-gradient transition-colors"
        >
          Upgrade Plan <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <AccessDeniedPageContent />
    </Suspense>
  );
}
