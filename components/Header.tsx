// "use client";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import GenreDropdown from "./GenreDropdown";
import { UserButton } from "@stackframe/stack";
import { Grid2x2Plus, Popcorn, Ticket, TvMinimal, Menu } from "lucide-react";

function Header() {
  return (
    <header className="fixed w-full z-100 top-0 flex items-center justify-between p-4 bg-gradient-to-t from-gray-200/0 via-gray-900/25 to-gray-900">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="BingeIt"
          width={120}
          height={120}
          className="cursor-pointer w-24 md:w-32"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Link
          href="/movies"
          className="text-white hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <Popcorn /> Movies
        </Link>
        <Link
          href="/webseries"
          className="text-white hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <TvMinimal /> TV Shows
        </Link>
        <Link
          href="/ticket"
          className="text-white hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <Ticket /> Tickets
        </Link>
        <Link
          href="/categories"
          className="text-white hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <Grid2x2Plus /> Categories
        </Link>
        <GenreDropdown />
        <SearchBar />
        <UserButton />
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm text-white flex justify-around py-2 z-[100] md:hidden  border-t border-gray-800">
        <Link href="/movies" className="flex flex-col items-center">
          <Popcorn size={24} /> <span className="text-xs">Movies</span>
        </Link>
        <Link href="/webseries" className="flex flex-col items-center">
          <TvMinimal size={24} /> <span className="text-xs">TV Shows</span>
        </Link>
        <Link href="/ticket" className="flex flex-col items-center">
          <Ticket size={24} /> <span className="text-xs">Tickets</span>
        </Link>
        <Link href="/categories" className="flex flex-col items-center">
          <Grid2x2Plus size={24} /> <span className="text-xs">Categories</span>
        </Link>
        <div className="flex flex-col items-center">
          <UserButton />
          <span className="text-xs">Profile</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
