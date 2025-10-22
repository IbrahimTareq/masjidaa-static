import { createClient } from "@/utils/supabase/server";

export interface MasjidTaxInfo {
  id: string;
  masjid_id: string;
  country_code: string;
  is_tax_deductible: boolean;
  scheme_name: string;
  registration_number: string | null;
  declaration_required: boolean;
  address_required: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export async function getMasjidTaxInfo(masjidId: string): Promise<MasjidTaxInfo | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("masjid_tax_info")
    .select("*")
    .eq("masjid_id", masjidId)
    .single();

  if (error || !data) {
    console.error("Error fetching masjid tax info:", error);
    return null;
  }

  return data as MasjidTaxInfo;
}

export async function shouldShowGiftAid(masjidId: string): Promise<boolean> {
  const taxInfo = await getMasjidTaxInfo(masjidId);
  
  if (!taxInfo) {
    return false;
  }
  
  return (
    taxInfo.country_code === "GB" && 
    taxInfo.scheme_name === "GIFT_AID" && 
    taxInfo.declaration_required
  );
}

export async function isAddressRequiredForGiftAid(masjidId: string): Promise<boolean> {
  const taxInfo = await getMasjidTaxInfo(masjidId);
  
  if (!taxInfo) {
    return false;
  }
  
  return (
    taxInfo.country_code === "GB" && 
    taxInfo.scheme_name === "GIFT_AID" && 
    taxInfo.address_required
  );
}
