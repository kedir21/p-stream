import { Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface MediaCardProps {
  id: number;
  title: string;
  year: number;
  type: "Movie" | "TV Show";
  rating?: number;
  posterUrl?: string;
  mediaType?: 'movie' | 'tv';
}

const MediaCard = ({ 
  id, 
  title, 
  year, 
  type, 
  rating, 
  posterUrl,
  mediaType = 'movie' // Default to movie if not specified
}: MediaCardProps) => {
  // Determine the correct route based on mediaType
  const routePath = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`;

  return (
    <Link to={routePath}>
      <div className="group relative bg-gradient-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-2 cursor-pointer min-w-[200px] flex-shrink-0">
        {/* Poster Image */}
        <div className="aspect-[2/3] bg-ocean-light relative overflow-hidden">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ocean-mid to-ocean-light flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-cyan-bright/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-8 h-8 text-cyan-bright" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">No Image</span>
              </div>
            </div>
          )}
        
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 bg-ocean-deep/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-foreground font-medium">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Type badge */}
          <div className={`absolute top-2 left-2 backdrop-blur-sm rounded-lg px-2 py-1 ${
            type === 'TV Show' ? 'bg-purple-500/20' : 'bg-cyan-bright/20'
          }`}>
            <span className={`text-xs font-medium ${
              type === 'TV Show' ? 'text-purple-400' : 'text-cyan-bright'
            }`}>
              {type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 leading-tight group-hover:text-cyan-bright transition-colors">
            {title}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>{year}</span>
            {rating && (
              <>
                <span>•</span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                  {rating.toFixed(1)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl bg-cyan-bright/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};

export default MediaCard;