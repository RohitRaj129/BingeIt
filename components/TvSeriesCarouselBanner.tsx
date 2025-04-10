"use client";

import { TvSeries } from "@/typings";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";
import TvSeriesLogo from "@/lib/getTvSeriesLogo";
import { useState, useCallback } from "react";
import TvSeriesDetailsDrawer from "./TvSeriesDetailsDrawer";

Autoplay.globalOptions = { delay: 8000 };

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isSeriesReleased(releaseDate?: string): boolean {
  if (!releaseDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const release = new Date(releaseDate);
  return release < today;
}

function TvSeriesCarouselBanner({ tvSeries }: { tvSeries: TvSeries[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 100 }, [
    Autoplay(),
  ]);
  const [selectedSeries, setSelectedSeries] = useState<TvSeries | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const releasedSeries = tvSeries
    .filter((series) => isSeriesReleased(series.first_air_date))
    .sort(
      (a, b) =>
        new Date(b.first_air_date || "").getTime() -
        new Date(a.first_air_date || "").getTime()
    );

  if (releasedSeries.length === 0) {
    return null;
  }
  const handleSeriesClick = useCallback((series: TvSeries) => {
    setSelectedSeries(series);
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <>
      <div className="overflow-hidden lg:mt-0 relative" ref={emblaRef}>
        <div className="flex">
          {releasedSeries.map((series) => (
            <div
              key={series.id}
              className="flex-full min-w-0 relative cursor-pointer"
              onClick={() => handleSeriesClick(series)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${series.name}`}
            >
              <Image
                src={getImagePath(
                  series.backdrop_path || series.poster_path || "",
                  !!series.backdrop_path
                )}
                alt={series.name}
                width={1920}
                height={1080}
                priority
                className="brightness-[0.7] w-full h-auto object-cover"
              />

              {/* Desktop overlay */}
              <div className="hidden md:inline absolute top-0 left-0 z-20 h-full w-full bg-gradient-to-r from-gray-900/90 to-transparent p-10 space-y-5 text-white">
                <div className="max-w-xl pt-40 xl:pt-52">
                  <TvSeriesLogo title={series.name} className="mb-6" />
                  <p className="max-w-xl line-clamp-3">
                    {series.overview || "No overview available."}
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <span className="text-sm font-semibold bg-red-600 px-2 py-1 rounded">
                      Rating: {series.vote_average.toFixed(1)}/10
                    </span>
                    <span className="text-sm font-semibold">
                      First Air: {formatDate(series.first_air_date)}
                    </span>
                    {series.original_language === "hi" && (
                      <span className="text-sm font-semibold bg-red-600 px-2 py-1 rounded">
                        Hindi
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile overlay */}
              <div className="md:hidden absolute bottom-0 left-0 w-full z-30 px-3 py-3 text-white bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <div className="mb-8">
                  <TvSeriesLogo
                    title={series.name}
                    className="mb-1 max-w-[80%] h-auto"
                  />
                  <p className="text-[10px] leading-tight line-clamp-2 mb-1">
                    {series.overview || "No overview available."}
                  </p>
                  <div className="flex flex-wrap gap-1 text-[9px] font-medium leading-none">
                    <span className="bg-red-600 px-1.5 py-[1px] rounded">
                      {series.vote_average.toFixed(1)}/10
                    </span>
                    <span>{formatDate(series.first_air_date)}</span>
                    {series.original_language === "hi" && (
                      <span className="bg-red-600 px-1.5 py-[1px] rounded">
                        Hindi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200/0 via-gray-900/25 to-gray-300 dark:to-[#0C0E1A] pointer-events-none" />
      </div>

      <TvSeriesDetailsDrawer
        tvSeries={selectedSeries}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}

export default TvSeriesCarouselBanner;
