import CarouselBannerWrapper from "@/components/CarouselBannerWrapper";
import MoviesCarousal from "@/components/MoviesCarousal";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/getMovies";

export default async function Home() {
  const upcomingMovies = await getUpcomingMovies();
  const topRatedMovies = await getTopRatedMovies();
  const popularMovies = await getPopularMovies();

  return (
    <main>
      <CarouselBannerWrapper />
      <div className="flex flex-col space-y-2 xl:-mt-48">
        <MoviesCarousal movies={popularMovies} title="Popular Movies" />
        <MoviesCarousal movies={upcomingMovies} title="Upcoming" />
        <MoviesCarousal movies={topRatedMovies} title="Top Rated Movies" />
      </div>
    </main>
  );
}
