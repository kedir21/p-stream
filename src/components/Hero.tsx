import { Search, Play, ChevronRight, Star, Film, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDiscoverMedia } from "@/hooks/useTMDB";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie");
  const inputRef = useRef<HTMLInputElement>(null);
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch trending content for background
  const { data: trendingMedia } = useQuery({
    queryKey: ['trendingHero'],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      return data.results.filter((item: any) => item.backdrop_path).slice(0, 3);
    }
  });

  // Search functionality
  const { data: searchResults, refetch: searchMedia } = useDiscoverMedia(
    activeTab,
    searchQuery
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) searchMedia();
  };

  return (
    <section className="relative h-screen max-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Cinematic Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Dynamic TMDB Backdrop */}
        {trendingMedia?.[0]?.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${trendingMedia[0].backdrop_path}`}
            alt="Cinematic backdrop"
            className="w-full h-full object-cover object-center scale-105"
            loading="eager"
          />
        )}

        {/* Dark Overlays */}
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 " />
        
        {/* Cinematic Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Lens Flares */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full  blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl" />
          
          {/* Film Grain Effect */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAiLz48ZyBvcGFjaXR5PSIwLjAzIj48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4PSIwIiB5PSIwIiBmaWxsPSIjZmZmIi8+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMiIgeD0iNCIgeT0iMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIHg9IjgiIHk9IjAiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] opacity-10" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
        {/* Cinematic Icons */}
        <div className="flex justify-center gap-6 mb-8 opacity-70">
          <Film className="w-10 h-10 text-cyan-400" />
          <Clapperboard className="w-10 h-10 text-purple-400" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-bebas tracking-wide">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Find Your Next
          </span>{" "}
          <br />Obsession
        </h1>

        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
          Discover thousands of movies and TV shows. Perfect entertainment awaits.
        </p>

        {/* Premium Search Component */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab === 'movie' ? 'movies' : 'TV shows'}...`}
                className="pl-14 pr-28 py-7 text-lg bg-black/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 backdrop-blur-sm rounded-xl shadow-xl transition-all"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <Button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'movie' ? 'tv' : 'movie')}
                  className="px-3 py-1 text-xs bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 rounded-lg border border-gray-700 transition-colors"
                >
                  {activeTab === 'movie' ? 'TV Shows' : 'Movies'}
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 rounded-lg shadow-lg transition-all"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {searchResults && searchResults.length > 0 && (
            <div className="absolute z-20 mt-3 w-full bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/${activeTab}/${item.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-0"
                  >
                    <img
                      src={item.poster_path 
                        ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                        : '/placeholder-poster.jpg'}
                      alt={item.title || item.name || 'Unknown'}
                      className="w-14 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-white">
                        {item.title || item.name || 'Unknown Title'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <span>
                          {item.release_date || item.first_air_date
                            ? new Date(item.release_date || item.first_air_date).getFullYear()
                            : 'N/A'}
                        </span>
                        <span className="mx-2">•</span>
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrolling Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-4 border-cyan-400/80 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-cyan-400/80 mt-2 rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;