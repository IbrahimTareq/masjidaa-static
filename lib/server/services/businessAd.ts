import { createClient } from "@/utils/supabase/server";

export interface BusinessAd {
  image: string | null;
  message: string | null;
  name: string | null;
  website: string | null;
  contact_email: string | null;
  address: string | null;
  contact_number: string | null;
}

export async function getBusinessAdById(
  id: string
): Promise<BusinessAd | null> {
  const supabase = await createClient();

  // Fetch joined data
  const { data, error } = await supabase
    .from("ad_requests")
    .select(
      `
      image,
      message,
      business:business_id (
        name,
        website,
        contact_email,
        address,
        contact_number
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching business ad:", error);
    return null;
  }

  // Handle null data
  if (!data) return null;
  
  // Access the first item in the business array if it exists
  const businessData = Array.isArray(data.business) 
    ? data.business[0] 
    : data.business;
  
  return {
    image: data.image ?? null,
    message: data.message ?? null,
    name: businessData?.name ?? null,
    website: businessData?.website ?? null,
    contact_email: businessData?.contact_email ?? null,
    address: businessData?.address ?? null,
    contact_number: businessData?.contact_number ?? null,
  };
}