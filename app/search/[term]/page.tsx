import MoviesCarousal from "@/components/MoviesCarousal";
import { getSearchedMovies, getTopRatedMovies } from "@/lib/getMovies";
import { notFound } from "next/navigation";
import SearchBar from "@/components/SearchBar";

type Props = {
  params: {
    term: string;
  };
};

async function SearchPage({ params }: Props) {
  // Await the entire params object
  const awaitedParams = await Promise.resolve(params);
  const term = awaitedParams.term;
  if (!term) notFound();

  const termToUse = decodeURI(term);

  const movies = await getSearchedMovies(termToUse);
  const popularMmovies = await getTopRatedMovies();

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="flex flex-col space-y-8 sm:space-y-12 md:space-y-16">
        {/* Search Bar Section */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <SearchBar />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          {/* Results Header */}
          <div className="px-4 sm:px-6 md:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Results for <span className="text-primary-500">{termToUse}</span>
            </h1>
          </div>

          {/* Search Results */}
          <div className="px-4 sm:px-6 md:px-8">
            <MoviesCarousal title="Search Results" movies={movies} isVertical />
          </div>

          {/* You May Also Like Section */}
          <div className="px-4 sm:px-6 md:px-8">
            <MoviesCarousal title="You May Also Like" movies={popularMmovies} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
