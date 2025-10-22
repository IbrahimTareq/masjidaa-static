"use client";

import { useEffect, useState } from "react";
import { checkGiftAidEligibility } from "@/lib/server/actions/taxInfoActions";

interface TaxInfo {
  showGiftAid: boolean;
  addressRequired: boolean;
  loading: boolean;
}

export function useTaxInfo(masjidId: string): TaxInfo {
  const [taxInfo, setTaxInfo] = useState<Omit<TaxInfo, "loading">>({
    showGiftAid: false,
    addressRequired: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxInfo = async () => {
      try {
        const info = await checkGiftAidEligibility(masjidId);
        setTaxInfo(info);
      } catch (error) {
        console.error("Error fetching tax info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxInfo();
  }, [masjidId]);

  return { ...taxInfo, loading };
}
