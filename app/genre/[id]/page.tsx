import MoviesCarousal from "@/components/MoviesCarousal";
import { getDiscoverMovies } from "@/lib/getMovies";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    genre?: string;
  };
};

async function GenrePage({ params: { id }, searchParams: { genre } }: Props) {
  const movies = await getDiscoverMovies(id);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mt-32 xl:mt-42">
        <h1 className="text-6xl fond-bold px-10">Results for {genre} Genre</h1>
        {/* Azure OPENAI service Suggestions */}

        <MoviesCarousal title={`Genre`} movies={movies} isVertical />
      </div>
    </div>
  );
}

export default GenrePage;
