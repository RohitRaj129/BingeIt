import TvSeriesCarousel from "@/components/TvSeriesCarousel";
import {
  getIndianPopularTvSeries,
  getAiringTodayTvSeries,
  getIndianTopRatedTvSeries,
  getIndianTvSeriesByGenre,
} from "@/lib/getTvSeries";
import TvSeriesCarouselBannerWrapper from "@/components/TvSeriesCarouselBannerWrapper";
export default async function TvSeriesPage() {
  try {
    const [
      airingTodayTvSeries,
      indianTopRatedTvSeries,
      indianPopularTvSeries,
      indianActionTvSeries,
      indianComedyTvSeries,
      indianDramaTvSeries,
    ] = await Promise.all([
      getAiringTodayTvSeries(),
      getIndianTopRatedTvSeries(),
      getIndianPopularTvSeries(),
      getIndianTvSeriesByGenre("10759"), // Action genre
      getIndianTvSeriesByGenre("35"), // Comedy genre
      getIndianTvSeriesByGenre("18"), // Drama genre
    ]);

    return (
      <main>
        <TvSeriesCarouselBannerWrapper />
        <div className="flex flex-col space-y-2 -mt-5 sm:-mt-12">
          {/* Airing Today */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10 z-10">
            Airing Today
          </h2>
          {airingTodayTvSeries?.length > 0 && (
            <TvSeriesCarousel
              tvSeries={airingTodayTvSeries}
              title="Airing Today"
            />
          )}

          {/* Top Rated Movies */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
            Top Rated Tv Series
          </h2>
          {indianTopRatedTvSeries?.length > 0 && (
            <TvSeriesCarousel
              tvSeries={indianTopRatedTvSeries}
              title="Top Rated Indian Tv Series"
            />
          )}

          {/* Trending Movies */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
            Trending Tv Series
          </h2>
          {indianPopularTvSeries?.length > 0 && (
            <TvSeriesCarousel
              tvSeries={indianPopularTvSeries}
              title="Trending Indian Tv Series"
            />
          )}

          {/* Genre Section */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
              Browse Indian Tv Series by Genre
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {/* Action */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
                Action Tv Series
              </h2>
              {indianActionTvSeries?.length > 0 && (
                <TvSeriesCarousel
                  tvSeries={indianActionTvSeries}
                  title="Indian Action Tv Series"
                />
              )}

              {/* Comedy */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
                Comedy Tv Series
              </h2>
              {indianComedyTvSeries?.length > 0 && (
                <TvSeriesCarousel
                  tvSeries={indianComedyTvSeries}
                  title="Indian Comedy Tv Series"
                />
              )}

              {/* Drama */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
                Drama Tv Series
              </h2>
              {indianDramaTvSeries?.length > 0 && (
                <TvSeriesCarousel
                  tvSeries={indianDramaTvSeries}
                  title="Indian Drama Tv Series"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading Indian tv series page:", error);
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </main>
    );
  }
}
