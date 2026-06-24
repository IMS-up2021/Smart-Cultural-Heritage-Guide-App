import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Share2, Heart, Star, Clock, MapPin, Phone, Globe,
  Play, Pause, SkipBack, SkipForward, Volume2, ChevronRight, ChevronDown,
  Headphones, Video, Image, Map, ExternalLink, Info, Navigation as NavIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { getLocation, getImageUrl } from '../data/locations';

interface LocationDetailsProps {
  locationId: string;
  onBack: () => void;
  onNavigate: (screen: string, locationId?: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  contentMode: 'explorer' | 'scholar';
}

type TabId = 'overview' | 'media' | 'map';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AudioPlayer({ title, duration, imageId }: { title: string; duration: number; imageId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= duration) { setIsPlaying(false); return 0; }
          return t + speed;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, duration, speed]);

  const progress = (currentTime / duration) * 100;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(ratio * duration));
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Audio thumbnail */}
      <div className="relative h-28 bg-muted">
        <img
          src={getImageUrl(imageId, 600, 224)}
          alt="Audio guide cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white text-xs font-medium leading-snug">{title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Headphones size={11} className="text-white/70" />
              <span className="text-white/60 text-[10px]">Audio Guide</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Volume2 size={10} className="text-white" />
            <span className="text-white text-[10px]">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4">
        {/* Progress bar */}
        <div className="mb-3">
          <div
            className="h-1.5 bg-secondary rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary rounded-full transition-all relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-card shadow-sm" />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground font-mono">{formatTime(currentTime)}</span>
            <span className="text-[10px] text-muted-foreground font-mono">-{formatTime(duration - currentTime)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentTime(t => Math.max(0, t - 15))}
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipBack size={20} />
            <span className="text-[9px]">15s</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentTime(t => Math.min(duration, t + 15))}
            className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward size={20} />
            <span className="text-[9px]">15s</span>
          </button>
        </div>

        {/* Speed */}
        <div className="flex justify-center gap-2 mt-3">
          {[0.75, 1, 1.25, 1.5, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                speed === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoPlayer({ imageId, name }: { imageId: string; name: string }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const totalDuration = 245;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed(t => {
          if (t >= totalDuration) { setPlaying(false); return 0; }
          return t + 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-black cursor-pointer"
      style={{ aspectRatio: '16/9' }}
      onClick={() => setPlaying(!playing)}
    >
      <img
        src={getImageUrl(imageId, 600, 338)}
        alt={`${name} video`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${playing ? 'opacity-60' : 'opacity-80'}`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all ${
          playing ? 'opacity-70' : 'opacity-100'
        }`}>
          {playing ? <Pause size={22} className="text-white" /> : <Play size={22} className="text-white ml-1" />}
        </div>
      </div>
      {playing && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center gap-2">
            <span className="text-white text-[10px] font-mono">{formatTime(elapsed)}</span>
            <div className="flex-1 h-0.5 bg-white/30 rounded-full">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${(elapsed / totalDuration) * 100}%` }}
              />
            </div>
            <span className="text-white text-[10px] font-mono">{formatTime(totalDuration)}</span>
          </div>
        </div>
      )}
      {!playing && (
        <div className="absolute top-2 right-2 bg-black/50 rounded-md px-2 py-0.5">
          <span className="text-white text-[10px]">{formatTime(totalDuration)}</span>
        </div>
      )}
    </div>
  );
}

function ExhibitList({ exhibits }: { exhibits: { name: string; period: string }[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const BLURBS = [
    'One of the most celebrated works in the collection, attracting scholars and visitors from around the world.',
    'A masterpiece of craftsmanship, this piece exemplifies the technical and artistic achievements of its era.',
    'Rarely seen outside Portugal, this exhibit offers a unique window into its cultural and historical context.',
    'A highlight of the permanent collection, recently conserved to restore its original vibrancy and detail.',
    'Acquired through a landmark bequest, this work transformed the museum\'s holdings when it arrived.',
  ];
  return (
    <div className="space-y-2">
      {exhibits.map((exhibit, i) => (
        <div
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className="bg-card rounded-xl border border-border hover:border-accent/50 transition-colors cursor-pointer overflow-hidden"
        >
          <div className="flex items-center gap-3 p-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{exhibit.name}</p>
              <p className="text-[10px] text-muted-foreground">{exhibit.period}</p>
            </div>
            <ChevronDown
              size={13}
              className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}
            />
          </div>
          {expanded === i && (
            <div className="px-3 pb-3 pt-0">
              <div className="border-t border-border pt-2.5">
                <p className="text-xs text-muted-foreground leading-relaxed">{BLURBS[i % BLURBS.length]}</p>
                <button
                  onClick={e => { e.stopPropagation(); toast(`Learn more about: ${exhibit.name}`); }}
                  className="mt-2 text-[11px] text-[#7C3B1E] font-medium flex items-center gap-1"
                >
                  Learn more <ChevronRight size={11} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function LocationDetails({
  locationId,
  onBack,
  onNavigate,
  favorites,
  onToggleFavorite,
  contentMode,
}: LocationDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const location = getLocation(locationId);

  if (!location) return null;

  const isFavorite = favorites.includes(location.id);
  const descriptionText = location.description[contentMode];

  const TABS: { id: TabId; label: string; Icon: typeof Info }[] = [
    { id: 'overview', label: 'Overview', Icon: Info },
    { id: 'media', label: 'Media', Icon: Headphones },
    { id: 'map', label: 'Location', Icon: Map },
  ];

  const categoryColors: Record<string, string> = {
    Museum: 'bg-[#7C3B1E]/10 text-[#7C3B1E]',
    Monument: 'bg-[#2E5F8A]/10 text-[#2E5F8A]',
    Castle: 'bg-[#4A7C59]/10 text-[#4A7C59]',
    Church: 'bg-[#6B4C8A]/10 text-[#6B4C8A]',
    Palace: 'bg-[#8A6B2E]/10 text-[#8A6B2E]',
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Hero Image */}
      <div className="relative flex-shrink-0">
        <div className="relative h-52 bg-muted overflow-hidden">
          <img
            src={getImageUrl(location.galleryImages[galleryIndex], 800, 416)}
            alt={location.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-black/25" />

          {/* Gallery dots */}
          {location.galleryImages.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {location.galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className={`rounded-full transition-all ${
                    i === galleryIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Top controls */}
        <div className="absolute top-10 left-4 right-4 flex justify-between">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Link copied to clipboard!')}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center"
            >
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={() => onToggleFavorite(location.id)}
              className={`w-9 h-9 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all ${
                isFavorite
                  ? 'bg-[#C0392B]/80 border-[#C0392B]/60'
                  : 'bg-black/40 border-white/20'
              }`}
            >
              <Heart size={16} className={isFavorite ? 'text-white fill-white' : 'text-white'} />
            </button>
          </div>
        </div>
      </div>

      {/* Header info */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-card border-b border-border">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h1
              className="text-foreground leading-tight mb-1"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600 }}
            >
              {location.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColors[location.category]}`}>
                {location.category}
              </span>
              {location.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <Star size={13} className="text-[#B8842A] fill-[#B8842A]" />
              <span className="text-sm font-semibold text-foreground">{location.rating}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{location.reviews.toLocaleString()} reviews</p>
          </div>
        </div>

        {/* Quick info row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{location.period}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={11} />
            <span>{location.distance} away</span>
          </div>
          {contentMode === 'scholar' && (
            <div className="ml-auto flex items-center gap-1 text-[#7C3B1E]">
              <span className="text-[9px] font-medium px-2 py-0.5 bg-[#7C3B1E]/10 rounded-full">Scholar Mode</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex-shrink-0 flex bg-card border-b border-border">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-3 text-xs font-medium transition-all border-b-2 ${
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="p-4 space-y-5">
            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm text-foreground leading-relaxed">{descriptionText}</p>
            </div>

            {/* Visit info */}
            <div className="bg-secondary rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visit Information</h3>
              {[
                { Icon: Clock,  label: 'Opening Hours', value: location.hours,   action: null },
                { Icon: MapPin, label: 'Address',       value: location.address, action: () => { setActiveTab('map'); } },
                { Icon: Phone,  label: 'Entry Fee',     value: location.entryFee, action: null },
                { Icon: Globe,  label: 'Website',       value: location.website, action: () => toast(`Opening ${location.website}…`) },
              ].map(({ Icon, label, value, action }) => (
                <div
                  key={label}
                  className={`flex items-start gap-3 ${action ? 'cursor-pointer group' : ''}`}
                  onClick={action ?? undefined}
                >
                  <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className={`text-xs font-medium ${action ? 'text-[#7C3B1E] group-hover:underline' : 'text-foreground'}`}>{value}</p>
                  </div>
                  {action && <ExternalLink size={11} className="text-muted-foreground mt-1 flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* Exhibits */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Highlights</h3>
              <ExhibitList exhibits={location.exhibits} /></div>
          </div>
        )}

        {/* MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="p-4 space-y-5">
            {/* Audio Guide */}
            {location.hasAudio && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Audio Guide</h3>
                <AudioPlayer
                  title={location.audioTitle}
                  duration={location.audioDuration}
                  imageId={location.image}
                />
              </div>
            )}

            {/* Video */}
            {location.hasVideo && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Documentary</h3>
                <VideoPlayer imageId={location.galleryImages[1] || location.image} name={location.name} />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  "{location.shortName}: Five Centuries of History" — 4:05
                </p>
              </div>
            )}

            {/* Photo Gallery */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {location.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setGalleryIndex(i); setActiveTab('overview'); }}
                    className="aspect-square rounded-xl overflow-hidden bg-muted relative"
                  >
                    <img
                      src={getImageUrl(img, 200, 200)}
                      alt={`${location.name} photo ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {i === location.galleryImages.length - 1 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-center gap-1">
                          <Image size={12} className="text-white" />
                          <span className="text-white text-[10px] font-medium">{location.galleryImages.length}</span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!location.hasAudio && !location.hasVideo && (
              <div className="text-center py-8 text-muted-foreground">
                <Headphones size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No audio or video available for this location.</p>
              </div>
            )}
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="p-4 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-border">
              <svg viewBox="0 0 400 200" className="w-full" style={{ aspectRatio: '2/1' }}>
                <rect width="400" height="200" fill="#EDE6D8" />
                <rect x="0" y="130" width="400" height="70" fill="#C5D8E8" opacity="0.6" />
                <rect x="0" y="90" width="400" height="8" fill="#F5EFE4" />
                <rect x="0" y="115" width="400" height="6" fill="#F5EFE4" />
                <rect x="180" y="0" width="6" height="150" fill="#F5EFE4" />
                <rect x="280" y="0" width="5" height="150" fill="#F5EFE4" />
                {[
                  [15, 20, 60, 30], [80, 15, 50, 35], [135, 25, 55, 28],
                  [195, 15, 60, 32], [260, 20, 55, 30], [320, 15, 65, 35],
                  [15, 60, 55, 25], [75, 58, 50, 28], [230, 60, 50, 25], [300, 58, 60, 30],
                ].map(([x, y, w, h], i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#D4C8B0" opacity="0.5" />
                ))}
                {/* Location pin */}
                <g transform={`translate(${location.mapCoords.x}, ${location.mapCoords.y > 150 ? 110 : location.mapCoords.y})`}>
                  <circle r="18" fill="#7C3B1E" opacity="0.12" />
                  <circle r="9" fill="#7C3B1E" />
                  <circle r="3.5" fill="white" />
                  <text x="0" y="22" textAnchor="middle" fontSize="8" fill="#1C1008" fontFamily="DM Sans, sans-serif" fontWeight="500">
                    {location.shortName.length > 16 ? location.shortName.slice(0, 15) + '…' : location.shortName}
                  </text>
                </g>
                {/* User location */}
                <g transform="translate(200, 120)">
                  <circle r="5" fill="#3B82F6" />
                  <circle r="2" fill="white" />
                </g>
                <text x="200" y="105" textAnchor="middle" fontSize="7" fill="#3B82F6" fontFamily="DM Sans">You</text>
                <text x="200" y="145" textAnchor="middle" fill="#7B9EB5" fontSize="8" fontFamily="DM Sans, sans-serif" opacity="0.7">Rio Tejo</text>
              </svg>
            </div>

            <div className="bg-secondary rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                  <MapPin size={13} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Full Address</p>
                  <p className="text-xs text-foreground font-medium">{location.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                  <Video size={13} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Distance from you</p>
                  <p className="text-xs text-foreground font-medium">{location.distance} · approximately {location.distance.includes('km') ? '18 min walk' : '2 min walk'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => toast(`Opening ${location.name} in Maps…`)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <NavIcon size={16} />
              Open in Maps
            </button>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="flex-shrink-0 bg-card border-t border-border p-4">
        <div className="flex gap-3">
          {location.hasAudio && (
            <button
              onClick={() => setActiveTab('media')}
              className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            >
              <Headphones size={16} />
              Audio Guide
            </button>
          )}
          <button
            onClick={() => setActiveTab('map')}
            className={`${location.hasAudio ? 'flex-1' : 'flex-[2]'} h-12 bg-secondary text-foreground border border-border rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:border-accent transition-colors`}
          >
            <MapPin size={16} />
            Directions
          </button>
          {!location.hasAudio && (
            <button
              onClick={() => onToggleFavorite(location.id)}
              className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all ${
                isFavorite ? 'bg-[#C0392B]/10 border-[#C0392B]/30 text-[#C0392B]' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
