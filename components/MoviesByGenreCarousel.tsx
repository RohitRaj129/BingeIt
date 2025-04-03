"use client";

import { Movie } from "@/typings";
import { useEffect, useState } from "react";
import MoviesCarousal from "./MoviesCarousal";
import { fetchMoviesByGenreAction } from "@/lib/actions";

type Props = {
  movie: Movie;
};

export default function MoviesByGenreCarousel({ movie }: Props) {
  const [genreMovies, setGenreMovies] = useState<{ [key: string]: Movie[] }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoviesByGenre() {
      try {
        // Get the first 3 genres of the movie
        const genres = movie.genre_ids.slice(0, 3);

        // Fetch movies for each genre using the server action
        const moviesPromises = genres.map(async (genreId) => {
          const movies = await fetchMoviesByGenreAction(genreId.toString());
          return { genreId, movies };
        });

        const results = await Promise.all(moviesPromises);

        // Create an object with genre IDs as keys and movies as values
        const moviesByGenre = results.reduce((acc, { genreId, movies }) => {
          acc[genreId] = movies.filter((m) => m.id !== movie.id); // Exclude the current movie
          return acc;
        }, {} as { [key: string]: Movie[] });

        setGenreMovies(moviesByGenre);
      } catch (error) {
        console.error("Error fetching movies by genre:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMoviesByGenre();
  }, [movie]);

  if (loading) {
    return <div>Loading similar movies...</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(genreMovies).map(
        ([genreId, movies]) =>
          movies.length > 0 && (
            <MoviesCarousal
              key={genreId}
              title={`More ${getGenreName(genreId)} Movies`}
              movies={movies}
            />
          )
      )}
    </div>
  );
}

// Helper function to get genre name from ID
function getGenreName(genreId: string): string {
  const genreMap: { [key: string]: string } = {
    "28": "Action",
    "12": "Adventure",
    "16": "Animation",
    "35": "Comedy",
    "80": "Crime",
    "99": "Documentary",
    "18": "Drama",
    "10751": "Family",
    "14": "Fantasy",
    "36": "History",
    "27": "Horror",
    "10402": "Music",
    "9648": "Mystery",
    "10749": "Romance",
    "878": "Science Fiction",
    "10770": "TV Movie",
    "53": "Thriller",
    "10752": "War",
    "37": "Western",
  };

  return genreMap[genreId] || "Similar";
}
