import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  let event: any;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    event = JSON.parse(body);
  } catch (err: any) {
    console.log("Webhook Error:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const notes = payment.notes || {};
    const userId = notes.userId;
    const planName = notes.plan;

    if (!userId || !planName) {
      console.error("Missing notes in payment:", { userId, planName });
      return NextResponse.json(
        { error: "Missing userId or plan metadata" },
        { status: 400 }
      );
    }

    console.log(`✅ Payment successful for user ${userId}, plan ${planName}`);

    const { data: plan, error: planError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("plan_name", planName)
      .single();

    if (planError) {
      console.error("Plan lookup error:", planError);
      return NextResponse.json({ error: "Plan not found" }, { status: 500 });
    }

    const { error: updateError } = await supabase.from("user_plans").upsert({
      user_id: userId,
      subscription_id: plan.id,
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
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

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    console.log("Payment failed:", payment);
  }

  return NextResponse.json({ received: true });
}