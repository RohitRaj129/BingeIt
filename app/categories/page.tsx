import Categories from "@/components/Categories";
import { Genres } from "@/typings";

export default async function CategoriesPage() {
  const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
    next: {
      revalidate: 60 * 60 * 24, // 24 hours
    },
  };

  const res = await fetch(url, options);
  const data = (await res.json()) as Genres;

  return (
    <div>
      <Categories genres={data.genres} />
    </div>
  );
}
