"use client";

import { useEffect, useState } from "react";
import { TvSeries } from "@/typings";
import TvSeriesCarousel from "./TvSeriesCarousel";
import { fetchTvSeriesByGenreAction } from "@/lib/actions";

type Props = {
  tvSeries: TvSeries;
};

function TvSeriesByGenreCarousel({ tvSeries }: Props) {
  const [similarTvSeries, setSimilarTvSeries] = useState<TvSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTvSeriesByGenre() {
      try {
        // Get the first 3 genres of the tvSeries
        const genres = tvSeries.genre_ids?.slice(0, 3) || [];

        // If no genres, return early
        if (genres.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch tvSeries for each genre using the server action
        const tvSeriesPromises = genres.map(async (genreId) => {
          const tvSeries = await fetchTvSeriesByGenreAction(genreId.toString());
          return tvSeries;
        });

        const results = await Promise.all(tvSeriesPromises);

        // Combine all tvSeries into a single array and remove duplicates
        const allTvSeries = results.flat();
        const uniqueTvSeries = Array.from(
          new Map(
            allTvSeries.map((tvSeries) => [tvSeries.id, tvSeries])
          ).values()
        )
          .filter((m) => m.id !== tvSeries.id) // Exclude the current tvSeries
          .slice(0, 8); // Limit to 8 tvSeries

        setSimilarTvSeries(uniqueTvSeries);
      } catch (error) {
        console.error("Error fetching TvSeries by genre:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTvSeriesByGenre();
  }, [tvSeries]);

  if (loading) {
    return <div>Loading similar series...</div>;
  }

  return (
    <div className="space-y-4">
      {similarTvSeries.length > 0 && (
        <TvSeriesCarousel
          title="Similar Series You Might Like"
          tvSeries={similarTvSeries}
        />
      )}
    </div>
  );
}

export default TvSeriesByGenreCarousel;
