const TMDB_HEADERS = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
};

async function fetchTrailerFromTMDB(url: URL, cacheTime?: number) {
  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: TMDB_HEADERS,
      cache: "no-store",
      next: {
        revalidate: cacheTime || 60 * 60 * 24, // Default: 24 hrs
      },
    });

    if (!res.ok) {
      throw new Error(`TMDB error: ${res.status}`);
    }

    const json = await res.json();

    let trailer = json.results.find(
      (vid: any) =>
        vid.site === "YouTube" &&
        vid.type === "Trailer" &&
        vid.official === true
    );

    if (!trailer) {
      trailer = json.results.find(
        (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
      );
    }

    if (!trailer) {
      trailer = json.results.find(
        (vid: any) => vid.site === "YouTube" && vid.type === "Teaser"
      );
    }

    return trailer?.key || null;
  } catch (err) {
    console.error("Error fetching trailer:", err);
    return null;
  }
}

export async function getMovieTrailer(movieId: string) {
  const url = new URL(`https://api.themoviedb.org/3/movie/${movieId}/videos`);
  url.searchParams.set("language", "en-US");

  return await fetchTrailerFromTMDB(url);
}

export async function getTvTrailer(seriesId: string) {
  const url = new URL(`https://api.themoviedb.org/3/tv/${seriesId}/videos`);
  url.searchParams.set("language", "en-US");

  return await fetchTrailerFromTMDB(url);
}
