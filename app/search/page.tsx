"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import MoviesCarousal from "@/components/MoviesCarousal";
import { fetchPopularMoviesAction } from "@/lib/actions";
import { Movie } from "@/typings";

export default function SearchPage() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopularMovies() {
      try {
        const movies = await fetchPopularMoviesAction();
        setPopularMovies(movies);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPopularMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col items-center space-y-12 sm:space-y-16 md:space-y-20">
        {/* Search Bar */}
        <div className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
            Search Movies
          </h1>
          <SearchBar />
        </div>

        {/* Popular Movies Carousel */}
        <div className="w-full">
          {loading ? (
            <div className="text-center text-lg sm:text-xl">
              Loading popular movies...
            </div>
          ) : (
            <MoviesCarousal title="Popular Movies" movies={popularMovies} />
          )}
        </div>
      </div>
    </div>
  );
}
