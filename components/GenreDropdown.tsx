import { Genres } from "@/typings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Drama } from "lucide-react";

async function GenreDropdown() {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application.json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
    next: {
      revalidate: 60 * 60 * 24, //24 hours
    },
  };

  const res = await fetch(url, options);
  const data = (await res.json()) as Genres;

  console.log(data.genres);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-white flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-800/50 transition-colors">
        <Drama className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Genre</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="overflow-y-auto scrollbar-hide max-h-[60vh] sm:max-h-60 w-48 sm:w-56 bg-gray-900/95 border-gray-800">
        <DropdownMenuLabel className="text-sm font-semibold text-gray-300">
          Select Genre
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        {data.genres.map((genre) => (
          <DropdownMenuItem
            key={genre.id}
            className="text-sm hover:bg-gray-800/50 focus:bg-gray-800/50 cursor-pointer"
          >
            <Link
              href={`/genre/${genre.id}?genre=${genre.name}`}
              className="w-full py-1.5"
            >
              {genre.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GenreDropdown;
