"use client";

import React, { useState } from "react";
import { Movie } from "@/typings";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SeatBooking from "./SeatBooking";

interface BookingFormProps {
  movie: Movie;
}

export default function BookingForm({ movie }: BookingFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"dateTime" | "seats">("dateTime");

  // Generate dates for the next 5 days
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: date.toISOString().split("T")[0], // YYYY-MM-DD format
    };
  });

  // Available showtimes
  const times = ["10:00 AM", "1:30 PM", "4:45 PM", "8:00 PM", "10:30 PM"];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setStep("seats");
    }
  };

  if (step === "seats") {
    return (
      <SeatBooking
        movie={movie}
        date={selectedDate!}
        time={selectedTime!}
        onBack={() => setStep("dateTime")}
      />
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Book Tickets</h2>

      <p className="text-gray-300 mb-4">
        Select date and time for "{movie.title}"
      </p>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Select Date</h3>
        <div className="flex flex-wrap gap-2">
          {dates.map((date) => (
            <Button
              key={date.value}
              variant={selectedDate === date.value ? "default" : "outline"}
              className={`min-w-[80px] ${
                selectedDate === date.value ? "bg-red-600" : ""
              }`}
              onClick={() => handleDateSelect(date.value)}
            >
              {date.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Select Time</h3>
        <div className="flex flex-wrap gap-2">
          {times.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={`min-w-[90px] ${
                selectedTime === time ? "bg-red-600" : ""
              }`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      <Button
        className="w-full bg-red-600 hover:bg-red-700"
        disabled={!selectedDate || !selectedTime}
        onClick={handleContinue}
      >
        Continue to Seat Selection
      </Button>
    </div>
  );
}
