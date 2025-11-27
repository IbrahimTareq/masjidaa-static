"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient as createBrowserSupabase } from "@/utils/supabase/client";
import { Tables } from "@/database.types";

type Donation = Tables<"donations">;
type DonationCampaign = Tables<"donation_campaigns">;

interface FundraiserData {
  campaign: DonationCampaign;
  donations: Donation[];
  donationCount: number;
}

/**
 * A hook to provide real-time updates for fundraiser data
 * @param campaignId The ID of the donation campaign
 * @param initialData The initial data to start with
 * @returns Updated fundraiser data and loading state
 */
export function useFundraiserRealtime(
  campaignId: string,
  initialData: FundraiserData
) {
  const [data, setData] = useState<FundraiserData>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchLatestData = useCallback(async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      const supabase = createBrowserSupabase();

      // Fetch updated campaign data
      const [campaignResult, donationsResult] = await Promise.all([
        supabase
          .from("donation_campaigns")
          .select("*")
          .eq("id", campaignId)
          .single(),
        supabase
          .from("donations")
          .select("*")
          .eq("campaign_id", campaignId)
          .order("created_at", { ascending: false })
          .limit(10), // Get top 10 recent donations
      ]);

      if (campaignResult.error) {
        console.error("Error fetching campaign:", campaignResult.error);
        return;
      }

      if (donationsResult.error) {
        console.error("Error fetching donations:", donationsResult.error);
        return;
      }

      // Count total donations for this campaign
      const { count } = await supabase
        .from("donations")
        .select("*", { count: "exact", head: true })
        .eq("campaign_id", campaignId);

      setData({
        campaign: campaignResult.data,
        donations: donationsResult.data || [],
        donationCount: count || 0,
      });
    } catch (error) {
      console.error("Error fetching fundraiser data:", error);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return;

    const supabase = createBrowserSupabase();

    const channel = supabase
      .channel(`fundraiser-${campaignId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "donation_campaigns",
          filter: `id=eq.${campaignId}`,
        },
        () => {
          fetchLatestData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "donations",
          filter: `campaign_id=eq.${campaignId}`,
        },
        () => {
          fetchLatestData();
        }
      )
      .subscribe();

    return () => {
      console.log(`Unsubscribing from fundraiser updates for campaign ${campaignId}`);
      supabase.removeChannel(channel);
    };
  }, [campaignId, fetchLatestData]);

  return {
    ...data,
    loading,
    refetch: fetchLatestData,
  };
}