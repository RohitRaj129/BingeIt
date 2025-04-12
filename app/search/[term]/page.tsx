import MoviesCarousal from "@/components/MoviesCarousal";
import { getPopularMovies, getSearchedMovies } from "@/lib/getMovies";
import { searchTvSeries, getPopularTvSeries } from "@/lib/getTvSeries";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import TvSeriesCarousal from "@/components/TvSeriesCarousel";

type Props = {
  params: {
    term: string;
  };
};

async function SearchPage({ params }: Props) {
  const awaitedParams = await Promise.resolve(params);
  const term = awaitedParams.term;
  if (!term) notFound();

  const termToUse = decodeURI(term);
  const termToShow = decodeURIComponent(term);
  const movies = await getSearchedMovies(termToUse);
  const tvSeries = await searchTvSeries(termToUse);
  const popularMovies = await getPopularMovies();
  const popularTvSeries = await getPopularTvSeries();

  return (
    <main className="relative h-screen pt-6 p-6 mt-[100px]">
      {/* Fixed Search Bar */}
      <div className="fixed top-0 left-0 right-0 z-51 bg-[#0c0e1a] px-6 pt-6">
        <div className="max-w-3xl mx-auto mb-4 mt-9">
          <SearchBar />
        </div>
        <hr className="border-t border-gray-700" />
      </div>

      {/* Scrollable Results Section */}
      <div className="mt-5 overflow-auto scrollbar-hide h-[calc(100vh-100px)] px-6 space-y-8">
        {/* Results Header */}
        <div className="pt-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Results for <span className="text-primary-500">{termToShow}</span>
          </h1>
        </div>

        {/* Search Results */}
        <MoviesCarousal title="Search Results" movies={movies} isVertical />
        <TvSeriesCarousal
          title="Search Results"
          tvSeries={tvSeries}
          isVertical
        />

        {/* You May Also Like */}
        <MoviesCarousal title="You May Also Like" movies={popularMovies} />
      </div>
    </main>
  );
}

export default SearchPage;
