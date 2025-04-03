import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import GenreDropdown from "./GenreDropdown";
import { UserButton } from "@stackframe/stack";
import { Grid2x2Plus, Popcorn, Ticket, TvMinimal } from "lucide-react";

function Header() {
  return (
    <header className="fixed w-full z-100 top-0 flex items-center justify-between p-5 bg-gradient-to-t from-gray-200/0 via-gray-900/25 to-gray-900">
      <Link href="/" className="mr-10">
        <Image
          src="/logo.png"
          alt="BingeIt"
          width={120}
          height={120}
          className="cursor-pointer"
        />
      </Link>

      <div className="flex space-x-2 gap-2">
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
        {/* Category Dropdown */}
        <GenreDropdown />
        {/* SearchBar */}
        <SearchBar />
        {/* Login button */}
        <UserButton />
      </div>
    </header>
  );
}

export default Header;
