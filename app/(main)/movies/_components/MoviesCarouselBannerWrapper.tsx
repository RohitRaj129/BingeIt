import { getTopRatedMovies } from "@/lib/getMovies";
import MoviesCarouselBanner from "./MoviesCarouselBanner";

async function MoviesCarouselBannerWrapper() {
  try {
    const movies = await getTopRatedMovies();

    if (!movies || movies.length === 0) {
      console.error("No Indian movies found");
      return null;
    }

    return <MoviesCarouselBanner movies={movies} />;
  } catch (error) {
    console.error("Error fetching Indian movies for banner:", error);
    return null;
  }
}

export default MoviesCarouselBannerWrapper;
