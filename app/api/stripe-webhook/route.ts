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
    const userId = session.metadata?.userId;
    const planName = session.metadata?.plan;

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

    const { error: updateError } = await supabase
      .from("user_plans")
      .update({
        subscription_id: plan.id,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update plan" },
        { status: 500 }
      );
    }

    console.log("✅ User plan updated successfully in Supabase!");
  }

  return NextResponse.json({ received: true });
}
