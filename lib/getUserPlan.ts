import { supabase } from "./supabaseClient";

export async function getUserPlan(userId: string) {
  const { data, error } = await supabase
    .from("user_plans")
    .select(
      `
      subscription:subscriptions (plan_name, max_popularity, max_devices, ticket_discount)
    `
    )
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user plan:", error);
    return null;
  }

  return data?.subscription;
}
