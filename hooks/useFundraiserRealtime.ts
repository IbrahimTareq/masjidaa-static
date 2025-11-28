"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient as createBrowserSupabase } from "@/utils/supabase/client";
import { Tables } from "@/database.types";

type DonationPublic = Tables<"donations_public">;
type DonationCampaign = Tables<"donation_campaigns">;
type FundraiserSession = Tables<"fundraiser_sessions">;

interface FundraiserData {
  session: FundraiserSession;
  campaign: DonationCampaign;
  donations: DonationPublic[];
  donationCount: number;
}

/**
 * A hook to provide real-time updates for fundraiser data
 * @param sessionId The ID of the fundraiser session
 * @param initialData The initial data to start with
 * @returns Updated fundraiser data and loading state
 */
export function useFundraiserRealtime(
  sessionId: string,
  initialData: FundraiserData
) {
  const [data, setData] = useState<FundraiserData>(initialData);
  const [loading, setLoading] = useState(false);

  const campaignId = data.session.campaign_id;

  const fetchLatestData = useCallback(async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const supabase = createBrowserSupabase();

      // Fetch updated session, campaign, and donations data
      const [sessionResult, campaignResult, donationsResult] = await Promise.all([
        supabase
          .from("fundraiser_sessions")
          .select("*")
          .eq("id", sessionId)
          .single(),
        supabase
          .from("donation_campaigns")
          .select("*")
          .eq("id", campaignId)
          .single(),
        supabase
          .from("donations_public")
          .select("*")
          .eq("campaign_id", campaignId)
          .order("created_at", { ascending: false })
          .limit(10), // Get top 10 recent donations
      ]);

      if (sessionResult.error) {
        console.error("Error fetching session:", sessionResult.error);
        return;
      }

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
        session: sessionResult.data,
        campaign: campaignResult.data,
        donations: donationsResult.data || [],
        donationCount: count || 0,
      });
    } catch (error) {
      console.error("Error fetching fundraiser data:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, campaignId]);

  useEffect(() => {
    if (!sessionId || !campaignId) return;

    const supabase = createBrowserSupabase();

    const channel = supabase
      .channel(`fundraiser-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fundraiser_sessions",
          filter: `id=eq.${sessionId}`,
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
      supabase.removeChannel(channel);
    };
  }, [sessionId, campaignId, fetchLatestData]);

  return {
    ...data,
    loading,
    refetch: fetchLatestData,
  };
}