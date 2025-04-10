"use client";

import { useGlobalDrawer } from "@/contexts/GlobalDrawerContext";
import MovieDetailsDrawer from "./MovieDetailsDrawer";
import TvSeriesDetailsDrawer from "./TvSeriesDetailsDrawer";

export default function GlobalDrawer() {
  const { activeItem, isDrawerOpen, closeDrawer } = useGlobalDrawer();

  if (!activeItem) return null;

  if (activeItem.type === "movie") {
    return (
      <MovieDetailsDrawer
        movie={activeItem.item}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    );
  } else if (activeItem.type === "tv") {
    return (
      <TvSeriesDetailsDrawer
        tvSeries={activeItem.item}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    );
  }

  return null;
}
