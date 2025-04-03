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
import { X, Star, Calendar, Globe, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface MovieDetailsDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

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
  // Use internal state to handle drawer open state
  const [open, setOpen] = useState(false);

  // Sync with parent's isOpen prop
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // Handle drawer close
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      onClose();
    }
  };

  if (!movie) return null;

  // Use backdrop_path or fallback to poster_path
  const imageUrl = getImagePath(
    movie.backdrop_path || movie.poster_path,
    !!movie.backdrop_path
  );

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="bottom">
      <DrawerContent className="max-h-[90vh] overflow-auto rounded-t-xl border-t-0 bg-black/95 text-white">
        {/* Pull handle */}
        <div className="mx-auto h-1.5 w-16 rounded-full bg-gray-400/30 mt-2 mb-1"></div>

        {/* Hero section */}
        <div className="relative h-[35vh] md:h-[45vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 z-10" />
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover object-center"
            priority
          />
          <Button
            onClick={() => handleOpenChange(false)}
            className="absolute top-4 right-4 z-20 rounded-full p-2 bg-black/50 hover:bg-black/70 border border-white/20"
            size="icon"
            variant="ghost"
          >
            <X className="h-5 w-5 text-white" />
          </Button>

          {/* Absolutely positioned movie details overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 z-20">
            <DrawerTitle className="sr-only">
              {movie.title} - Movie Details
            </DrawerTitle>

            <div className="mb-3">
              <MovieLogo title={movie.title} />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {movie.vote_average > 0 && (
                <div className="inline-flex items-center px-2 py-1 bg-red-600/90 text-white text-sm rounded-md backdrop-blur-sm">
                  <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                  <span className="font-medium">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}

              <div className="inline-flex items-center px-2 py-1 bg-gray-800/80 text-white text-sm rounded-md backdrop-blur-sm">
                <span className="font-medium">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>

              {movie.original_language === "hi" && (
                <div className="inline-flex items-center px-2 py-1 bg-red-600/90 text-white text-sm rounded-md backdrop-blur-sm">
                  <span className="font-medium">Hindi</span>
                </div>
              )}

              <div className="inline-flex items-center px-2 py-1 bg-gray-800/80 text-white text-sm rounded-md backdrop-blur-sm">
                <span className="font-medium">
                  {movie.adult ? "18+" : "U/A 16+"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="px-6 pb-8">
          {/* Overview section */}
          <div className="mt-6 mb-8">
            <h3 className="text-lg font-semibold mb-3 text-white/90">
              Overview
            </h3>
            <p className="text-white/80 leading-relaxed">
              {movie.overview || "No overview available."}
            </p>
          </div>

          {/* Details section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="flex flex-col">
              <div className="flex items-center text-white/60 mb-1.5">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Release</span>
              </div>
              <p className="text-white font-medium">
                {formatDate(movie.release_date)}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center text-white/60 mb-1.5">
                <Globe className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <p className="text-white font-medium capitalize">
                {movie.original_language === "hi"
                  ? "Hindi"
                  : movie.original_language}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center text-white/60 mb-1.5">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Popularity</span>
              </div>
              <p className="text-white font-medium">
                {movie.popularity.toFixed(0)}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center text-white/60 mb-1.5">
                <Users className="h-4 w-4 mr-1.5" />
                <span className="text-sm font-medium">Votes</span>
              </div>
              <p className="text-white font-medium">
                {movie.vote_count.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action button */}
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-6 rounded-lg transition-all"
            size="lg"
          >
            Watch Now
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MovieDetailsDrawer;
