import type { Tables } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export async function getMasjidBankAccountById(
  masjidBankAccountId: string
): Promise<Tables<"masjid_bank_accounts"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjid_bank_accounts")
    .select("*")
    .eq("id", masjidBankAccountId)
    .single();

  if (error) {
    console.error("Error fetching masjid bank account", error);
    return null;
  }
  return data;
}