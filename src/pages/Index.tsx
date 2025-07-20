import { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MediaCarousel from "@/components/MovieCarousel";
import { useTrending, useLatestMovies, usePopularMovies, usePopularTVShows } from "@/hooks/useTMDB";
import { Film, Tv, Sparkles, Clapperboard } from "lucide-react";
import { Button } from '@/components/ui/button';

const Index = () => {
  const { data: trendingData = [], isLoading: trendingLoading } = useTrending();
  const { data: latestData = [], isLoading: latestLoading } = useLatestMovies();
  const { data: popularMovies = [], isLoading: popularMoviesLoading } = usePopularMovies();
  const { data: popularTVShows = [], isLoading: popularTVShowsLoading } = usePopularTVShows();

  // Parallax effects
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], ["0%", "50%"]);

  // Dynamic gradient
  const getRandomGradient = () => {
    const gradients = [
      "from-purple-900/30 via-black to-blue-900/30",
      "from-cyan-900/30 via-black to-violet-900/30",
      "from-rose-900/30 via-black to-indigo-900/30"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Preload carousel data
  useEffect(() => {
    if (!trendingLoading && trendingData.length > 0) {
      trendingData.slice(0, 3).forEach(item => {
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
      });
    }
  }, [trendingLoading, trendingData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 overflow-x-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-400/10 rounded-full"
            style={{
              width: Math.random() * 5 + 1 + 'px',
              height: Math.random() * 5 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <Header />
      
      {/* Hero with parallax */}
      <motion.div style={{ opacity, y }} ref={targetRef}>
        <Hero />
      </motion.div>

      <main className="relative z-10">
        {/* Loading animation */}
        {(trendingLoading || latestLoading || popularMoviesLoading || popularTVShowsLoading) && (
          <div className="container mx-auto px-4 py-16 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block h-16 w-16 rounded-full border-4 border-solid border-cyan-500 border-r-transparent"
            >
              <Film className="w-6 h-6 mx-auto mt-4 text-cyan-400" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              className="mt-6 text-xl text-gray-300"
            >
              Preparing your cinematic experience...
            </motion.p>
          </div>
        )}

        {/* Content sections with staggered animations */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {/* Latest Releases */}
          {!latestLoading && latestData.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <MediaCarousel
                title={
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <span>Latest Releases</span>
                  </div>
                }
                items={latestData}
                viewMoreLink="/discover?category=movie"
                mediaType="movie"
                className="bg-gradient-to-r from-blue-900/20 to-black/50 py-12"
              />
            </motion.div>
          )}

          {/* Trending */}
          {!trendingLoading && trendingData.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <MediaCarousel
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                    <span>Trending Now</span>
                  </div>
                }
                items={trendingData}
                viewMoreLink="/discover"
                className={`py-12 bg-gradient-to-r ${getRandomGradient()}`}
              />
            </motion.div>
          )}

          {/* Popular Movies */}
          {!popularMoviesLoading && popularMovies.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MediaCarousel
                title={
                  <div className="flex items-center gap-3">
                    <Film className="w-6 h-6 text-cyan-400" />
                    <span>Popular Movies</span>
                  </div>
                }
                items={popularMovies}
                viewMoreLink="/discover?category=movie"
                mediaType="movie"
                className="py-12 bg-gradient-to-r from-cyan-900/20 to-black/50"
              />
            </motion.div>
          )}

          {/* TV Shows */}
          {!popularTVShowsLoading && popularTVShows.length > 0 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <MediaCarousel
                title={
                  <div className="flex items-center gap-3">
                    <Tv className="w-6 h-6 text-purple-400" />
                    <span>Popular TV Shows</span>
                  </div>
                }
                items={popularTVShows}
                viewMoreLink="/discover?category=tv"
                mediaType="tv"
                className="py-12 bg-gradient-to-r from-purple-900/20 to-black/50"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Premium CTA */}
        <div className="relative overflow-hidden mt-16 mx-4 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-purple-900/40 border border-gray-700/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
          <div className="relative z-10 p-12 text-center">
            <Clapperboard className="w-12 h-12 mx-auto text-cyan-400 mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Unlimited Entertainment</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join millions of users discovering their next favorite movie or TV show.
            </p>
            <Button asChild className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg">
              <Link to="/discover">Explore Now</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Cinematic Footer */}
      <footer className="relative mt-24 py-16 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-gray-800/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CineStream
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
              <div>
                <h4 className="text-gray-300 font-medium mb-4">Discover</h4>
                <ul className="space-y-3">
                  <li><Link to="/discover" className="text-gray-400 hover:text-cyan-400 transition-colors">Popular</Link></li>
                  <li><Link to="/discover?category=movie" className="text-gray-400 hover:text-cyan-400 transition-colors">Movies</Link></li>
                  <li><Link to="/discover?category=tv" className="text-gray-400 hover:text-cyan-400 transition-colors">TV Shows</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-gray-300 font-medium mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">About</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800/50 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CineStream. Powered by TMDB API.
            </p>
          </div>
        </div>
      </footer>

      {/* Global styles for animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Index;