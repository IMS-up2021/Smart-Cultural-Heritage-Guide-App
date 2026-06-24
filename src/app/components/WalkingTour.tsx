import { useState, useEffect, useRef } from 'react';
import {
  ChevronRight, Clock, Route, MapPin, Play, Pause, SkipForward,
  SkipBack, CheckCircle, Circle, ArrowLeft, Headphones, Star,
  Navigation as NavIcon, ChevronLeft, Volume2, Footprints,
} from 'lucide-react';
import { TOURS, LOCATIONS, getImageUrl, getTour, getLocation } from '../data/locations';
import { BottomNav } from './BottomNav';

interface WalkingTourProps {
  onNavigate: (screen: string, locationId?: string, tourId?: string) => void;
  activeTab: string;
  selectedTourId: string | null;
  favorites: string[];
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function TourCard({ tourId, onStart, onViewDetails }: {
  tourId: string;
  onStart: (id: string) => void;
  onViewDetails: (locationId: string) => void;
}) {
  const tour = getTour(tourId);
  if (!tour) return null;
  const firstLoc = getLocation(tour.locationIds[0]);

  const diffColor = {
    Easy: 'text-green-700 bg-green-50 border-green-200',
    Moderate: 'text-amber-700 bg-amber-50 border-amber-200',
    Challenging: 'text-red-700 bg-red-50 border-red-200',
  }[tour.difficulty];

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
      <div className="relative h-36">
        <img
          src={getImageUrl(tour.image, 600, 288)}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${diffColor}`}>
            {tour.difficulty}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/20">
            {tour.theme}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-base leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
            {tour.name}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tour.description}</p>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          {[
            { icon: Clock, value: tour.duration },
            { icon: Route, value: tour.distance },
            { icon: MapPin, value: `${tour.stops} stops` },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon size={12} className="text-accent" />
              <span>{value}</span>
            </div>
          ))}
        </div>

        {/* Stops preview */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {tour.locationIds.map(locId => {
            const loc = getLocation(locId);
            if (!loc) return null;
            return (
              <button
                key={locId}
                onClick={() => onViewDetails(locId)}
                className="flex-shrink-0 text-center hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-border bg-muted hover:border-accent transition-colors">
                  <img src={getImageUrl(loc.image, 96, 96)} alt={loc.shortName} className="w-full h-full object-cover" />
                </div>
                <p className="text-[9px] text-muted-foreground mt-1 w-12 truncate">{loc.shortName}</p>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onStart(tour.id)}
          className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-medium text-sm flex items-center justify-center gap-2"
        >
          <Footprints size={15} />
          Start Tour
        </button>
      </div>
    </div>
  );
}

function ActiveTour({ tourId, onExit, onViewLocation }: {
  tourId: string;
  onExit: () => void;
  onViewLocation: (locationId: string) => void;
}) {
  const tour = getTour(tourId);
  const [currentStop, setCurrentStop] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!tour) return null;

  const currentLocationId = tour.locationIds[currentStop];
  const currentLoc = getLocation(currentLocationId);
  const audioDuration = currentLoc?.audioDuration ?? 300;

  useEffect(() => {
    if (audioPlaying) {
      intervalRef.current = setInterval(() => {
        setAudioTime(t => {
          if (t >= audioDuration) { setAudioPlaying(false); return 0; }
          return t + 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [audioPlaying, audioDuration]);

  const handleNextStop = () => {
    if (currentStop < tour.stops - 1) {
      setCurrentStop(s => s + 1);
      setAudioTime(0);
      setAudioPlaying(false);
    }
  };

  const handlePrevStop = () => {
    if (currentStop > 0) {
      setCurrentStop(s => s - 1);
      setAudioTime(0);
      setAudioPlaying(false);
    }
  };

  if (!currentLoc) return null;

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-card px-4 pt-10 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft size={16} className="text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground">Active Tour</p>
            <h2 className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
              {tour.name}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-primary">Stop {currentStop + 1}/{tour.stops}</p>
            <p className="text-[10px] text-muted-foreground">{tour.distance}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex gap-1.5">
          {tour.locationIds.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all ${
                i < currentStop ? 'bg-primary' :
                i === currentStop ? 'bg-accent' :
                'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Map with route */}
      <div className="flex-shrink-0 mx-4 mt-3 rounded-2xl overflow-hidden border border-border h-40 bg-[#EDE6D8] relative">
        <svg viewBox="0 0 400 180" className="w-full h-full">
          <rect width="400" height="180" fill="#EDE6D8" />
          <rect x="0" y="130" width="400" height="60" fill="#C5D8E8" opacity="0.6" />
          {/* Roads */}
          <rect x="0" y="100" width="400" height="6" fill="#F5EFE4" />
          <rect x="0" y="120" width="400" height="5" fill="#F5EFE4" />
          <rect x="180" y="0" width="5" height="130" fill="#F5EFE4" />
          {/* Buildings */}
          {[
            [15, 20, 55, 28], [75, 15, 50, 32], [130, 22, 55, 25],
            [190, 15, 60, 30], [255, 18, 50, 28], [310, 14, 65, 32],
            [15, 60, 50, 24], [70, 58, 48, 26], [225, 60, 50, 24], [295, 58, 60, 28],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#D4C8B0" opacity="0.5" />
          ))}

          {/* Tour route path */}
          <path
            d={tour.mapPath}
            stroke="#B8842A"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6,4"
            opacity="0.8"
          />

          {/* Stop markers */}
          {tour.locationIds.map((locId, i) => {
            const loc = getLocation(locId);
            if (!loc) return null;
            const scaleY = 180 / 280;
            const y = Math.min(loc.mapCoords.y * scaleY, 120);
            return (
              <g key={locId} transform={`translate(${loc.mapCoords.x}, ${y})`}>
                <circle
                  r="10"
                  fill={i < currentStop ? '#B8842A' : i === currentStop ? '#7C3B1E' : '#FFFDF8'}
                  stroke={i === currentStop ? '#7C3B1E' : '#B8842A'}
                  strokeWidth="2"
                />
                {i < currentStop ? (
                  <text textAnchor="middle" dominantBaseline="central" fontSize="9" fill="white">✓</text>
                ) : (
                  <text textAnchor="middle" dominantBaseline="central" fontSize="8" fill={i === currentStop ? 'white' : '#B8842A'} fontWeight="600">
                    {i + 1}
                  </text>
                )}
                <text x="0" y="16" textAnchor="middle" fontSize="7" fill="#1C1008" fontFamily="DM Sans">
                  {loc.shortName.length > 10 ? loc.shortName.slice(0, 9) + '…' : loc.shortName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Current stop info */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Stop card */}
        <div
          className="rounded-2xl overflow-hidden border border-border bg-card cursor-pointer"
          onClick={() => onViewLocation(currentLocationId)}
        >
          <div className="relative h-24">
            <img
              src={getImageUrl(currentLoc.image, 600, 192)}
              alt={currentLoc.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center px-4 gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-xs font-bold">{currentStop + 1}</span>
              </div>
              <div>
                <p className="text-white text-xs text-opacity-75">Current Stop</p>
                <h3
                  className="text-white font-semibold text-base leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {currentLoc.name}
                </h3>
              </div>
              <div className="ml-auto">
                <ChevronRight size={18} className="text-white/60" />
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star size={11} className="text-[#B8842A] fill-[#B8842A]" />
                <span>{currentLoc.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} />
                <span>{currentLoc.hours}</span>
              </div>
              <div className="flex items-center gap-1 ml-auto text-[#7C3B1E] font-medium">
                <Headphones size={11} />
                <span>Chapter {tour.tourStops[currentStop]?.audioChapter}</span>
              </div>
            </div>
            {currentStop < tour.stops - 1 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground border-t border-border pt-2">
                <NavIcon size={11} className="text-accent" />
                <span>Next: {tour.tourStops[currentStop + 1]?.walkTime} walk ({tour.tourStops[currentStop + 1]?.walkDistance}) to {getLocation(tour.locationIds[currentStop + 1])?.shortName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stops list */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">All Stops</h3>
          <div className="space-y-2">
            {tour.locationIds.map((locId, i) => {
              const loc = getLocation(locId);
              if (!loc) return null;
              const isCompleted = i < currentStop;
              const isCurrent = i === currentStop;
              return (
                <div
                  key={locId}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isCurrent ? 'border-primary/40 bg-primary/5' :
                    isCompleted ? 'border-[#B8842A]/30 bg-[#B8842A]/5 opacity-70' :
                    'border-border bg-card opacity-50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={18} className="text-[#B8842A] flex-shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] text-white font-bold">{i + 1}</span>
                    </div>
                  ) : (
                    <Circle size={18} className="text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{loc.name}</p>
                    {i > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        {tour.tourStops[i]?.walkTime} · {tour.tourStops[i]?.walkDistance}
                      </p>
                    )}
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    isCurrent ? 'bg-primary text-primary-foreground' :
                    isCompleted ? 'bg-[#B8842A]/20 text-[#B8842A]' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? 'Done' : isCurrent ? 'Here' : `Ch. ${tour.tourStops[i]?.audioChapter}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audio Guide mini player */}
      <div className="flex-shrink-0 bg-card border-t border-border px-4 py-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            <img src={getImageUrl(currentLoc.image, 72, 72)} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Chapter {tour.tourStops[currentStop]?.audioChapter}: {currentLoc.audioTitle}</p>
            <p className="text-[10px] text-muted-foreground">{formatTime(audioTime)} / {formatTime(audioDuration)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAudioTime(t => Math.max(0, t - 15))} className="text-muted-foreground hover:text-foreground">
              <SkipBack size={16} />
            </button>
            <button
              onClick={() => setAudioPlaying(!audioPlaying)}
              className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            >
              {audioPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button onClick={() => setAudioTime(t => Math.min(audioDuration, t + 15))} className="text-muted-foreground hover:text-foreground">
              <SkipForward size={16} />
            </button>
          </div>
        </div>

        {/* Audio progress */}
        <div className="h-1 bg-secondary rounded-full mb-3">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(audioTime / audioDuration) * 100}%` }}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePrevStop}
            disabled={currentStop === 0}
            className="flex-1 h-10 bg-secondary text-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <ChevronLeft size={15} />
            Previous
          </button>
          {currentStop < tour.stops - 1 ? (
            <button
              onClick={handleNextStop}
              className="flex-1 h-10 bg-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
            >
              Next Stop
              <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={onExit}
              className="flex-1 h-10 bg-[#4A7C59] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
            >
              <CheckCircle size={15} />
              Finish Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function WalkingTour({ onNavigate, activeTab, selectedTourId, favorites }: WalkingTourProps) {
  const [activeTourId, setActiveTourId] = useState<string | null>(
    selectedTourId && TOURS.find(t => t.id === selectedTourId) ? selectedTourId : null
  );
  const [pendingTourId, setPendingTourId] = useState<string | null>(null);

  // Pre-start confirmation modal
  const pendingTour = pendingTourId ? getTour(pendingTourId) : null;

  if (activeTourId) {
    return (
      <ActiveTour
        tourId={activeTourId}
        onExit={() => setActiveTourId(null)}
        onViewLocation={(locId) => onNavigate('details', locId)}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-background relative">
      {/* Pre-start confirmation overlay */}
      {pendingTour && (
        <div className="absolute inset-0 z-50 bg-black/50 flex flex-col justify-end">
          <div className="bg-card rounded-t-3xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Ready to start</p>
                <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {pendingTour.name}
                </h3>
              </div>
              <button onClick={() => setPendingTourId(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <ChevronRight size={14} className="text-muted-foreground rotate-180" />
              </button>
            </div>

            <div className="flex gap-3">
              {[
                { Icon: Clock,  value: pendingTour.duration, label: 'Duration' },
                { Icon: Route,  value: pendingTour.distance, label: 'Distance' },
                { Icon: MapPin, value: `${pendingTour.stops} stops`, label: 'Stops' },
              ].map(({ Icon, value, label }) => (
                <div key={label} className="flex-1 bg-secondary rounded-xl p-3 text-center">
                  <Icon size={14} className="text-accent mx-auto mb-1" />
                  <p className="text-xs font-semibold text-foreground">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              {pendingTour.tourStops.map((stop, i) => {
                const loc = getLocation(stop.locationId);
                if (!loc) return null;
                return (
                  <div key={stop.locationId} className="flex items-center gap-2.5 py-1">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="text-xs text-foreground flex-1">{loc.name}</span>
                    {i > 0 && <span className="text-[10px] text-muted-foreground">{stop.walkTime}</span>}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setPendingTourId(null)}
                className="flex-1 h-11 bg-secondary text-foreground border border-border rounded-xl text-sm font-medium">
                Maybe Later
              </button>
              <button onClick={() => { setActiveTourId(pendingTourId); setPendingTourId(null); }}
                className="flex-[2] h-11 bg-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                <Footprints size={15} /> Begin Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 bg-card px-4 pt-10 pb-4 border-b border-border">
        <p className="text-xs text-muted-foreground">Guided Experiences</p>
        <h2
          className="text-xl font-semibold text-foreground"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Walking Tours
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Audio-guided routes through Lisbon's heritage sites
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Feature badge */}
        <div className="bg-[#FAF5EC] border border-[#B8842A]/25 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#B8842A]/15 flex items-center justify-center flex-shrink-0">
            <Headphones size={16} className="text-[#B8842A]" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">Professional Audio Guides</p>
            <p className="text-[10px] text-muted-foreground">Narrated by local historians · Multiple languages</p>
          </div>
        </div>

        {/* Tour cards */}
        {TOURS.map(tour => (
          <TourCard
            key={tour.id}
            tourId={tour.id}
            onStart={setPendingTourId}
            onViewDetails={(locId) => onNavigate('details', locId)}
          />
        ))}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '12', label: 'Tours', sub: 'Available' },
            { value: '48+', label: 'Sites', sub: 'Covered' },
            { value: '6', label: 'Languages', sub: 'Supported' },
          ].map(({ value, label, sub }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <p
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {value}
              </p>
              <p className="text-xs font-medium text-foreground">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  );
}
