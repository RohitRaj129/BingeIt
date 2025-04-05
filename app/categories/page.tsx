"use client";

import React from "react";
import Link from "next/link";
import {
  Film,
  Tv,
  Laugh,
  Ghost,
  Heart,
  Star,
  Music,
  Gamepad,
  Globe,
} from "lucide-react";

export default function CategoriesPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-white">Categories</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        <Link
          href="/movies"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Film className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            Movies
          </span>
        </Link>
        <Link
          href="/categories/tv-shows"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Tv className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            TV Shows
          </span>
        </Link>
        <Link
          href="/categories/comedy"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Laugh className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            Comedy
          </span>
        </Link>
        <Link
          href="/categories/horror"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Ghost className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            Horror
          </span>
        </Link>
        <Link
          href="/categories/romance"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Heart className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            Romance
          </span>
        </Link>
        <Link
          href="/categories/top-rated"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Star className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            Top Rated
          </span>
        </Link>
        <Link
          href="/categories/music"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Music className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            Music
          </span>
        </Link>
        <Link
          href="/categories/gaming"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Gamepad className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            Gaming
          </span>
        </Link>
        <Link
          href="/categories/international"
          className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
        >
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            <Globe className="h-6 w-6" />
          </div>
          <span className="text-sm transform transition-transform duration-300 group-hover:scale-110">
            International
          </span>
        </Link>
      </div>
    </main>
  );
}
