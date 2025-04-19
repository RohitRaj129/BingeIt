"use client";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import {
  Grid2x2Plus,
  Popcorn,
  Ticket,
  TvMinimal,
  Search,
  House,
} from "lucide-react";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();

  const hiddenPaths = ["/handler", "/about", "/pricing"];

  if (hiddenPaths.some((path) => pathname.startsWith(path))) return null;
  return (
    <header className="fixed w-full z-100 top-0 flex items-center justify-between p-4 bg-gradient-to-t from-gray-200/0 via-gray-900/25 to-gray-900">
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo.svg"
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
          className="text-white flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-800/50 transition-colors"
        >
          <Popcorn /> Movies
        </Link>
        <Link
          href="/tv"
          className="text-white flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-800/50 transition-colors"
        >
          <TvMinimal /> TV
        </Link>
        <Link
          href="/ticket"
          className="text-white flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-800/50 transition-colors"
        >
          <Ticket /> Tickets
        </Link>
        <Link
          href="/categories"
          className="text-white flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-800/50 transition-colors"
        >
          <Grid2x2Plus /> Categories
        </Link>
        <Link
          href="/search"
          className="text-white flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2 rounded-md hover:bg-gray-800/50 transition-colors"
        >
          <Search /> Search
        </Link>
        <UserButton />
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm text-white flex justify-around py-2 z-[100] md:hidden  border-t border-gray-800">
        <Link href="/" className="flex flex-col items-center">
          <House size={24} /> <span className="text-xs">Home</span>
        </Link>
        <Link href="/ticket" className="flex flex-col items-center">
          <Ticket size={24} /> <span className="text-xs">Tickets</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center">
          <Search size={24} /> <span className="text-xs">Search</span>
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
