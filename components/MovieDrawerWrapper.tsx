// components/MovieDrawerWrapper.tsx
"use client";
import MovieDetailsDrawer from "./MovieDetailsDrawer";
import { Movie } from "@/typings";

export default function MovieDrawerWrapper({
  movie,
  isOpen,
  onClose,
}: {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  // Add a null check to prevent errors when movie is null
  if (!movie) return null;
  
  return <MovieDetailsDrawer movie={movie} isOpen={isOpen} onClose={onClose} />;
}
