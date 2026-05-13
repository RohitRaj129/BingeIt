"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Pricing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const razorpayLoaded = useRef(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      razorpayLoaded.current = true;
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");
    const plan = searchParams.get("plan");

    if (success === "true" && plan) {
      toast.success(`🎉 Congratulations! You've upgraded to ${plan} Plan!`);

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    }
  }, [searchParams, router]);

  async function handlePlanSelect(planName: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (planName === "Free") {
      const { error } = await supabase
        .from("user_plans")
        .upsert({ user_id: user.id, plan: "Free" }, { onConflict: "user_id" });

      if (!error) {
        router.push("/home");
      } else {
        console.error("Error updating plan:", error);
      }
    } else if (planName === "Super" || planName === "Premium") {
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan: planName, userId: user.id }),
        });

        const data = await response.json();
        console.log("Checkout Response:", data);

        if (!response.ok) {
          console.error("API error:", data.error);
          toast.error(data.error || "Failed to create order");
          return;
        }

        if (!window.Razorpay) {
          toast.error("Razorpay not loaded. Please refresh and try again.");
          return;
        }

        const razorpay = new window.Razorpay({
          key: data.keyId,
          order_id: data.orderId,
          handler: async function (response: any) {
            console.log("Payment success:", response);

            const confirmRes = await fetch("/api/confirm-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan: planName,
                userId: user.id,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              }),
            });

            if (confirmRes.ok) {
              toast.success(`🎉 Congratulations! You've upgraded to ${planName} Plan!`);
              setTimeout(() => {
                router.push("/home");
              }, 2000);
            }
          },
        });

        razorpay.open();
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    }
  }

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-semibold sm:text-5xl">
            Unlimited Entertainment, One Perfect Plan for You!
          </h1>
          <p className="text-sm sm:text-base">
            Choose a plan and start watching your favorite movies & series
            today. Switch plans anytime — No commitments!
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Free</CardTitle>
              <span className="my-3 block text-2xl font-semibold">
                ₹0 / year
              </span>
              <CardDescription className="text-sm">Per user</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Access to selected free movies & TV shows",
                  "Watch on 1 device at a time",
                  "Get personalized recommendations",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handlePlanSelect("Free")}
              >
                Start Watching Free
              </Button>
            </CardFooter>
          </Card>

          {/* Super Plan */}
          <div className="relative">
            <div className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
              Popular
            </div>
            <Card className="flex flex-col pt-6">
              <CardHeader>
                <CardTitle className="font-medium">Super</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  ₹899 / year
                </span>
                <CardDescription className="text-sm">Per user</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Everything in Free Plan",
                    "Unlock all movies & TV shows",
                    "Stream on up to 2 devices simultaneously",
                    "Early access to new releases",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button
                  className="w-full"
                  onClick={() => handlePlanSelect("Super")}
                >
                  Upgrade to Super
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Premium Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Premium</CardTitle>
              <span className="my-3 block text-2xl font-semibold">
                ₹1399 / year
              </span>
              <CardDescription className="text-sm">Per user</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Super Plan",
                  "Stream on up to 4 devices simultaneously",
                  "Get 10% OFF on ticket bookings",
                  "Watch in 4K Ultra HD (where available)",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handlePlanSelect("Premium")}
              >
                Upgrade to Premium
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}