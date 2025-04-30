import { getIndianMovies } from "@/lib/getMovies";
import CarouselBanner from "../../../components/CarouselBanner";

type Props = {
  id?: string;
  keywords?: string;
};

async function CarouselBannerWrapper({ id, keywords }: Props) {
  try {
    const movies = await getIndianMovies();

    if (!movies || movies.length === 0) {
      console.error("No Indian movies found");
      return null;
    }

    return <CarouselBanner movies={movies} />;
  } catch (error) {
    console.error("Error fetching Indian movies for banner:", error);
    return null;
  }
}
export default CarouselBannerWrapper;
