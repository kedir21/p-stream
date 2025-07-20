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
  items?: MediaItem[]; // Make items optional
  viewMoreLink?: string;
  mediaType?: 'movie' | 'tv';
}

const MediaCarousel = ({ 
  title, 
  items = [], // Provide default empty array
  viewMoreLink, 
  mediaType 
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
    
    const scrollAmount = 400;
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
    return `https://image.tmdb.org/t/p/w342${posterPath}`;
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

  // Don't render if there are no items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          {viewMoreLink && (
            <Button asChild variant="link" className="text-cyan-bright hover:text-cyan-bright/80">
              <Link to={viewMoreLink}>
                View more →
              </Link>
            </Button>
          )}
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Left scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-ocean-deep/80 backdrop-blur-sm hover:bg-ocean-mid/80 border border-ocean-light/30 transition-all duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Right scroll button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-ocean-deep/80 backdrop-blur-sm hover:bg-ocean-mid/80 border border-ocean-light/30 transition-all duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Media container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={getMediaTitle(item)}
                year={getMediaYear(item.release_date, item.first_air_date)}
                type={getMediaType(item)}
                rating={item.vote_average}
                posterUrl={getMediaPoster(item.poster_path)}
                mediaType={mediaType || item.media_type}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaCarousel;