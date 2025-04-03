import MoviesCarouselBannerWrapper from "@/components/MoviesCarouselBannerWrapper";
import MoviesCarousal from "@/components/MoviesCarousal";
import {
  getPopularIndianMovies,
  getTopRatedIndianMovies,
  getUpcomingIndianMovies,
  getIndianMoviesByGenre,
} from "@/lib/getMovies";
import CarouselBannerWrapper from "@/components/CarouselBannerWrapper";

export default async function MoviesPage() {
  try {
    const [
      upcomingMovies,
      topRatedMovies,
      popularMovies,
      actionMovies,
      comedyMovies,
      dramaMovies,
    ] = await Promise.all([
      getUpcomingIndianMovies(),
      getTopRatedIndianMovies(),
      getPopularIndianMovies(),
      getIndianMoviesByGenre("28"), // Action genre
      getIndianMoviesByGenre("35"), // Comedy genre
      getIndianMoviesByGenre("18"), // Drama genre
    ]);

    return (
      <main>
        <CarouselBannerWrapper />
        <div className="flex flex-col space-y-2 xl:-mt-48">
          {upcomingMovies?.length > 0 && (
            <MoviesCarousal movies={upcomingMovies} title="Upcoming Movies" />
          )}
          {topRatedMovies?.length > 0 && (
            <MoviesCarousal
              movies={topRatedMovies}
              title="Top Rated Indian Movies"
            />
          )}
          {popularMovies?.length > 0 && (
            <MoviesCarousal
              movies={popularMovies}
              title="Trending Indian Movies"
            />
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Browse Indian Movies by Genre
            </h2>
            <div className="space-y-8">
              {actionMovies?.length > 0 && (
                <MoviesCarousal
                  movies={actionMovies}
                  title="Indian Action Movies"
                />
              )}
              {comedyMovies?.length > 0 && (
                <MoviesCarousal
                  movies={comedyMovies}
                  title="Indian Comedy Movies"
                />
              )}
              {dramaMovies?.length > 0 && (
                <MoviesCarousal
                  movies={dramaMovies}
                  title="Indian Drama Movies"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading Indian movies page:", error);
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
