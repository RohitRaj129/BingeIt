import { Movie } from "@/typings";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  movies: Movie[];
  isVertical?: boolean;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isMovieReleased(releaseDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
  const release = new Date(releaseDate);
  return release < today;
}

function MoviesCarousal({ title, movies, isVertical }: Props) {
  return (
    <div className="z-50">
      <h2 className="text-xl font-bold px-10 py-2">{title}</h2>
      <div
        className={cn(
          "flex space-x-4 overflow-scroll px-5 lg:px-10 py-5 scrollbar-hide",
          isVertical && "flex-col space-x-0 space-y-12"
        )}
      >
        {isVertical
          ? movies?.map((movie) => {
              const isReleased = isMovieReleased(movie.release_date);
              return (
                <div
                  key={movie.id}
                  className={cn(
                    isVertical &&
                      "flex flex-col space-y-5 mb-5 items-center lg:flex-row space-x-5"
                  )}
                >
                  <MovieCard movie={movie} />
                  <div className="max-w-2xl">
                    <div className="flex items-center space-x-4 mb-2">
                      <p className="font-bold text-xl">{movie.title}</p>
                      {isReleased && (
                        <span className="bg-red-600 px-2 py-1 rounded text-white text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {movie.original_language === "hi" && (
                        <span className="bg-red-600 px-2 py-1 rounded text-white text-sm">
                          Hindi
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Release Date: {formatDate(movie.release_date)}
                    </p>
                    <hr className="mb-3" />
                    <p className="text-gray-300">{movie.overview}</p>
                  </div>
                </div>
              );
            })
          : movies?.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
}

export default MoviesCarousal;
