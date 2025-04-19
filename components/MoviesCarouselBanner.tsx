"use client";

import { Movie } from "@/typings";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";
import MovieLogo from "@/lib/getMovieLogo";
import { useState, useCallback } from "react";
import MovieDetailsDrawer from "./MovieDetailsDrawer";

Autoplay.globalOptions = { delay: 8000 };

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isMovieReleased(releaseDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  const release = new Date(releaseDate);
  return release < today;
}

function MoviesCarouselBanner({ movies }: { movies: Movie[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 100 }, [
    Autoplay(),
  ]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter and sort movies to get only released ones, sorted by release date (newest first)
  const releasedMovies = movies
    .filter((movie) => isMovieReleased(movie.release_date))
    .sort(
      (a, b) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );

  if (releasedMovies.length === 0) {
    return null;
  }

  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      <div className="overflow-hidden lg:mt-0 relative" ref={emblaRef}>
        <div className="flex">
          {releasedMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex-full min-w-0 relative cursor-pointer"
              onClick={() => handleMovieClick(movie)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${movie.title}`}
            >
              <Image
                key={movie.id}
                src={getImagePath(
                  movie.backdrop_path || movie.poster_path || "",
                  !!movie.backdrop_path
                )}
                alt={movie.title}
                width={1920}
                height={1080}
                priority
                className="brightness-[0.7]w-full h-auto object-cover"
              />
              <div className="hidden md:inline absolute mt-0 top-0 pt-40 xl:pt-52 left-0 lg:mt-0 bg-transparent z-20 h-full w-full bg-gradient-to-r from-gray-900/90 to-transparent p-10 space-y-5 text-white">
                <div className="max-w-xl">
                  <MovieLogo title={movie.title} className="mb-6" />
                </div>
                <p className="max-w-xl line-clamp-3 z-50">
                  {movie.overview || "No overview available."}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold bg-red-600 px-2 py-1 rounded">
                    Rating: {movie.vote_average.toFixed(1)}/10
                  </span>
                  <span className="text-sm font-semibold">
                    Release: {formatDate(movie.release_date)}
                  </span>
                  {movie.original_language === "hi" && (
                    <span className="text-sm font-semibold bg-red-600 px-2 py-1 rounded">
                      Hindi
                    </span>
                  )}
                </div>
              </div>
              {/* Mobile overlay */}
              <div className="md:hidden absolute bottom-0 left-0 w-full z-30 px-3 py-3 text-white bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <div className="mb-8">
                  <MovieLogo
                    title={movie.title}
                    className="mb-1 max-w-[80%] h-auto"
                  />
                  <p className="text-[10px] leading-tight line-clamp-2 mb-1">
                    {movie.overview || "No overview available."}
                  </p>
                  <div className="flex flex-wrap gap-1 text-[9px] font-medium leading-none">
                    <span className="bg-red-600 px-1.5 py-[1px] rounded">
                      {movie.vote_average.toFixed(1)}/10
                    </span>
                    <span>{formatDate(movie.release_date)}</span>
                    {movie.original_language === "hi" && (
                      <span className="bg-red-600 px-1.5 py-[1px] rounded">
                        Hindi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200/0 via-gray-900/25 to-gray-300 dark:to-[#0C0E1A] pointer-events-none" />
      </div>

      <MovieDetailsDrawer
        movie={selectedMovie}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}

export default MoviesCarouselBanner;
