import { getPopularTvSeries } from "@/lib/getTvSeries";
import TvSeriesCarouselBanner from "./TvSeriesCarouselBanner";

async function TvSeriesCarouselBannerWrapper() {
  try {
    const tvSeries = await getPopularTvSeries();

    if (!tvSeries || tvSeries.length === 0) {
      console.error("No TV series found");
      return null;
    }

    return <TvSeriesCarouselBanner tvSeries={tvSeries} />;
  } catch (error) {
    console.error("Error fetching TV series for banner:", error);
    return null;
  }
}

export default TvSeriesCarouselBannerWrapper;
