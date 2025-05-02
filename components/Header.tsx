"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Grid2x2Plus,
  Popcorn,
  Ticket,
  TvMinimal,
  Search,
  House,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/contexts/ProfileContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function StarIcon({ className }: { className?: string }) {
  return (
    <div
      className={`absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center ${className}`}
      style={{
        backgroundColor: (className || "").includes("text-blue")
          ? "#3b82f6"
          : "#ef4444",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
        stroke="none"
        className="w-3.5 h-3.5"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </div>
  );
}

function Header() {
  const { selectedProfile, clearProfile } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [planName, setPlanName] = useState<string>("");
  const [planColor, setPlanColor] = useState<string>("");

  useEffect(() => {
    const subscriptionPlans: Record<string, { name: string; color: string }> = {
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
        if (error) {
          console.error("Error fetching subscription:", error);
        } else {
          console.log("Subscription ID:", data?.subscription_id);
          const plan = subscriptionPlans[data?.subscription_id || ""] || {
            name: "Unknown Plan",
            color: "",
          };
          setPlanName(plan.name);
          setPlanColor(plan.color);
          console.log("Plan Name:", plan.name);
        }
      }
    };
    fetchSubscription();
  }, []);

  const switchProfile = () => {
    clearProfile();
    router.push("/profiles");
  };

  // Hide header on specific pages
  const hiddenPaths = ["/handler", "/profiles", "/about", "/pricing", "/watch"];
  if (hiddenPaths.some((path) => pathname.startsWith(path))) return null;

  // While no profile is selected yet
  if (!selectedProfile) return null;

  return (
    <header className="fixed w-full z-100 top-0 flex items-center justify-between p-4 bg-gradient-to-t from-gray-200/0 via-gray-900/25 to-gray-900">
      <Link href="/home" className="flex-shrink-0">
        <Image
          src="/logo.svg"
          alt="BingeIt"
          width={120}
          height={120}
          className="cursor-pointer w-24 md:w-32"
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-5">
        <Link href="/movies" className="text-white flex items-center gap-2">
          <Popcorn /> Movies
        </Link>
        <Link href="/tv" className="text-white flex items-center gap-2">
          <TvMinimal /> TV
        </Link>
        <Link href="/ticket" className="text-white flex items-center gap-2">
          <Ticket /> Tickets
        </Link>
        <Link href="/categories" className="text-white flex items-center gap-2">
          <Grid2x2Plus /> Categories
        </Link>
        <Link href="/search" className="text-white flex items-center gap-2">
          <Search /> Search
        </Link>

        {/* Profile Icon */}
        <div
          className="flex items-center cursor-pointer group relative"
          onClick={switchProfile}
        >
          <div
            className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white ${
              selectedProfile.type === "kids"
                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                : selectedProfile.avatar_color ||
                  "bg-gradient-to-br from-blue-400 to-purple-500"
            }`}
          >
            {selectedProfile.type === "kids"
              ? "K"
              : selectedProfile.name.charAt(0).toUpperCase()}
            {/* {(planName === "Super" || planName === "Premium") && (
              <StarIcon className={planColor} />
            )} */}
          </div>

          {/* Hover Tooltip */}
          <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1">
            {selectedProfile.name}
            <br />
            {`${planName} Plan`}
          </span>
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white flex justify-around py-2 z-[100] md:hidden border-t border-gray-800">
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
          {/* Mobile Profile Icon */}
          <div
            className="flex items-center cursor-pointer group relative"
            onClick={switchProfile}
          >
            <div
              className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white ${
                selectedProfile.type === "kids"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : selectedProfile.avatar_color ||
                    "bg-gradient-to-br from-blue-400 to-purple-500"
              }`}
            >
              {selectedProfile.type === "kids"
                ? "K"
                : selectedProfile.name.charAt(0).toUpperCase()}
              {/* {(planName === "Super" || planName === "Premium") && (
                <StarIcon className={planColor} />
              )} */}
            </div>
          </div>
          <span className="text-xs">Profile</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
