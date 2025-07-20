import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Play, Star, Calendar, Clock, Globe, X, ChevronDown, List, Tv, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import MediaCarousel from "../components/MovieCarousel";
import { useMovieDetails, useTVDetails, useTVSeasonDetails, useRecommendations } from "@/hooks/useTMDB";

const MediaDetails = ({ mediaType }: { mediaType: 'movie' | 'tv' }) => {
  const { id } = useParams<{ id: string }>();
  const movieDetails = useMovieDetails(Number(id));
  const tvDetails = useTVDetails(Number(id));
  const { data: media, isLoading, error } = mediaType === 'movie' ? movieDetails : tvDetails;
  const { data: recommendations } = useRecommendations(mediaType, Number(id));
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedProvider, setSelectedProvider] = useState('vidsrc');
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const { data: seasonData } = useTVSeasonDetails(
    Number(id),
    selectedSeason,
    mediaType === 'tv'
  );

  interface Episode {
    id: number;
    name: string;
    overview: string;
    episode_number: number;
    still_path?: string;
    runtime?: number;
    vote_average: number;
  }

  const providers = [
    { id: 'vidsrc', name: 'VidSrc', url: `https://vidsrc.cc/v2/embed/${mediaType}/${id}` },
    { id: 'vidsrcxyz', name: 'VidSrc XYZ', url: `https://vidsrc.xyz/embed/${mediaType}/${id}` },
    { id: '2embed', name: '2Embed', url: `https://www.2embed.cc/embed/${mediaType}/${id}` }
  ];

  // Load episodes when season changes
  useEffect(() => {
    if (mediaType === 'tv' && seasonData?.episodes) {
      setEpisodes(seasonData.episodes);
      setSelectedEpisode(seasonData.episodes[0]);
    }
  }, [seasonData, mediaType]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            {mediaType === 'tv' ? (
              <Tv className="w-8 h-8 text-cyan-500" />
            ) : (
              <Film className="w-8 h-8 text-cyan-500" />
            )}
          </div>
          <p className="text-white/80">Preparing cinematic experience...</p>
        </div>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error?.message || 'Content not found'}</p>
          <Button asChild variant="outline" className="border-cyan-500 text-cyan-500">
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getImageUrl = (path?: string, size: string = 'original') => {
    if (!path) return undefined;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getTrailer = () => {
    if (!media.videos?.results) return null;
    return media.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
  };

  const mainCast = media.credits?.cast.slice(0, 6) || [];
  const director = media.credits?.crew.find(person => person.job === 'Director');
  const trailer = getTrailer();
  const title = media.title || media.name || 'Unknown Title';
  const releaseYear = new Date(media.release_date || media.first_air_date || '').getFullYear();
  const runtime = mediaType === 'movie' 
    ? media.runtime 
    : media.episode_run_time?.[0];

  return (
    <div className="min-h-screen  text-white">
      {/* Enhanced Cinematic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {media.backdrop_path ? (
          <div className="relative w-full h-full">
            <img
              src={getImageUrl(media.backdrop_path, 'w1920')}
              alt={title}
              className="w-full h-full object-cover blur-sm opacity-20 scale-105"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 via-purple-900/30 to-black" />
        )}
      </div>

      {/* Header with Glass Morphism Effect */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Button asChild variant="ghost" size="sm" className="hover:bg-cyan-500/10">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4 text-cyan-500" />
              <span className="text-cyan-500">Back</span>
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hover:bg-cyan-500/10">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-cyan-500/10">
              <List className="w-4 h-4 text-cyan-500" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Title Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
            {/* Premium Poster with Parallax Effect */}
            <div className="flex-shrink-0 w-full lg:w-80 relative group">
              <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:shadow-cyan-500/30">
                {media.poster_path ? (
                  <img
                    src={getImageUrl(media.poster_path, 'w500')}
                    alt={title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center">
                    {mediaType === 'tv' ? (
                      <Tv className="w-16 h-16 text-cyan-500/50" />
                    ) : (
                      <Film className="w-16 h-16 text-cyan-500/50" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <Button 
                    onClick={() => setShowPlayer(true)}
                    size="sm"
                    className="mx-auto bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    <span>Play</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Media Info */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {title}
                <span className="text-cyan-400 ml-3 text-2xl lg:text-4xl font-normal">
                  ({releaseYear})
                </span>
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full border border-yellow-400/30">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{media.vote_average.toFixed(1)}</span>
                </div>
                
                {releaseYear && (
                  <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                    <Calendar className="w-4 h-4" />
                    <span>{releaseYear}</span>
                  </div>
                )}

                {runtime && runtime > 0 && (
                  <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                    <Clock className="w-4 h-4" />
                    <span>{formatRuntime(runtime)}</span>
                  </div>
                )}

                {mediaType === 'tv' && media.number_of_seasons && (
                  <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                    <span>
                      {media.number_of_seasons} season
                      {typeof media.number_of_seasons === 'number' && media.number_of_seasons !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {media.production_countries?.[0] && (
                  <div className="flex items-center space-x-1 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                    <Globe className="w-4 h-4" />
                    <span>{media.production_countries[0].name}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {media.genres.map((genre) => (
                  <Badge 
                    key={genre.id} 
                    className="bg-cyan-500/10 text-cyan-500 border-cyan-500/30 hover:bg-cyan-500/20 hover:scale-105 transition-transform"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Overview */}
              <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-3xl">
                {media.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  onClick={() => setShowPlayer(true)}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40 transition-all"
                >
                  <Play className="w-5 h-5 mr-2" />
                  <span>Watch Now</span>
                </Button>
                
                {trailer && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
                    asChild
                  >
                    <a 
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      <span>Trailer</span>
                    </a>
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10 hover:text-white"
                >
                  + Watchlist
                </Button>
              </div>

              {/* Director (for movies) */}
              {director && mediaType === 'movie' && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-2">Director</h3>
                  <p className="text-white/80">{director.name}</p>
                </div>
              )}

              {/* Season Selector (for TV shows) */}
              {mediaType === 'tv' && media.seasons && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Seasons & Episodes</h3>
                  <div className="flex gap-4">
                    <Select
                      value={selectedSeason.toString()}
                      onValueChange={(value) => setSelectedSeason(Number(value))}
                    >
                      <SelectTrigger className="w-[180px] bg-black/50 border-white/20 text-white">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/10 backdrop-blur-lg">
                        {media.seasons.map((season) => (
                          <SelectItem 
                            key={season.season_number} 
                            value={season.season_number.toString()}
                            className="hover:bg-white/10 focus:bg-white/10"
                          >
                            Season {season.season_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {seasonData?.poster_path && (
                      <div className="hidden md:block w-24 h-24 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(seasonData.poster_path, 'w200')}
                          alt={`Season ${selectedSeason}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Season Overview */}
                  {seasonData?.overview && (
                    <p className="text-white/70 mt-4 max-w-3xl">{seasonData.overview}</p>
                  )}

                  {/* Episodes List */}
                  {episodes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-white mb-4">Episodes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {episodes.map((episode) => (
                          <div 
                            key={episode.id} 
                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedEpisode?.id === episode.id ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}
                            onClick={() => setSelectedEpisode(episode)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                                {episode.still_path ? (
                                  <img
                                    src={getImageUrl(episode.still_path, 'w200')}
                                    alt={episode.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Tv className="w-6 h-6 text-white/30" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h5 className="font-medium text-white">
                                  Episode {episode.episode_number}: {episode.name}
                                </h5>
                                <div className="flex items-center mt-1 text-sm text-white/60">
                                  <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                                  <span className="mr-2">{episode.vote_average.toFixed(1)}</span>
                                  {episode.runtime && (
                                    <>
                                      <Clock className="w-3 h-3 mr-1" />
                                      <span>{formatRuntime(episode.runtime)}</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-sm text-white/70 mt-2 line-clamp-2">
                                  {episode.overview || 'No description available'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Premium Player Modal */}
          {showPlayer && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col">
              <div className="container mx-auto px-4 pt-6 pb-12 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    <span className="text-cyan-500">Now Playing:</span> {title}
                    {mediaType === 'tv' && selectedEpisode && (
                      <span className="text-white/70 ml-2">- S{selectedSeason}E{selectedEpisode.episode_number}</span>
                    )}
                  </h2>
                  <Button 
                    onClick={() => setShowPlayer(false)}
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Player Container */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6">
                  {/* Video Player */}
                  <div className="flex-1 relative rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={selectedProvider === 'vidsrc' && mediaType === 'tv' && selectedEpisode
                        ? `https://vidsrc.cc/v2/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`
                        : providers.find(p => p.id === selectedProvider)?.url}
                      className="w-full h-full border-0"
                      allowFullScreen
                      title={`Watch ${title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>

                  {/* Player Controls Sidebar */}
                  <div className="w-full lg:w-80 bg-black/50 border border-white/10 rounded-xl p-4 backdrop-blur-lg">
                    {/* Provider Selection */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-white/70 mb-2">STREAMING PROVIDER</h3>
                      <div className="flex flex-wrap gap-2">
                        {providers.map(provider => (
                          <Button
                            key={provider.id}
                            variant={selectedProvider === provider.id ? "default" : "outline"}
                            size="sm"
                            className={`text-xs ${selectedProvider === provider.id 
                              ? 'bg-cyan-500 text-white' 
                              : 'border-white/20 text-white hover:bg-white/10'}`}
                            onClick={() => setSelectedProvider(provider.id)}
                          >
                            {provider.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Episode Selection (TV Shows) */}
                    {mediaType === 'tv' && episodes.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-white/70 mb-2">EPISODES</h3>
                        <ScrollArea className="h-64 pr-2">
                          <div className="space-y-2">
                            {episodes.map((episode) => (
                              <div
                                key={episode.id}
                                className={`p-2 rounded-md cursor-pointer text-sm ${selectedEpisode?.id === episode.id 
                                  ? 'bg-cyan-500/20 border border-cyan-500/50' 
                                  : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                                onClick={() => setSelectedEpisode(episode)}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-sm overflow-hidden bg-white/5 flex-shrink-0">
                                    {episode.still_path ? (
                                      <img
                                        src={getImageUrl(episode.still_path, 'w92')}
                                        alt={episode.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Tv className="w-3 h-3 text-white/30" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      <span className="text-cyan-400">E{episode.episode_number}</span>: {episode.name}
                                    </p>
                                    <div className="flex items-center text-xs text-white/60">
                                      <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                                      <span>{episode.vote_average.toFixed(1)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Media Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-white/70 mb-2">ABOUT</h3>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="bg-cyan-500/10 text-cyan-500 px-2 py-1 rounded text-xs">
                          {mediaType === 'movie' ? 'Movie' : 'TV Show'}
                        </span>
                        <span className="text-white/70">{releaseYear}</span>
                        {runtime && runtime > 0 && (
                          <span className="text-white/70">{formatRuntime(runtime)}</span>
                        )}
                        <span className="flex items-center text-white/70">
                          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                          {media.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 line-clamp-3">
                        {selectedEpisode?.overview || media.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Cast Section */}
          {mainCast.length > 0 && (
            <section className="py-12 relative">
              <div className="absolute inset-0 -z-10 " />
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-8 relative">
                  <span className="relative z-10">Cast</span>
                  <span className="absolute -bottom-1 left-0 w-20 h-1 bg-cyan-500 rounded-full"></span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {mainCast.map((actor) => (
                    <div key={actor.id} className="group text-center relative">
                      <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 relative transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                        {actor.profile_path ? (
                          <img
                            src={getImageUrl(actor.profile_path, 'w300')}
                            alt={actor.name}
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-cyan-500/50">
                                {actor.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="text-center w-full">
                            <p className="text-white text-sm font-medium">{actor.character}</p>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">
                        {actor.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Premium Recommendations Section */}
          {recommendations && recommendations.length > 0 && (
            <section className="py-12 relative">
              <div className="absolute inset-0 -z-10 " />
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-white mb-8 relative">
                  <span className="relative z-10">Recommended For You</span>
                  <span className="absolute -bottom-1 left-0 w-20 h-1 bg-cyan-500 rounded-full"></span>
                </h2>
                <MediaCarousel
                  items={recommendations.map(m => ({
                    ...m,
                    title: m.title || m.name || 'Unknown Title',
                    release_date: m.release_date || m.first_air_date
                  }))}
                  mediaType={mediaType}
                  carouselClassName="px-0"
                  itemClassName="px-2"
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;