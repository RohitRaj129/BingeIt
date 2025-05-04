import { Movie, SearchResults } from "@/typings";

async function fetchFromTMDB(url: URL, cacheTime?: number, region?: string) {
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("include_video", "false");
  url.searchParams.set("language", "en-IN");

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
      revalidate: cacheTime || 60 * 60 * 24, // 24 hours default
    },
  };

  try {
    const res = await fetch(url.toString(), options);
    if (!res.ok) {
      throw new Error(`TMDB API error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    throw error;
  }
}

export async function getMovie(movieId: string): Promise<Movie | null> {
  try {
    const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);

    const data = await fetchFromTMDB(url);

    if (!data || !data.id) {
      console.error("Movie not found or invalid data returned");
      return null;
    }

    return data as Movie;
  } catch (error) {
    console.error(`Error fetching movie with ID ${movieId}:`, error);
    return null;
  }
}
