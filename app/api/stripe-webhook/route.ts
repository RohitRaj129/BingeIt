import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient"; // Use service role key here

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.log(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Received checkout.session.completed event:", session);

    const userId = session.metadata?.userId;
    const planName = session.metadata?.plan;

    if (!userId || !planName) {
      console.error("Missing metadata in session:", { userId, planName });
      return NextResponse.json(
        { error: "Missing userId or plan metadata" },
        { status: 400 }
      );
    }

    console.log(`✅ Payment successful for user ${userId}, plan ${planName}`);

    // Update Supabase user_plans table
    const { data: plan, error: planError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("plan_name", planName)
      .single();

    if (planError) {
      console.error("Plan lookup error:", planError);
      return NextResponse.json({ error: "Plan not found" }, { status: 500 });
    }

    console.log("Plan found:", plan);

    // ✅ FIXED: Always include user_id inside upsert object (eq() doesn't work with upsert)
    const { error: updateError } = await supabase.from("user_plans").upsert({
      user_id: userId, // ✅ This ensures user_id is saved correctly
      subscription_id: plan.id,
      updated_at: new Date().toISOString(),
    });

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update plan" },
        { status: 500 }
      );
    }

    console.log("✅ User plan updated successfully in Supabase!");
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    console.log("Received customer.subscription.updated event:", subscription);

    const stripeCustomerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;

    if (!stripeCustomerId || !priceId) {
      console.error("Missing customer ID or price ID in subscription update");
      return NextResponse.json(
        { error: "Missing customer ID or price ID" },
        { status: 400 }
      );
    }

    // Find the plan corresponding to the Stripe price ID
    const { data: plan, error: planError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("stripe_price_id", priceId)
      .single();

    if (planError || !plan) {
      console.error(
        "Plan lookup error or plan not found for price ID:",
        priceId,
        planError
      );
      return NextResponse.json({ error: "Plan not found" }, { status: 500 });
    }

    // Find the user_plan record for this Stripe customer ID
    const { data: userPlan, error: userPlanError } = await supabase
      .from("user_plans")
      .select("user_id")
      .eq("stripe_customer_id", stripeCustomerId)
      .single();

    if (userPlanError || !userPlan) {
      console.error(
        "User plan lookup error or user plan not found for customer ID:",
        stripeCustomerId,
        userPlanError
      );
      return NextResponse.json(
        { error: "User plan not found" },
        { status: 500 }
      );
    }

    // Update the user_plans table with the new subscription_id
    const { error: updateError } = await supabase
      .from("user_plans")
      .update({
        subscription_id: plan.id,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userPlan.user_id);

    if (updateError) {
      console.error(
        "Failed to update user plan on subscription update:",
        updateError
      );
      return NextResponse.json(
        { error: "Failed to update user plan" },
        { status: 500 }
      );
    }

    console.log(
      `✅ User plan updated successfully for user ${userPlan.user_id} on subscription update!`
    );
  }

  return NextResponse.json({ received: true });
}
