"use client";

import { Movie } from "@/typings";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";
import MovieLogo from "@/lib/getMovieLogo";
import {
  X,
  Star,
  Calendar,
  Globe,
  TrendingUp,
  Users,
  PlayIcon,
} from "lucide-react";
import { getIndianMoviesByGenre } from "@/lib/getMovies";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import MoviesByGenreCarousel from "./MoviesByGenreCarousel";

interface MovieDetailsDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const getGenreName = async (genreId: string) => {
  const genre = await getIndianMoviesByGenre(genreId);
  return genre;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MovieDetailsDrawer({
  movie,
  isOpen,
  onClose,
}: MovieDetailsDrawerProps) {
  if (!movie) return null;

  const imageUrl = getImagePath(
    movie.backdrop_path || movie.poster_path,
    !!movie.backdrop_path
  );

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      direction="bottom"
    >
      <DrawerContent className="w-[95%] max-w-4xl mx-auto overflow-auto scrollbar-hide rounded-t-xl bg-[#0c0e1a] text-white pt-0">
        {/* Close Button */}
        <div className="absolute right-2 top-2 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/4 relative h-48 md:h-auto">
            <Image
              src={imageUrl}
              alt={movie.title}
              height={1920}
              width={1080}
              className="object-cover object-center h-full w-full"
              priority
            />
          </div>
          <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
            <div>
              <DrawerTitle className="text-base sm:text-lg font-bold">
                {movie.title}
              </DrawerTitle>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-300 text-xs mt-2">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                  {movie.adult ? "18+" : "U/A 13+"}
                </span>
                <span>
                  {movie.original_language === "hi"
                    ? "Hindi"
                    : movie.original_language.toUpperCase()}
                </span>
              </div>

              <p className="mt-2 text-gray-300 text-xs sm:text-sm line-clamp-3 sm:line-clamp-2">
                {movie.overview}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genre_ids?.map((genreId) => (
                  <div
                    key={genreId}
                    className="bg-gray-700 text-white text-xs rounded-full px-3 py-1"
                  >
                    {/* Replace genreId with actual genre name */}
                    {genreId}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-pink-500 px-4 sm:px-5 py-2 text-white text-sm sm:text-base font-semibold rounded-md flex items-center justify-center">
                <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Watch
              </button>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-md text-sm sm:text-base">
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h2 className="font-bold text-lg p-2">More Like This</h2>
          <hr className="border-gray-700" />
        </div>

        <div className="mt-8 px-4 pb-12">
          <MoviesByGenreCarousel movie={movie} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MovieDetailsDrawer;
