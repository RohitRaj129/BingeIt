import React from "react";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/getMovies";
import { Movie } from "@/typings";
import Link from "next/link";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";
import { Button } from "@/components/ui/button";

export default async function MovieSelectionPage() {
  // Fetch movies from different categories
  const [popularMovies, topRatedMovies, upcomingMovies] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
  ]);

  // Combine and deduplicate movies
  const allMovies = [...popularMovies, ...topRatedMovies, ...upcomingMovies]
    .filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    )
    .slice(0, 20); // Limit to 20 movies for performance

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Select a Movie for Booking</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allMovies.map((movie) => (
          <MovieSelectionCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function MovieSelectionCard({ movie }: { movie: Movie }) {
  const imagePath = getImagePath(
    movie.poster_path || movie.backdrop_path || ""
  );

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
      <div className="relative h-[240px]">
        <Image
          src={imagePath}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1 mb-2">{movie.title}</h3>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <span>{movie.release_date?.split("-")[0]}</span>
          {movie.vote_average > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-red-600 text-white rounded-sm">
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-300 line-clamp-2 mb-4">
          {movie.overview}
        </p>

        <Link href={`/ticket/booking/${movie.id}`} passHref>
          <Button className="w-full bg-red-600 hover:bg-red-700">
            Book Tickets
          </Button>
        </Link>
      </div>
    </div>
  );
}
