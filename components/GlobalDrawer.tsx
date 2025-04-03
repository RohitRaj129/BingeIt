"use client";

import { useGlobalDrawer } from "@/contexts/GlobalDrawerContext";
import MovieDetailsDrawer from "./MovieDetailsDrawer";

export default function GlobalDrawer() {
  const { activeMovie, isDrawerOpen, closeDrawer } = useGlobalDrawer();

  if (!activeMovie) return null;

  return (
    <MovieDetailsDrawer
      movie={activeMovie}
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
    />
  );
}
