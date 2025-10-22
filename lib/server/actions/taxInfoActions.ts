"use server";

import { getMasjidTaxInfo, shouldShowGiftAid, isAddressRequiredForGiftAid } from "../services/taxInfoService";

export async function fetchMasjidTaxInfo(masjidId: string) {
  return getMasjidTaxInfo(masjidId);
}

export async function checkGiftAidEligibility(masjidId: string) {
  const showGiftAid = await shouldShowGiftAid(masjidId);
  const addressRequired = await isAddressRequiredForGiftAid(masjidId);
  
  return {
    showGiftAid,
    addressRequired
  };
}
