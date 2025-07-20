// MediaCarousel.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaCard from "./MovieCard";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  media_type?: 'movie' | 'tv';
}

interface MediaCarouselProps {
  title: string;
  items?: MediaItem[];
  viewMoreLink?: string;
  mediaType?: 'movie' | 'tv';
  className?: string;
}

const MediaCarousel = ({ 
  title, 
  items = [], 
  viewMoreLink, 
  mediaType,
  className = ''
}: MediaCarouselProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 500; // Increased scroll amount
    const container = scrollContainerRef.current;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [items]);

  const getMediaPoster = (posterPath?: string) => {
    if (!posterPath) return undefined;
    return `https://image.tmdb.org/t/p/w500${posterPath}`; // Higher quality images
  };

  const getMediaYear = (releaseDate?: string, firstAirDate?: string): number => {
    const date = releaseDate || firstAirDate;
    if (!date) return 0;
    return new Date(date).getFullYear();
  };

  const getMediaTitle = (item: MediaItem) => {
    return item.title || item.name || 'Unknown Title';
  };

  const getMediaType = (item: MediaItem) => {
    if (mediaType) return mediaType === 'movie' ? 'Movie' : 'TV Show';
    return item.media_type === 'tv' ? 'TV Show' : 'Movie';
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {title}
            <span className="block w-16 h-1 bg-cyan-500 mt-2 rounded-full"></span>
          </h2>
          {viewMoreLink && (
            <Button asChild variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
              <Link to={viewMoreLink}>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Left scroll button */}
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm hover:bg-black/90 w-12 h-12 rounded-full shadow-lg border border-gray-700/50 transition-all duration-300 hover:scale-110"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </Button>
          )}

          {/* Right scroll button */}
          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm hover:bg-black/90 w-12 h-12 rounded-full shadow-lg border border-gray-700/50 transition-all duration-300 hover:scale-110"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </Button>
          )}

          {/* Media container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <div key={item.id} className="flex-shrink-0 first:pl-0 last:pr-0">
                <MediaCard
                  id={item.id}
                  title={getMediaTitle(item)}
                  year={getMediaYear(item.release_date, item.first_air_date)}
                  type={getMediaType(item)}
                  rating={item.vote_average}
                  posterUrl={getMediaPoster(item.poster_path)}
                  mediaType={mediaType || item.media_type}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaCarousel;