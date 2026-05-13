import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { plan, userId, paymentId, orderId } = await req.json();

  console.log("Confirm payment request:", { plan, userId, paymentId, orderId });

  if (!userId || !plan) {
    return NextResponse.json(
      { error: "Missing required fields", userId, plan },
      { status: 400 }
    );
  }

  try {
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("plan_name", plan)
      .single();

    console.log("Subscription lookup:", { subscription, subError });

    if (subError || !subscription) {
      console.error("Plan lookup error:", subError);
      return NextResponse.json({ 
        error: "Plan not found in database",
        searched_plan: plan,
        db_error: subError?.message 
      }, { status: 500 });
    }

    const { error: updateError } = await supabase.from("user_plans").upsert({
      user_id: userId,
      subscription_id: subscription.id,
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      updated_at: new Date().toISOString(),
    });

    console.log("User plan update:", { updateError });

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update plan", details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}