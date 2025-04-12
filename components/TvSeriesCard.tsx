"use client";

import getImagePath from "@/lib/getImagePath";
import { TvSeries } from "@/typings";
import ResponsiveImage from "./ui/ResponsiveImage";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isTvSeriesReleased(releaseDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const release = new Date(releaseDate);
  return release < today;
}

interface TvSeriesCardProps {
  tvSeries: TvSeries;
  onSelect: (tvSeries: TvSeries) => void;
}

function TvSeriesCard({ tvSeries, onSelect }: TvSeriesCardProps) {
  const isReleased = tvSeries.first_air_date
    ? isTvSeriesReleased(tvSeries.first_air_date)
    : false;

  const handleClick = () => {
    console.log("Selected tvSeries:", tvSeries.name);
    onSelect(tvSeries);
  };

  // Get the image path with HTTPS
  const imagePath = getImagePath(
    tvSeries.backdrop_path || tvSeries.poster_path || ""
  );

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer transform hover:scale-105 transition duration-200 ease-out hover:drop-shadow-lg"
      style={{ width: "300px", aspectRatio: "16/9" }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${tvSeries.name}`}
    >
      {/* Image container */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <ResponsiveImage
          src={imagePath}
          alt={tvSeries.name || "TvSeries poster"}
          fill
          sizes="300px"
          fallbackSrc="/not_found.png"
          showLoadingPlaceholder={true}
          quality={75}
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />

        {/* Content overlay */}
        <div className="absolute z-20 bottom-3 left-3 right-3">
          <p className="font-bold text-base text-white mb-1 line-clamp-1">
            {tvSeries.name}
          </p>
          <div className="flex items-center space-x-2 text-xs flex-wrap gap-1">
            {isReleased && (
              <span className="bg-red-600 px-1.5 py-0.5 rounded text-white">
                {tvSeries.vote_average.toFixed(1)}
              </span>
            )}
            <span className="text-gray-200">
              {tvSeries.first_air_date?.split("-")[0]}
            </span>
            {tvSeries.original_language === "hi" && (
              <span className="bg-red-600 px-1.5 py-0.5 rounded text-white">
                Hindi
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TvSeriesCard;
