// components/MovieDrawerWrapper.tsx
"use client";
import TvSeriesDetailsDrawer from "./TvSeriesDetailsDrawer";
import { TvSeries } from "@/typings";

export default function TvSeriesDrawerWrapper({
  tvSeries,
  isOpen,
  onClose,
}: {
  tvSeries: TvSeries | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <TvSeriesDetailsDrawer
      tvSeries={tvSeries}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
