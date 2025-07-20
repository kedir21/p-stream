import { useQuery } from '@tanstack/react-query';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '4f10ec4dbb0a90737737dc9ffd5506c3';

interface Genre {
  id: number;
  name: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path?: string;
  runtime?: number;
  vote_average: number;
  vote_count: number;
  air_date?: string;
}

interface Season {
  air_date?: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  season_number: number;
  episodes?: Episode[];
}

interface TMDBMovieBase {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count: number;
  media_type?: 'movie' | 'tv';
}

interface TMDBMovie extends TMDBMovieBase {
  release_date?: string;
  runtime?: number;
  genres: Genre[];
  production_countries?: ProductionCountry[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
  similar?: {
    results: TMDBMovieBase[];
  };
}

interface TMDBTVShow extends TMDBMovieBase {
  first_air_date?: string;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
  similar?: {
    results: TMDBMovieBase[];
  };
}

interface TVSeasonDetails {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

interface TMDBResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
}

const fetchTMDB = async <T>(endpoint: string): Promise<T> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured');
  }

  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const normalizeMovieData = <T extends TMDBMovieBase>(data: T): T => ({
  ...data,
  title: data.title || data.name || 'Unknown Title',
  media_type: data.media_type || (data.name ? 'tv' : 'movie')
});

// Hook for getting trending content
export const useTrending = (timeWindow: 'day' | 'week' = 'day') => {
  return useQuery<TMDBMovieBase[]>({
    queryKey: ['trending', timeWindow],
    queryFn: async () => {
      const data = await fetchTMDB<TMDBResponse<TMDBMovieBase>>(`/trending/all/${timeWindow}`);
      return data.results.map(normalizeMovieData);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });
};

// Hook for getting now playing movies
export const useLatestMovies = () => {
  return useQuery<TMDBMovie[]>({
    queryKey: ['latestMovies'],
    queryFn: async () => {
      const data = await fetchTMDB<TMDBResponse<TMDBMovie>>('/movie/now_playing');
      return data.results.map(normalizeMovieData);
    },
    staleTime: 1000 * 60 * 60 // 1 hour
  });
};

// Hook for getting popular movies
export const usePopularMovies = () => {
  return useQuery<TMDBMovie[]>({
    queryKey: ['popularMovies'],
    queryFn: async () => {
      const data = await fetchTMDB<TMDBResponse<TMDBMovie>>('/movie/popular');
      return data.results.map(normalizeMovieData);
    },
    staleTime: 1000 * 60 * 60 * 4 // 4 hours
  });
};

// Hook for getting top rated movies
export const useTopRatedMovies = () => {
  return useQuery<TMDBMovie[]>({
    queryKey: ['topRatedMovies'],
    queryFn: async () => {
      const data = await fetchTMDB<TMDBResponse<TMDBMovie>>('/movie/top_rated');
      return data.results.map(normalizeMovieData);
    },
    staleTime: 1000 * 60 * 60 * 12 // 12 hours
  });
};

// Hook for getting popular TV shows
export const usePopularTVShows = () => {
  return useQuery<TMDBTVShow[]>({
    queryKey: ['popularTVShows'],
    queryFn: async () => {
      const data = await fetchTMDB<TMDBResponse<TMDBTVShow>>('/tv/popular');
      return data.results.map(normalizeMovieData);
    },
    staleTime: 1000 * 60 * 60 * 4 // 4 hours
  });
};

// Hook for multi search
export const useSearchMulti = (query: string) => {
  return useQuery<TMDBMovieBase[]>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const data = await fetchTMDB<TMDBResponse<TMDBMovieBase>>(`/search/multi?query=${encodeURIComponent(query)}`);
      return data.results.map(normalizeMovieData);
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

// Hook for movie details
export const useMovieDetails = (id: number) => {
  return useQuery<TMDBMovie>({
    queryKey: ['movieDetails', id],
    queryFn: async () => {
      const data = await fetchTMDB<TMDBMovie>(`/movie/${id}?append_to_response=credits,videos,similar`);
      return normalizeMovieData(data);
    }
  });
};

// Hook for TV show details
export const useTVDetails = (id: number) => {
  return useQuery<TMDBTVShow>({
    queryKey: ['tvDetails', id],
    queryFn: async () => {
      const data = await fetchTMDB<TMDBTVShow>(`/tv/${id}?append_to_response=credits,videos,similar`);
      return normalizeMovieData(data);
    }
  });
};

// Hook for TV season details
export const useTVSeasonDetails = (tvId: number, seasonNumber: number, enabled = true) => {
  return useQuery<TVSeasonDetails>({
    queryKey: ['tvSeason', tvId, seasonNumber],
    queryFn: async () => {
      const data = await fetchTMDB<TVSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
      return data;
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 60 // 1 hour
  });
};