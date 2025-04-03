"use client";

import getImagePath from "@/lib/getImagePath";
import { Movie } from "@/typings";
import Image from "next/image";
import { useState } from "react";
import MovieDetailsDrawer from "./MovieDetailsDrawer";

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

function MovieCard({ movie }: { movie: Movie }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isReleased = isMovieReleased(movie.release_date);

  const handleOpenDrawer = () => {
    console.log("Opening drawer for movie:", movie.title);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    console.log("Closing drawer");
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div
        className="relative flex-shrink-0 cursor-pointer transform hover:scale-105 transition duration-200 ease-out hover:drop-shadow-lg"
        onClick={handleOpenDrawer}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${movie.title}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200/0 via-gray-900/10 to-gray-300 dark:to-[#1A1C29]/80 z-10" />
        <div className="absolute z-20 bottom-5 left-5 right-5">
          <p className="font-bold text-lg mb-1">{movie.title}</p>
          <div className="flex items-center space-x-2 text-sm">
            {isReleased && (
              <span className="bg-red-600 px-2 py-1 rounded text-white">
                {movie.vote_average.toFixed(1)}
              </span>
            )}
            <span className="text-gray-200">
              {movie.release_date.split("-")[0]}
            </span>
            {movie.original_language === "hi" && (
              <span className="bg-red-600 px-2 py-1 rounded text-white">
                Hindi
              </span>
            )}
          </div>
        </div>

        <Image
          className="w-fit lg:min-w-[400px] h-56 object-cover object-center shadow-md shadow-gray-900 drop-shadow-xl rounded-sm"
          src={getImagePath(movie.backdrop_path || movie.poster_path)}
          alt={movie.title}
          width={1920}
          height={1080}
          key={movie.id}
        />
      </div>

      <MovieDetailsDrawer
        movie={movie}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}

export default MovieCard;
