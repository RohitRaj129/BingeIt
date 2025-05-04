"use client";

import React, { useState } from "react";
import { Movie } from "@/typings";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SeatBookingProps {
  movie: Movie;
  date: string;
  time: string;
  onBack: () => void;
}

// Define seat status types
type SeatStatus = "available" | "selected" | "booked";

export default function SeatBooking({
  movie,
  date,
  time,
  onBack,
}: SeatBookingProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Create a theater layout - 8 rows (A-H) with 10 seats each
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 10;

  // Simulate some already booked seats
  const bookedSeats = [
    "A1",
    "A2",
    "B5",
    "C8",
    "D3",
    "D4",
    "E7",
    "F2",
    "F3",
    "F4",
    "G10",
    "H1",
    "H2",
  ];

  const getSeatStatus = (seat: string): SeatStatus => {
    if (bookedSeats.includes(seat)) return "booked";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  };

  const handleSeatClick = (seat: string) => {
    const status = getSeatStatus(seat);

    if (status === "booked") return; // Can't select booked seats

    if (status === "selected") {
      // Deselect the seat
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      // Select the seat (maximum 6 seats per booking)
      if (selectedSeats.length >= 6) {
        toast.error("You can select a maximum of 6 seats");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    // In a real app, this would call an API to book the seats
    toast.success(
      `Successfully booked ${selectedSeats.length} seat(s) for ${movie.title}`
    );

    // Simulate redirect to confirmation page
    setTimeout(() => {
      router.push("/ticket/booking/confirmation");
    }, 1500);
  };

  const calculateTotal = () => {
    const basePrice = 12.99; // Base ticket price
    return (basePrice * selectedSeats.length).toFixed(2);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-4 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-bold">Select Seats</h2>
      </div>

      <div className="text-sm text-gray-400 mb-6">
        <p>
          {movie.title} | {date} | {time}
        </p>
      </div>

      {/* Screen */}
      <div className="relative mb-8">
        <div className="h-2 w-full bg-gray-500 rounded mb-1"></div>
        <p className="text-xs text-center text-gray-400">SCREEN</p>
      </div>

      {/* Seat Layout */}
      <div className="mb-8">
        {rows.map((row) => (
          <div key={row} className="flex mb-2 items-center">
            <div className="w-6 text-center text-sm mr-2">{row}</div>
            <div className="flex flex-1 justify-center gap-1">
              {Array.from({ length: seatsPerRow }, (_, idx) => {
                const seatNumber = idx + 1;
                const seat = `${row}${seatNumber}`;
                const status = getSeatStatus(seat);

                return (
                  <button
                    key={seat}
                    className={`
                      h-7 w-7 rounded-t-md text-xs
                      ${
                        status === "available"
                          ? "bg-gray-600 hover:bg-gray-500"
                          : ""
                      }
                      ${status === "selected" ? "bg-red-600" : ""}
                      ${
                        status === "booked"
                          ? "bg-gray-800 border border-gray-700 cursor-not-allowed opacity-50"
                          : ""
                      }
                    `}
                    onClick={() => handleSeatClick(seat)}
                    disabled={status === "booked"}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
            <div className="w-6 text-center text-sm ml-2">{row}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center">
          <div className="h-5 w-5 bg-gray-600 rounded-t-md mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="h-5 w-5 bg-red-600 rounded-t-md mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="h-5 w-5 bg-gray-800 border border-gray-700 rounded-t-md mr-2 opacity-50"></div>
          <span>Booked</span>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="font-medium mb-3">Booking Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Movie:</span>
          <span>{movie.title}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Date & Time:</span>
          <span>
            {date} | {time}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Selected Seats:</span>
          <span>
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </span>
        </div>
        <div className="flex justify-between font-bold mt-3">
          <span>Total:</span>
          <span>${calculateTotal()}</span>
        </div>
      </div>

      <Button
        className="w-full bg-red-600 hover:bg-red-700 mt-4"
        disabled={selectedSeats.length === 0}
        onClick={handleBooking}
      >
        {selectedSeats.length > 0
          ? `Book ${selectedSeats.length} Seat${
              selectedSeats.length > 1 ? "s" : ""
            } • $${calculateTotal()}`
          : "Select at least one seat"}
      </Button>
    </div>
  );
}
