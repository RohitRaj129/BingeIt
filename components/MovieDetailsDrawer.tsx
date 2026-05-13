"use client";

import { Movie } from "@/typings";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";
import { X, PlayIcon } from "lucide-react";
import { getIndianMoviesByGenre } from "@/lib/getMovies";
import { Button } from "@/components/ui/button";
import { useMemo, useEffect, useState } from "react";
import MoviesByGenreCarousel from "@/app/(main)/movies/_components/MoviesByGenreCarousel";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const GENRE_MAP: { [id: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

interface MovieDetailsDrawerProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const getGenreName = async (genreId: string) => {
  const genre = await getIndianMoviesByGenre(genreId);
  return genre;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MovieDetailsDrawer({
  movie,
  isOpen,
  onClose,
}: MovieDetailsDrawerProps) {
  if (!movie) return null;
  const [planName, setPlanName] = useState<string>("");
  const [planColor, setPlanColor] = useState<string>("");
  const router = useRouter();
  // Toast for showing messages
  function showToast(message: string) {
    if (typeof window !== "undefined" && (window as any).toast) {
      (window as any).toast(message);
    } else {
      alert(message); // fallback
    }
  }

  // Handles the logic for watching a movie based on plan and popularity
  function handleWatch() {
    if (!movie) return;
    // If Free plan and movie is popular, restrict access
    if (
      planName === "Free" &&
      typeof movie.popularity === "number" &&
      movie.popularity > 200
    ) {
      showToast("Upgrade your plan to watch trending movies!");
      router.push("/pricing");
      return;
    }
    // If Super or Premium, allow watch
    if (planName === "Super" || planName === "Premium") {
      router.push(`/watch/${movie.id}?type=movie`);
      return;
    }
    // Default: allow watch for other cases
    router.push(`/watch/${movie.id}?type=movie`);
  }

  useEffect(() => {
    // const subscriptionPlans: Record<string, { name: string; color: string }> = {
    //   "51813d29-8a78-4203-97a6-0fd5e07f9795": { name: "Free", color: "" },
    //   "af5d8190-117e-47be-8dc1-f8fbd8cc275e": {
    //     name: "Super",
    //     color: "text-blue-500",
    //   },
    //   "59823a4f-9f6b-494b-aa2b-336c78ed4e80": {
    //     name: "Premium",
    //     color: "text-red-500",
    //   },
    // };

    const fetchSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log("User ID:", user.id);
        const { data, error } = await supabase
          .from("user_plans")
          .select("subscription_id")
          .eq("user_id", user.id)
          .single();

        if (!data) {
          console.warn("❗ No subscription found, defaulting to Free plan");
          setPlanName("Free");
          setPlanColor("");
          return;
        }

        console.log("Subscription ID:", data.subscription_id);

        const subscriptionPlans: Record<
          string,
          { name: string; color: string }
        > = {
          "51813d29-8a78-4203-97a6-0fd5e07f9795": { name: "Free", color: "" },
          "af5d8190-117e-47be-8dc1-f8fbd8cc275e": {
            name: "Super",
            color: "text-blue-500",
          },
          "59823a4f-9f6b-494b-aa2b-336c78ed4e80": {
            name: "Premium",
            color: "text-red-500",
          },
        };

        const plan = subscriptionPlans[data.subscription_id] || {
          name: "Free",
          color: "",
        };
        setPlanName(plan.name);
        setPlanColor(plan.color);
        console.log("✅ Plan Name:", plan.name);
      }
    };
    fetchSubscription();
  }, []);

  const imageUrl = useMemo(() => {
    return getImagePath(
      movie.backdrop_path || movie.poster_path || "",
      !!movie.backdrop_path
    );
  }, [movie.backdrop_path, movie.poster_path]);

  const pathname = usePathname();

  const hiddenPaths = ["/handler", "/about", "/pricing", "/watch"];

  if (hiddenPaths.some((path) => pathname.startsWith(path))) return null;

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
                alt={movie.title}
                height={1920}
                width={1080}
                className="object-cover object-center h-full w-full"
                priority
              />
            </div>
            <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
              <div>
                <DrawerTitle className="text-base sm:text-lg font-bold">
                  {movie.title}
                </DrawerTitle>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-300 text-xs mt-2">
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                  <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md">
                    {movie.adult ? "18+" : "U/A 13+"}
                  </span>
                  <span>
                    {movie.original_language === "hi"
                      ? "Hindi"
                      : movie.original_language.toUpperCase()}
                  </span>
                </div>

                <p className="mt-2 text-gray-300 text-xs sm:text-sm line-clamp-4 sm:line-clamp-3 whitespace-normal">
                  {movie.overview}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genre_ids?.map((genreId) => (
                    <div
                      key={genreId}
                      className="bg-gray-700 text-white text-xs rounded-full px-3 py-1"
                    >
                      {GENRE_MAP[genreId] || "Unknown"}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <div className="group w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 hover:from-purple-800 hover:via-indigo-700 hover:to-blue-600 px-4 sm:px-5 py-2 text-white text-sm sm:text-base font-semibold rounded-md flex items-center justify-center transition-all duration-500 bg-[length:200%_200%] hover:bg-[position:100%_0%]"
                    onClick={handleWatch}
                  >
                    <span className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105 cursor-pointer">
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
              <MoviesByGenreCarousel movie={movie} />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default MovieDetailsDrawer;
