"use server";

import { getIndianMoviesByGenre, getPopularMovies } from "./getMovies";
import { getTvSeriesByGenre, getPopularTvSeries } from "./getTvSeries";
import { Movie, TvSeries } from "@/typings";

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

export async function fetchTvSeriesByGenreAction(
  genreId: string
): Promise<TvSeries[]> {
  try {
    const series = await getTvSeriesByGenre(genreId);
    return series;
  } catch (error) {
    console.error("Error fetching TV series by genre:", error);
    return [];
  }
}

export async function fetchPopularTvSeriesAction(): Promise<TvSeries[]> {
  try {
    const series = await getPopularTvSeries();
    return series;
  } catch (error) {
    console.error("Error fetching popular TV series:", error);
    return [];
  }
}
