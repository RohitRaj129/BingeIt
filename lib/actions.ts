"use server";

import { getIndianMoviesByGenre, getPopularMovies } from "./getMovies";
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

export async function fetchPopularMoviesAction(): Promise<Movie[]> {
  try {
    const movies = await getPopularMovies("IN");
    return movies;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}
