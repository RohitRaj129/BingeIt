import MoviesCarousal from "@/app/(main)/movies/_components/MoviesCarousal";
import CarouselBannerWrapper from "../../../components/CarouselBannerWrapper";
// import Footer from "@/components/footer";

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
      <div className="flex flex-col space-y-2 -mt-5 sm:mt-40">
        {/* Popular Movies */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10 z-10">
          Popular Movies
        </h2>
        <MoviesCarousal movies={popularMovies} title="Popular Movies" />

        {/* Upcoming Movies */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
          Upcoming Movies
        </h2>
        <MoviesCarousal movies={upcomingMovies} title="Upcoming" />

        {/* Top Rated Movies */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pl-4 sm:pl-10">
          Top Rated Movies
        </h2>
        <MoviesCarousal movies={topRatedMovies} title="Top Rated Movies" />
      </div>
      {/* <Footer /> */}
    </main>
  );
}
