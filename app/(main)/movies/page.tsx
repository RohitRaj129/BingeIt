import MoviesCarousal from "@/app/(main)/movies/_components/MoviesCarousal";
import {
  getPopularIndianMovies,
  getTopRatedIndianMovies,
  getUpcomingIndianMovies,
  getIndianMoviesByGenre,
  getMoviesByGenre,
} from "@/lib/getMovies";
import MoviesCarouselBannerWrapper from "@/app/(main)/movies/_components/MoviesCarouselBannerWrapper";

export default async function MoviesPage() {
  try {
    const [
      upcomingMovies,
      topRatedMovies,
      popularMovies,
      actionMovies,
      comedyMovies,
      dramaMovies,
      animationMovies,
    ] = await Promise.all([
      getUpcomingIndianMovies(),
      getTopRatedIndianMovies(),
      getPopularIndianMovies(),
      getIndianMoviesByGenre("28"), // Action genre
      getIndianMoviesByGenre("35"), // Comedy genre
      getIndianMoviesByGenre("18"), // Drama genre
      getMoviesByGenre("16"), // Animation genre
    ]);

    return (
      <main>
        <MoviesCarouselBannerWrapper />
        <div className="flex flex-col space-y-2 -mt-5 sm:-mt-12">
          {/* Upcoming Movies */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10 z-10">
            Upcoming Movies
          </h2>
          {upcomingMovies?.length > 0 && (
            <MoviesCarousal movies={upcomingMovies} title="Upcoming Movies" />
          )}

          {/* Top Rated Movies */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
            Top Rated Movies
          </h2>
          {topRatedMovies?.length > 0 && (
            <MoviesCarousal
              movies={topRatedMovies}
              title="Top Rated Indian Movies"
            />
          )}

          {/* Trending Movies */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
            Trending Movies
          </h2>
          {popularMovies?.length > 0 && (
            <MoviesCarousal
              movies={popularMovies}
              title="Trending Indian Movies"
            />
          )}

          {/* Animation Movies*/}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
            Animation Movies
          </h2>
          {animationMovies?.length > 0 && (
            <MoviesCarousal movies={animationMovies} title="Animation Movies" />
          )}

          {/* Genre Section */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
              Browse Indian Movies by Genre
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {/* Action */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
                Action Movies
              </h2>
              {actionMovies?.length > 0 && (
                <MoviesCarousal
                  movies={actionMovies}
                  title="Indian Action Movies"
                />
              )}

              {/* Comedy */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
                Comedy Movies
              </h2>
              {comedyMovies?.length > 0 && (
                <MoviesCarousal
                  movies={comedyMovies}
                  title="Indian Comedy Movies"
                />
              )}

              {/* Drama */}
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
                Drama Movies
              </h2>
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
