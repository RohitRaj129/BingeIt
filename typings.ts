// Genre Types
export type Genre = {
  id: number;
  name: string;
};

export type Genres = {
  genres: Genre[];
};

// Movie Type
export type Movie = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// TV Series Type
export type TvSeries = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
};

// TV Season Info
export type TvSeason = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
};

// TV Episode Info
export type TvEpisode = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  season_number: number;
  vote_average: number;
  vote_count: number;
};

// Cast Member Only
export type CastMember = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  character: string;
  credit_id: string;
  order: number;
};

// TV Credits (Cast only)
export type TvCredits = {
  id: number;
  cast: CastMember[];
};

// Search Results
export type SearchResults = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type TvSearchResults = {
  page: number;
  results: TvSeries[];
  total_pages: number;
  total_results: number;
};
