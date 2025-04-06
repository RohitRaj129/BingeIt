"use client";
import { Genres } from "@/typings";
import Link from "next/link";
import { Film } from "lucide-react";
import { getGenreIconComponent } from "@/lib/getGenreIcon";

type Props = {
  genres: Genres["genres"];
};

function Categories({ genres }: Props) {
  return (
    <main className="relative h-screen pt-6 p-6 mt-[100px]">
      <div className="fixed top-0 left-0 right-0 z-10 bg-[#0c0e1a] px-6 pt-6">
        <h1 className="text-2xl font-semibold mb-3 text-white mt-15">
          Categories
        </h1>
        <hr className="border-t border-gray-700" />
      </div>
      <div className="mt-10 overflow-auto scrollbar-hide h-[calc(100vh-100px)] px-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {genres?.map((genre) => {
            const Icon = getGenreIconComponent(genre.name);
            return (
              <Link
                key={genre.id}
                href={`/genre/${genre.id}?genre=${genre.name}`}
                className="group flex flex-col items-center justify-center bg-[#0c0e1a] hover:bg-[#2a2a2a] p-4 rounded-lg text-white transition duration-300 w-full"
              >
                <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm text-center transform transition-transform duration-300 group-hover:scale-110">
                  {genre.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Categories;
