import { SearchResults } from "@/typings";

async function fetchFromTMDB(url: URL, cacheTime?: number, region?: string) {
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("include_video", "false");
  url.searchParams.set("sort_by", "popularity.desc");
  url.searchParams.set("language", "en-IN");
  url.searchParams.set("page", "1");

  if (region) {
    url.searchParams.set("region", region);
  }

  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
    next: {
      revalidate: cacheTime || 60 * 60 * 24, //24 hours default
    },
  };

  try {
    const res = await fetch(url.toString(), options);
    if (!res.ok) {
      throw new Error(`TMDB API error: ${res.status}`);
    }
    const data = (await res.json()) as SearchResults;
    return data;
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    throw error;
  }
}

export async function getIndianMovies() {
  const url = new URL("https://api.themoviedb.org/3/discover/movie");
  url.searchParams.set("with_original_language", "hi"); // Hindi language
  url.searchParams.set("region", "IN");
  url.searchParams.set("sort_by", "popularity.desc");

  const data = await fetchFromTMDB(url);
  return data.results;
}

export async function getUpcomingIndianMovies() {
  const url = new URL("https://api.themoviedb.org/3/movie/upcoming");
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");

  const data = await fetchFromTMDB(url);
  return data.results;
}

export async function getTopRatedIndianMovies() {
  const url = new URL("https://api.themoviedb.org/3/movie/top_rated");
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");

  const data = await fetchFromTMDB(url);
  return data.results;
}

export async function getPopularIndianMovies() {
  const url = new URL("https://api.themoviedb.org/3/movie/popular");
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");

  const data = await fetchFromTMDB(url);
  return data.results;
}

export async function getIndianMoviesByGenre(genreId: string) {
  const url = new URL("https://api.themoviedb.org/3/discover/movie");
  url.searchParams.set("with_genres", genreId);
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");

  const data = await fetchFromTMDB(url);
  return data.results;
}
export async function getMoviesByGenre(genreId: string) {
  const url = new URL("https://api.themoviedb.org/3/discover/movie");
  url.searchParams.set("with_genres", genreId);

  const data = await fetchFromTMDB(url);
  return data.results;
}

export async function getUpcomingMovies(region?: string) {
  const url = new URL("https://api.themoviedb.org/3/movie/upcoming");
  const data = await fetchFromTMDB(url, undefined, region);
  return data.results;
}

export async function getTopRatedMovies(region?: string) {
  const url = new URL("https://api.themoviedb.org/3/movie/top_rated");
  const data = await fetchFromTMDB(url, undefined, region);
  return data.results;
}

export async function getPopularMovies(region?: string) {
  const url = new URL("https://api.themoviedb.org/3/movie/popular");
  const data = await fetchFromTMDB(url, undefined, region);
  return data.results;
}

export async function getDiscoverMovies(
  id?: string,
  keywords?: string,
  region?: string
) {
  const url = new URL("https://api.themoviedb.org/3/discover/movie");

  keywords && url.searchParams.set("with_keywords", keywords);
  id && url.searchParams.set("with_genres", id);

  const data = await fetchFromTMDB(url, undefined, region);
  return data.results;
}

export async function getSearchedMovies(term: string) {
  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.set("query", term);
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");
  const data = await fetchFromTMDB(url);
  return data.results;
}
