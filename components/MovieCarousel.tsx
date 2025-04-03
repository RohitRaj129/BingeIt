"use client";

import { Movie } from "@/typings";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";
import { useState } from "react";
import MovieDetailsDrawer from "./MovieDetailsDrawer";

type Props = {
  title: string;
  movies: Movie[];
  isVertical?: boolean;
};

function MoviesCarousal({ title, movies, isVertical }: Props) {
  // State to track the selected movie
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Function to handle selecting a movie
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Function to handle closing the drawer
  const handleCloseDrawer = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="z-50">
      <h2 className="text-lg sm:text-xl font-bold px-4 sm:px-10 py-2">
        {title}
      </h2>
      <div
        className={cn(
          "flex space-x-4 overflow-scroll px-2 sm:px-5 lg:px-10 py-3 sm:py-5 scrollbar-hide",
          isVertical && "flex-col space-x-0 space-y-8 sm:space-y-12"
        )}
      >
        {isVertical
          ? movies?.map((movie) => {
              return (
                <div
                  key={movie.id}
                  className={cn(
                    isVertical &&
                      "flex flex-col space-y-4 sm:space-y-5 mb-4 sm:mb-5 items-center lg:flex-row lg:space-x-5"
                  )}
                >
                  <MovieCard movie={movie} onSelect={handleSelectMovie} />
                </div>
              );
            })
          : movies?.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={handleSelectMovie}
              />
            ))}
      </div>

      {/* Single shared drawer */}
      {selectedMovie && (
        <MovieDetailsDrawer
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}

export default MoviesCarousal;
