import MoviesCarousal from "@/app/(main)/movies/_components/MoviesCarousal";
import { getDiscoverMovies } from "@/lib/getMovies";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    genre?: string;
  };
};

async function GenrePage({ params, searchParams }: Props) {
  // Await the dynamic params and searchParams
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);

  const id = resolvedParams.id;
  const genre = resolvedSearchParams.genre || "Selected";

  const movies = await getDiscoverMovies(id);

  return (
    <main className="relative mb-5 h-screen pt-6 p-6 mt-[100px]">
      {/* Fixed Genre Header */}
      <div className="fixed top-0 left-0 right-0 z-51 bg-[#0c0e1a] px-6 pt-6">
        <div className="max-w-3xl mx-auto mt-9 mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Results for <span className="text-primary-500">{genre}</span> Genre
          </h1>
        </div>
        <hr className="border-t border-gray-700" />
      </div>

      {/* Scrollable Results */}
      <div className="mt-10 overflow-auto scrollbar-hide h-[calc(100vh-100px)] px-6 space-y-8">
        <MoviesCarousal title="Genre Results" movies={movies} isVertical />
      </div>
    </main>
  );
}

export default GenrePage;
