"use server";

import { getIndianMoviesByGenre } from "./getMovies";
import { Movie } from "@/typings";

export async function fetchMoviesByGenreAction(
  genreId: string
): Promise<Movie[]> {
  try {
    const movies = await getIndianMoviesByGenre(genreId);
    return movies;
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
}
