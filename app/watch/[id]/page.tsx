import { getMovieTrailer, getTvTrailer } from "@/lib/getVideoKey";

interface WatchPageProps {
  params: { id: number };
  searchParams: { type?: string };
}

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  const type = searchParams.type;
  let videoKey: string | null = null;

  if (type === "tv") {
    videoKey = await getTvTrailer(params.id.toString());
  } else {
    videoKey = await getMovieTrailer(params.id.toString());
  }

  return (
    <main className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      {videoKey ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="YouTube trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <p className="text-white text-lg">Trailer not available</p>
      )}
    </main>
  );
}
