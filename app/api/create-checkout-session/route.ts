import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const { plan, userId } = await req.json();

  const priceMap: Record<string, number> = {
    Super: 89900,
    Premium: 139900,
  };

  if (!priceMap[plan]) {
    return NextResponse.json(
      { error: "Invalid plan selected." },
      { status: 400 }
    );
  }

  try {
    const order = await razorpay.orders.create({
      amount: priceMap[plan],
      currency: "INR",
      receipt: `rcpt_${userId.slice(0, 10)}_${Date.now().toString().slice(-8)}`,
      notes: {
        userId,
        plan,
      },
    });

    console.log("Razorpay order created:", order);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Razorpay error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create order",
        details: error.message || String(error),
        code: error.code 
      },
      { status: 500 }
    );
  }
}