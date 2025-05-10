import React from "react";
import TicketCarouselBanner from "./_components/TicketCarouselBanner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function TicketPage() {
  return (
    <div>
      <TicketCarouselBanner />

      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Movie Tickets</h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Browse the latest movies and book your tickets for an unforgettable
          cinema experience.
        </p>

        <Link href="/ticket/movie-selection">
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
            Browse Movies
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default TicketPage;
