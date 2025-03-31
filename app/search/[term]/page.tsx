import MoviesCarousal from "@/components/MoviesCarousal";
import { getSearchedMovies, getTopRatedMovies } from "@/lib/getMovies";
import { notFound } from "next/navigation";

type Props = {
  params: {
    term: string;
  };
};

async function SearchPage({ params: { term } }: Props) {
  if (!term) notFound();

  const termToUse = decodeURI(term);

  const movies = await getSearchedMovies(termToUse);
  const popularMmovies = await getTopRatedMovies();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mt-32 xl:mt-42 ">
        <h1 className="text-6xl fond-bold px-10">Results for {termToUse}</h1>

        {/* AI Suggestions */}

        <MoviesCarousal title="Movies" movies={movies} isVertical />
        <MoviesCarousal title="You may also like" movies={popularMmovies} />
      </div>
    </div>
  );
}

export default SearchPage;
