"use client";

import { TvSeries } from "@/typings";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";
import { X, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import TvSeriesByGenreCarousel from "./TvSeriesByGenreCarousel";

const TV_GENRE_MAP: { [id: number]: string } = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

interface TvSeriesDetailsDrawerProps {
  tvSeries: TvSeries | null;
  isOpen: boolean;
  onClose: () => void;
}

// const getGenreName = async (genreId: string) => {
//   const genre = await getTvSeriesByGenre(genreId);
//   return genre;
// };

// function formatDate(dateString: string) {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

export function TvSeriesDetailsDrawer({
  tvSeries,
  isOpen,
  onClose,
}: TvSeriesDetailsDrawerProps) {
  if (!tvSeries) return null;

  const imageUrl = useMemo(() => {
    return getImagePath(
      tvSeries.backdrop_path || tvSeries.poster_path || "",
      !!tvSeries.backdrop_path
    );
  }, [tvSeries.backdrop_path, tvSeries.poster_path]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      direction="bottom"
    >
      <DrawerContent className="w-[95%] z-99 max-w-4xl mx-auto rounded-t-xl bg-[#0c0e1a] text-white pt-0 min-h-[90vh] sm:min-h-[60vh]">
        {/* Close Button */}
        <div className="absolute right-2 top-2 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
        <div className="pb-12 w-full min-h-auto overflow-auto whitespace-nowrap scrollbar-hide max-w-4xl mx-auto rounded-t-xl bg-[#0c0e1a] text-white pt-0 sm:min-h-[60vh]">
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/4 relative h-48 md:h-auto">
              <Image
                src={imageUrl}
                alt={tvSeries.name}
                height={1920}
                width={1080}
                className="object-cover object-center h-full w-full"
                priority
              />
            </div>
            <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
              <div>
                <DrawerTitle className="text-base sm:text-lg font-bold">
                  {tvSeries.name}
                </DrawerTitle>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-300 text-xs mt-2">
                  <span>{new Date(tvSeries.first_air_date).getFullYear()}</span>
                  <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                    {tvSeries.adult ? "18+" : "U/A 13+"}
                  </span>
                  <span>
                    {tvSeries.original_language === "hi"
                      ? "Hindi"
                      : tvSeries.original_language.toUpperCase()}
                  </span>
                </div>

                <p className="mt-2 text-gray-300 text-xs sm:text-sm line-clamp-3 sm:line-clamp-2">
                  {tvSeries.overview}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {tvSeries.genre_ids?.map((genreId) => (
                    <div
                      key={genreId}
                      className="bg-gray-700 text-white text-xs rounded-full px-3 py-1"
                    >
                      {TV_GENRE_MAP[genreId] || "Unknown"}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="group w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 hover:from-purple-800 hover:via-indigo-700 hover:to-blue-600 px-4 sm:px-5 py-2 text-white text-sm sm:text-base font-semibold rounded-md flex items-center justify-center transition-all duration-500 bg-[length:200%_200%] hover:bg-[position:100%_0%]">
                    <span className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                      <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Watch
                    </span>
                  </button>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-md text-sm sm:text-base">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h2 className="font-bold text-lg p-2">More Like This</h2>
            <hr className="border-gray-700" />
          </div>
          <div className="mt-1 pb-12 w-full min-h-auto overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="h-auto md:h-64 w-full flex min-w-0">
              <TvSeriesByGenreCarousel tvSeries={tvSeries} />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default TvSeriesDetailsDrawer;
