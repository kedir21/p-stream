import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Calendar } from "lucide-react";

const TMDB_API_KEY = '4f10ec4dbb0a90737737dc9ffd5506c3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface DiscoverItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  media_type?: string;
}

interface DiscoverResponse {
  results: DiscoverItem[];
  total_pages: number;
  total_results: number;
}

const MOVIE_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const TV_GENRES: Record<number, string> = {
  10759: "Action & Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 10762: "Kids",
  9648: "Mystery", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy",
  10766: "Soap", 10767: "Talk", 10768: "War & Politics", 37: "Western"
};

const Discover = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'movie';
  const [content, setContent] = useState<DiscoverItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  const getImageUrl = (path?: string, size: string = 'w500'): string => {
    if (!path) return '/placeholder.svg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getGenres = (genreIds: number[]) => {
    const genreMap = category === 'tv' ? TV_GENRES : MOVIE_GENRES;
    return genreIds.slice(0, 2).map(id => genreMap[id]).filter(Boolean);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'tv': return 'TV Shows';
      case 'editor': return 'Editor Picks';
      default: return 'Movies';
    }
  };

  const fetchContent = async (page: number = 1, append: boolean = false) => {
    if (page === 1) {
      setLoading(true);
      setContent([]);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
      let endpoint = '';
      
      if (category === 'movie') {
        endpoint = `/discover/movie?sort_by=popularity.desc`;
      } else if (category === 'tv') {
        endpoint = `/discover/tv?sort_by=popularity.desc`;
      } else if (category === 'editor') {
        endpoint = `/trending/all/week`;
      }

      const response = await fetch(
        `${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data: DiscoverResponse = await response.json();
      
      if (append && page > 1) {
        setContent(prev => [...prev, ...data.results]);
      } else {
        setContent(data.results);
      }
      
      setCurrentPage(page);
      setHasMorePages(page < data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMorePages) {
      fetchContent(currentPage + 1, true);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setHasMorePages(true);
    fetchContent(1, false);
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-darker pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ocean-darker pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => fetchContent(1, false)} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-darker pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-cyan-bright hover:text-cyan-bright/80">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{getCategoryTitle()}</h1>
          <Badge variant="secondary" className="ml-2">
            {content.length} items
          </Badge>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {content.map((item) => {
            const title = item.title || item.name || 'Unknown Title';
            const releaseDate = item.release_date || item.first_air_date;
            const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
            const genres = getGenres(item.genre_ids);
            
            // Determine correct route based on media type or category
            const isTV = item.media_type === 'tv' || category === 'tv';
            const routePath = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;
            
            return (
              <Link 
                key={item.id} 
                to={routePath}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg bg-ocean-mid/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-bright/20">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={getImageUrl(item.poster_path)}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-white/90">
                          {item.vote_average.toFixed(1)}
                        </span>
                        {year && (
                          <>
                            <Calendar className="h-3 w-3 text-white/70" />
                            <span className="text-xs text-white/70">{year}</span>
                          </>
                        )}
                      </div>
                      
                      {genres.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {genres.map((genre) => (
                            <Badge 
                              key={genre} 
                              variant="secondary" 
                              className="text-xs py-0 px-2 bg-cyan-bright/20 text-cyan-bright border-cyan-bright/30"
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-cyan-bright transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {year} • ⭐ {item.vote_average.toFixed(1)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMorePages && (
          <div className="flex justify-center mt-12">
            <Button 
              onClick={loadMore}
              disabled={loadingMore}
              variant="outline"
              className="px-8 py-3 text-cyan-bright border-cyan-bright hover:bg-cyan-bright hover:text-ocean-deep"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;