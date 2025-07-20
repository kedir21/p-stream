import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MediaCarousel from "@/components/MovieCarousel";
import { useTrending, useLatestMovies, usePopularMovies, usePopularTVShows } from "@/hooks/useTMDB";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: trendingData = [], isLoading: trendingLoading } = useTrending();
  const { data: latestData = [], isLoading: latestLoading } = useLatestMovies();
  const { data: popularMovies = [], isLoading: popularMoviesLoading } = usePopularMovies();
  const { data: popularTVShows = [], isLoading: popularTVShowsLoading } = usePopularTVShows();

  return (
    <div className="min-h-screen bg-gradient-ocean">
      <Header />
      <Hero />
      
      <main className="relative z-10">
        {/* Loading states */}
        {(trendingLoading || latestLoading || popularMoviesLoading || popularTVShowsLoading) && (
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-bright border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-foreground">Loading content...</p>
          </div>
        )}

        {/* Latest Releases */}
        {!latestLoading && latestData.length > 0 && (
          <MediaCarousel
            title="Latest Releases"
            items={latestData}
            viewMoreLink="/discover?category=movie"
            mediaType="movie"
          />
        )}

        {/* Trending */}
        {!trendingLoading && trendingData.length > 0 && (
          <MediaCarousel
            title="Trending Now"
            items={trendingData}
            viewMoreLink="/discover"
          />
        )}

        {/* Popular Movies */}
        {!popularMoviesLoading && popularMovies.length > 0 && (
          <MediaCarousel
            title="Popular Movies"
            items={popularMovies}
            viewMoreLink="/discover?category=movie"
            mediaType="movie"
          />
        )}

        {/* TV Shows */}
        {!popularTVShowsLoading && popularTVShows.length > 0 && (
          <MediaCarousel
            title="Popular TV Shows"
            items={popularTVShows}
            viewMoreLink="/discover?category=tv"
            mediaType="tv"
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-ocean-deep border-t border-ocean-light py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-ocean rounded-lg flex items-center justify-center">
                <span className="text-cyan-bright font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">P-Stream</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Your ultimate destination for movies and TV shows. Built with React, TypeScript, and TMDB API.
            </p>
            <div className="mt-6 flex justify-center space-x-6 text-sm">
              <Link to="/discover?category=movie" className="text-muted-foreground hover:text-cyan-bright transition-colors">
                Movies
              </Link>
              <Link to="/discover?category=tv" className="text-muted-foreground hover:text-cyan-bright transition-colors">
                TV Shows
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;