import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: NextRequest) {
  const { userId, newPlanName } = await req.json();

  // ✅ 1. Get user stripe_customer_id + current subscription
  const { data: userPlan, error: userError } = await supabase
    .from("user_plans")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (userError || !userPlan) {
    console.error("❌ User not found");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const customerId = userPlan.stripe_customer_id;

  // ✅ 2. Get active subscription from Stripe
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  if (!subscriptions.data.length) {
    console.error("❌ No active subscription found");
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 404 }
    );
  }

  const subscription = subscriptions.data[0];
  const subscriptionItemId = subscription.items.data[0].id;

  console.log("✅ Found active subscription:", subscription.id);

  // ✅ 3. Lookup new plan price_id from subscriptions table
  const { data: plan, error: planError } = await supabase
    .from("subscriptions")
    .select("price_id")
    .eq("plan_name", newPlanName)
    .single();

  if (planError || !plan) {
    console.error("❌ New plan not found");
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const newPriceId = plan.price_id;

  // ✅ 4. Update Stripe subscription to new plan (with proration)
  const updatedSubscription = await stripe.subscriptions.update(
    subscription.id,
    {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations", // ✅ Charge price difference only!
    }
  );

  console.log("✅ Subscription upgraded:", updatedSubscription.id);

  return NextResponse.json({ success: true });
}
