"use client";

import { Movie } from "@/typings";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";
import { useGlobalDrawer } from "@/contexts/GlobalDrawerContext";

type Props = {
  title: string;
  movies: Movie[];
  isVertical?: boolean;
};

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
  today.setHours(0, 0, 0, 0);
  const release = new Date(releaseDate);
  return release < today;
}

function MoviesCarousal({ title, movies, isVertical }: Props) {
  // Use the global drawer context instead of local state
  const { openDrawer } = useGlobalDrawer();

  return (
    <div className="z-50">
      <div
        className={cn(
          "flex space-x-4 overflow-scroll px-2 sm:px-5 lg:px-10 py-3 sm:py-5 scrollbar-hide",
          isVertical && "flex-col space-x-0 space-y-8 sm:space-y-12"
        )}
      >
        {isVertical
          ? movies?.map((movie) => {
              const isReleased = isMovieReleased(movie.release_date);
              return (
                <div
                  key={movie.id}
                  className={cn(
                    isVertical &&
                      "flex flex-col space-y-4 sm:space-y-5 mb-4 sm:mb-5 items-center lg:flex-row lg:space-x-5"
                  )}
                >
                  <MovieCard movie={movie} onSelect={openDrawer} />
                  <div className="max-w-2xl px-4 sm:px-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                      <p className="font-bold text-lg sm:text-xl">
                        {movie.title}
                      </p>
                      {isReleased && (
                        <span className="bg-red-600 px-2 py-1 rounded text-white text-xs sm:text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {movie.original_language === "hi" && (
                        <span className="bg-red-600 px-2 py-1 rounded text-white text-xs sm:text-sm">
                          Hindi
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                      Release Date: {formatDate(movie.release_date)}
                    </p>
                    <hr className="mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-300 line-clamp-3 sm:line-clamp-none">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              );
            })
          : movies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelect={openDrawer} />
            ))}
      </div>

      {/* No need for drawer here anymore, it's handled by GlobalDrawer */}
    </div>
  );
}

export default MoviesCarousal;
