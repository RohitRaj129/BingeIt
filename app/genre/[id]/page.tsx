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
    <main className="relative h-screen pt-6 p-6 mt-[100px]">
      {/* Fixed Genre Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#0c0e1a] px-6 pt-6">
        <div className="max-w-3xl mx-auto mt-9 mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">
            Results for{" "}
            <span className="text-primary-500">{genre ?? "Selected"}</span>{" "}
            Genre
          </h1>
        </div>
        <hr className="border-t border-gray-700" />
      </div>

      {/* Scrollable Results */}
      <div className="mt-5 overflow-auto scrollbar-hide h-[calc(100vh-100px)] px-6 space-y-8">
        <MoviesCarousal title="Genre Results" movies={movies} isVertical />
      </div>
    </main>
  );
}

export default GenrePage;
