import React from "react";
import { getMovie } from "@/lib/getMovie";
import getImagePath from "@/lib/getImagePath";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BookingForm from "../_components/BookingForm";

interface BookingPageProps {
  params: {
    movieId: string;
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const movieId = params.movieId;

  try {
    // Placeholder for getMovie function - you'll need to implement this
    // This would fetch detailed movie info by ID from TMDB API
    const movie = await getMovie(movieId);

    if (!movie) {
      return (
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Link href="/ticket/movie-selection" legacyBehavior>
            <a>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Movie Selection
              </Button>
            </a>
          </Link>
        </div>
      );
    }

    const imagePath = getImagePath(
      movie.backdrop_path || movie.poster_path || ""
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/ticket/movie-selection" legacyBehavior>
          <a className="inline-block mb-6">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </a>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Info */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto md:mx-0">
              <Image
                src={imagePath}
                alt={movie.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {movie.title}
            </h1>
            <div className="flex items-center text-sm text-gray-400 mb-4">
              <span>{movie.release_date?.split("-")[0]}</span>
              {movie.vote_average > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-600 text-white rounded-sm">
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <p className="text-gray-300 mb-6">{movie.overview}</p>

            {/* Booking Form Component */}
            <BookingForm movie={movie} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading movie booking page:", error);
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-6">Unable to load movie details</p>
        <Link href="/ticket/movie-selection" legacyBehavior>
          <a>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Movie Selection
            </Button>
          </a>
        </Link>
      </div>
    );
  }
}
