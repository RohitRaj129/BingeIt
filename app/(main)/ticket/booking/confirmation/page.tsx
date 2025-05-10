"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Ticket, HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-3">Booking Confirmed!</h1>

        <p className="text-gray-300 mb-8">
          Your tickets have been booked successfully. A confirmation has been
          sent to your email.
        </p>

        <div className="bg-gray-700 p-6 rounded-lg mb-8">
          <div className="border-b border-dashed border-gray-500 pb-4 mb-4">
            <div className="flex items-center justify-center mb-4">
              <Ticket className="h-5 w-5 mr-2 text-red-600" />
              <h2 className="font-bold">Booking Details</h2>
            </div>
            <p className="text-gray-300 text-sm mb-1">
              Confirmation #: BNG-{Math.floor(Math.random() * 1000000)}
            </p>
            <p className="text-gray-300 text-sm">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mb-4">
            <p className="font-medium mb-1">Important Information:</p>
            <ul className="text-sm text-gray-300 text-left list-disc list-inside">
              <li>Please arrive 15 minutes before showtime</li>
              <li>Present your confirmation email or ID at the counter</li>
              <li>Outside food and beverages are not allowed</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => router.push("/dashboard")}
          >
            <Ticket className="h-4 w-4 mr-2" />
            View My Tickets
          </Button>

          <Link href="/home" passHref>
            <Button variant="outline">
              <HomeIcon className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
