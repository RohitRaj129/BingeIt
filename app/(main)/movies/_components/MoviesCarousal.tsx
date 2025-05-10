"use client";

import { useEffect, useRef, useState } from "react";
import { Movie } from "@/typings";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";
import { useGlobalDrawer } from "@/contexts/GlobalDrawerContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  today.setHours(0, 0, 0, 0);
  const release = new Date(releaseDate);
  return release < today;
}

function MoviesCarousal({ title, movies, isVertical }: Props) {
  const { openDrawer } = useGlobalDrawer();
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll buttons
  const handleScroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;
    if (!carousel || itemWidth === 0) return;

    const scrollAmount = isMobile ? itemWidth : itemWidth * 4;
    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const updateButtonVisibility = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const { scrollLeft, scrollWidth, clientWidth } = carousel;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    if (isVertical) return;

    const carousel = carouselRef.current;
    const item = itemRef.current;

    // detect mobile width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind 'sm' breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (item) {
      setItemWidth(item.offsetWidth + 16); // include spacing
    }

    if (carousel) {
      carousel.addEventListener("scroll", updateButtonVisibility);
      updateButtonVisibility();
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (carousel) {
        carousel.removeEventListener("scroll", updateButtonVisibility);
      }
    };
  }, [isVertical, movies]);

  return (
    <div className="relative z-50">
      {!isVertical && (
        <>
          {showLeft && (
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {showRight && (
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </>
      )}

      <div
        ref={carouselRef}
        className={cn(
          "flex space-x-4 overflow-x-auto px-2 sm:px-5 lg:px-10 py-3 sm:py-5 scrollbar-hide scroll-smooth",
          isVertical && "flex-col space-x-0 space-y-8 sm:space-y-12"
        )}
      >
        {isVertical
          ? movies?.map((movie) => {
              const isReleased = isMovieReleased(movie.release_date);
              return (
                <div
                  key={movie.id}
                  className="flex flex-col space-y-4 sm:space-y-5 mb-4 sm:mb-5 items-center lg:flex-row lg:space-x-5"
                >
                  <MovieCard
                    movie={movie}
                    onSelect={() => openDrawer({ type: "movie", item: movie })}
                  />
                  <div className="max-w-2xl px-4 sm:px-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                      <p className="font-bold text-lg sm:text-xl">
                        {movie.title}
                      </p>
                      {isReleased && (
                        <span className="bg-red-600 px-2 py-1 rounded text-white text-xs sm:text-sm">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {movie.original_language === "hi" && (
                        <span className="bg-red-600 px-2 py-1 rounded text-white text-xs sm:text-sm">
                          Hindi
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                      Release Date: {formatDate(movie.release_date)}
                    </p>
                    <hr className="mb-2 sm:mb-3" />
                    <p className="text-sm sm:text-base text-gray-300 line-clamp-3 sm:line-clamp-none">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              );
            })
          : movies?.map((movie, idx) => (
              <div key={movie.id} ref={idx === 0 ? itemRef : null}>
                <MovieCard
                  movie={movie}
                  onSelect={() => openDrawer({ type: "movie", item: movie })}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

export default MoviesCarousal;
