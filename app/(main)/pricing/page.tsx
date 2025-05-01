"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function Pricing() {
  const router = useRouter();

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
        console.log("Checkout Session Response:", data); // 👈 log the full response

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("No URL returned from checkout session");
        }
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
