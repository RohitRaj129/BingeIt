import CarouselBanner from "@/components/CarouselBanner";
import { getPopularIndianMovies } from "@/lib/getMovies";

type Props = {
  id?: string;
  keywords?: string;
};

async function TicketCarouselBannerWrapper({ id, keywords }: Props) {
  try {
    const movies = await getPopularIndianMovies();

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
export default TicketCarouselBannerWrapper;
