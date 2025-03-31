import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import GenreDropdown from "./GenreDropdown";
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

      <div className="flex space-x-2 ">
        {/* Category Dropdown */}
        <GenreDropdown />
        {/* SearchBar */}
        <SearchBar />
        {/* ThemeToggle */}
      </div>
    </header>
  );
}

export default Header;
