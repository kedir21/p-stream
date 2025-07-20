// MediaCard.tsx
import { Calendar, Star, Play } from "lucide-react";
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
  mediaType = 'movie'
}: MediaCardProps) => {
  const routePath = mediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`;

  return (
    <Link to={routePath}>
      <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer w-[220px] flex-shrink-0">
        {/* Poster Image */}
        <div className="aspect-[2/3] relative overflow-hidden">
          {posterUrl ? (
            <>
              <img 
                src={posterUrl} 
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-14 h-14 bg-cyan-500/90 rounded-full flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Play className="w-5 h-5 text-white fill-current" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-8 h-8 text-cyan-400" />
                </div>
                <span className="text-sm text-gray-400 font-medium">No Image</span>
              </div>
            </div>
          )}
        
          {/* Top gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        
          {/* Rating badge */}
          {rating && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-bold text-white mt-1">{rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Type badge */}
          <div className={`absolute top-3 left-3 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold ${
            type === 'TV Show' ? 'bg-purple-500/90 text-white' : 'bg-cyan-500/90 text-white'
          }`}>
            {type}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-800">
          <h3 className="font-bold text-white text-md mb-1 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{year}</span>
            <div className="flex items-center space-x-1">
              {rating && (
                <>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{rating.toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </Link>
  );
};

export default MediaCard;