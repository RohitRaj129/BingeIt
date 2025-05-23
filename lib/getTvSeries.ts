import { TvSeries, TvSearchResults, CastMember } from "@/typings";

async function fetchFromTMDB(url: URL, cacheTime?: number, region?: string) {
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("include_null_first_air_dates", "false");
  url.searchParams.set("language", "en-IN");
  url.searchParams.set("page", "1");
  url.searchParams.set("sort_by", "popularity.desc");

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
    if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
    const data = (await res.json()) as TvSearchResults;
    return data;
  } catch (error) {
    console.error("Error fetching TV series from TMDB:", error);
    throw error;
  }
}

// Popular Indian TV Series
export async function getIndianPopularTvSeries() {
  const url = new URL("https://api.themoviedb.org/3/tv/popular");
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");
  const data = await fetchFromTMDB(url);
  return data.results;
}

// Popular TV Series
export async function getPopularTvSeries() {
  const url = new URL("https://api.themoviedb.org/3/tv/popular");
  const data = await fetchFromTMDB(url);
  return data.results;
}

// Top Indian Rated TV Series
export async function getIndianTopRatedTvSeries() {
  const url = new URL("https://api.themoviedb.org/3/tv/top_rated");
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");
  const data = await fetchFromTMDB(url);
  return data.results;
}
// Top Rated TV Series
export async function getTopRatedTvSeries() {
  const url = new URL("https://api.themoviedb.org/3/tv/top_rated");
  const data = await fetchFromTMDB(url);
  return data.results;
}

// Currently On Air
export async function getIndianCurrentlyOnAirTvSeries() {
  const url = new URL("https://api.themoviedb.org/3/tv/on_the_air");
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");
  const data = await fetchFromTMDB(url);
  return data.results;
}
// Currently On Air
export async function getCurrentlyOnAirTvSeries() {
  const url = new URL("https://api.themoviedb.org/3/tv/on_the_air");
  const data = await fetchFromTMDB(url);
  return data.results;
}

// Discover by Genre / Keywords
export async function getDiscoverTvSeries(
  id?: string,
  keywords?: string,
  region?: string
) {
  const url = new URL("https://api.themoviedb.org/3/discover/tv");

  keywords && url.searchParams.set("with_keywords", keywords);
  id && url.searchParams.set("with_genres", id);

  const data = await fetchFromTMDB(url, undefined, region);
  return data.results;
}

// Search TV Series
export async function searchTvSeries(term: string) {
  const url = new URL("https://api.themoviedb.org/3/search/tv");
  url.searchParams.set("query", term);
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");
  const data = await fetchFromTMDB(url);
  return data.results;
}

// Airing Today
export async function getAiringTodayTvSeries(
  region?: string
): Promise<TvSeries[]> {
  const url = new URL("https://api.themoviedb.org/3/tv/airing_today");
  const data = await fetchFromTMDB(url, undefined, region);
  return data.results;
}

// Fetch by Genre (indian shows)
export async function getIndianTvSeriesByGenre(
  genreId: string,
  region?: string
) {
  const url = new URL("https://api.themoviedb.org/3/discover/tv");
  url.searchParams.set("with_genres", genreId);
  url.searchParams.set("with_original_language", "hi");
  url.searchParams.set("region", "IN");

  const data = await fetchFromTMDB(url);
  return data.results;
}
// Fetch by Genre
export async function getTvSeriesByGenre(genreId: string, region?: string) {
  const url = new URL("https://api.themoviedb.org/3/discover/tv");
  url.searchParams.set("with_genres", genreId);

  const data = await fetchFromTMDB(url);
  return data.results;
}

// Get Cast for a TV Series
export async function getTvSeriesCast(tvId: number) {
  const url = new URL(`https://api.themoviedb.org/3/tv/${tvId}/credits`);
  const res = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch cast: ${res.status}`);
  const data = await res.json();
  return data.cast as CastMember[];
}
