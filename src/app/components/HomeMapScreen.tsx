import { useState, useEffect } from 'react';
import { Search, Bell, Navigation, Plus, Minus, Layers, X, ChevronRight, Star, Clock, Headphones, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { LOCATIONS, getImageUrl } from '../data/locations';
import type { AppSettings } from '../types';
import { BottomNav } from './BottomNav';

interface HomeMapScreenProps {
  onNavigate: (screen: string, locationId?: string, tourId?: string) => void;
  activeTab: string;
  favorites: string[];
  settings: AppSettings;
}

type GpsState = 'searching' | 'found' | 'locked';
type MapStyle = 'streets' | 'terrain' | 'satellite';

const CATEGORY_FILTERS = ['All', 'Museum', 'Monument', 'Castle', 'Church', 'Nearby'];

function isCurrentlyOpen(hours: string): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun,1=Mon,...
  const hour = now.getHours() + now.getMinutes() / 60;
  if (!hours.startsWith('Daily') && day === 1) return false; // most closed Mon
  const m = hours.match(/(\d+):(\d+)–(\d+):(\d+)/);
  if (!m) return true;
  const open = parseInt(m[1]) + parseInt(m[2]) / 60;
  const close = parseInt(m[3]) + parseInt(m[4]) / 60;
  return hour >= open && hour < close;
}

function feeMatchesFilter(fee: string, filter: 'any' | 'free' | 'budget'): boolean {
  if (filter === 'any') return true;
  const isFree = fee.toLowerCase().startsWith('free');
  if (filter === 'free') return isFree;
  if (isFree) return true; // free passes budget filter too
  const m = fee.match(/€(\d+)/);
  return m ? parseInt(m[1]) <= 7 : false;
}

const MAP_STYLES: Record<MapStyle, { bg: string; water: string; road: string; building: string; park: string }> = {
  streets:   { bg: '#EDE6D8', water: '#C5D8E8', road: '#F5EFE4', building: '#D4C8B0', park: '#C8D4B0' },
  terrain:   { bg: '#D8E4CC', water: '#A8C4D8', road: '#F0EAE0', building: '#C4B89C', park: '#B4CC98' },
  satellite: { bg: '#2C3A28', water: '#1E3050', road: '#3A4040', building: '#3A3028', park: '#283820' },
};

const NOTIFICATIONS = [
  { id: 1, title: 'You\'re near Castelo de São Jorge', body: '980m away · Open until 21:00', time: '2 min ago', dot: 'bg-green-500' },
  { id: 2, title: 'New audio guide available', body: 'Torre de Belém — "Guardian of the Tagus"', time: '1h ago', dot: 'bg-[#B8842A]' },
  { id: 3, title: 'Belém Discovery Tour', body: 'Popular tour starting nearby. 3 spots left today.', time: '3h ago', dot: 'bg-[#2E5F8A]' },
];

export function HomeMapScreen({ onNavigate, activeTab, favorites, settings }: HomeMapScreenProps) {
  const [gpsState, setGpsState] = useState<GpsState>('searching');
  const [contextAlert, setContextAlert] = useState(true);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(NOTIFICATIONS.length);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'any' | 'free' | 'budget'>('any');

  useEffect(() => {
    if (!settings.gpsEnabled) return;
    const t1 = setTimeout(() => setGpsState('found'), 1200);
    const t2 = setTimeout(() => setGpsState('locked'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [settings.gpsEnabled]);

  const handleLocateMe = () => {
    setGpsState('searching');
    setTimeout(() => setGpsState('found'), 800);
    setTimeout(() => {
      setGpsState('locked');
      toast.success('Location updated');
    }, 1600);
  };

  const handleLayerToggle = () => {
    const styles: MapStyle[] = ['streets', 'terrain', 'satellite'];
    const next = styles[(styles.indexOf(mapStyle) + 1) % styles.length];
    setMapStyle(next);
    toast(`Map style: ${next.charAt(0).toUpperCase() + next.slice(1)}`, { duration: 1500 });
  };

  const handleOpenNotifications = () => {
    setShowNotifications(v => !v);
    setUnreadCount(0);
  };

  const colors = MAP_STYLES[mapStyle];
  const isSatellite = mapStyle === 'satellite';

  const filteredLocations = LOCATIONS.filter(loc => {
    const matchesCategory =
      filterCategory === 'All' ||
      (filterCategory === 'Nearby' ? parseFloat(loc.distance) < 1 : loc.category === filterCategory);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.shortName.toLowerCase().includes(q) ||
      loc.tags.some(t => t.toLowerCase().includes(q)) ||
      loc.category.toLowerCase().includes(q);
    const matchesOpen = !openNowOnly || isCurrentlyOpen(loc.hours);
    const matchesPrice = feeMatchesFilter(loc.entryFee, priceFilter);
    return matchesCategory && matchesSearch && matchesOpen && matchesPrice;
  });

  const nearbyToShow = showAll ? filteredLocations : filteredLocations.slice(0, 4);
  const selectedLocation = LOCATIONS.find(l => l.id === selectedPin);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-card px-4 pt-10 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Explore</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-foreground leading-tight">
              Lisboa Heritage
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* GPS indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs border transition-all ${
              gpsState === 'locked' ? 'bg-green-50 border-green-200 text-green-700' :
              gpsState === 'found'  ? 'bg-amber-50 border-amber-200 text-amber-700' :
              'bg-muted border-border text-muted-foreground'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                gpsState === 'locked' ? 'bg-green-500 animate-pulse' :
                gpsState === 'found'  ? 'bg-amber-500 animate-pulse' :
                'bg-gray-400'
              }`} />
              <span>{gpsState === 'locked' ? 'GPS' : gpsState === 'found' ? 'Finding…' : 'No GPS'}</span>
            </div>

            {/* Bell */}
            <div className="relative">
              <button
                onClick={handleOpenNotifications}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center relative"
              >
                <Bell size={16} className="text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C0392B] rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-11 right-0 w-72 bg-card rounded-2xl shadow-xl border border-border z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <button
                      key={n.id}
                      onClick={() => setShowNotifications(false)}
                      className="w-full flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${n.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2.5 bg-secondary rounded-xl px-3.5 py-2.5 border transition-all ${
          searchQuery ? 'border-accent ring-1 ring-accent/20' : 'border-transparent'
        }`}>
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Search museums, monuments, tours…"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowAll(true); }}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setShowAll(false); }}>
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_FILTERS.map(chip => (
            <button
              key={chip}
              onClick={() => { setFilterCategory(chip); setShowAll(true); }}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs border transition-all ${
                filterCategory === chip
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-accent'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Hour & price quick filters */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setOpenNowOnly(v => !v)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all ${
              openNowOnly ? 'bg-green-600 text-white border-green-600' : 'bg-card text-foreground border-border'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${openNowOnly ? 'bg-white' : 'bg-green-500'}`} />
            Open Now
          </button>
          <button
            onClick={() => setPriceFilter(p => p === 'free' ? 'any' : 'free')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs border transition-all ${
              priceFilter === 'free' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border'
            }`}
          >
            Free entry
          </button>
          <button
            onClick={() => setPriceFilter(p => p === 'budget' ? 'any' : 'budget')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs border transition-all ${
              priceFilter === 'budget' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border'
            }`}
          >
            Budget ≤€7
          </button>
        </div>
      </div>

      {/* Context-aware notification */}
      {contextAlert && settings.notifyNearby && gpsState === 'locked' && !searchQuery && filterCategory === 'All' && (
        <div className="flex-shrink-0 mx-4 mt-3 bg-[#FAF5EC] border border-[#B8842A]/30 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B8842A]/15 flex items-center justify-center flex-shrink-0">
            <Navigation size={14} className="text-[#B8842A]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">You're 350m from Mosteiro dos Jerónimos</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">UNESCO World Heritage · Currently open</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('details', 'mosteiro-jeronimos')}
              className="p-1.5 rounded-lg bg-[#B8842A] text-white"
            >
              <ChevronRight size={13} />
            </button>
            <button onClick={() => setContextAlert(false)} className="p-1.5 text-muted-foreground hover:text-foreground">
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden mx-4 mt-3 rounded-2xl border border-border" style={{ background: colors.bg }}>
        <svg
          viewBox="0 0 400 280"
          className="w-full h-full"
          style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
        >
          <rect width="400" height="280" fill={colors.bg} />
          <ellipse cx="200" cy="310" rx="250" ry="80" fill={colors.water} opacity="0.7" />
          <rect x="0" y="250" width="400" height="60" fill={colors.water} opacity="0.6" />
          <text x="200" y="270" textAnchor="middle" fill={isSatellite ? '#4A7090' : '#7B9EB5'} fontSize="9" fontFamily="DM Sans, sans-serif" opacity="0.7">
            Rio Tejo
          </text>
          <ellipse cx="120" cy="200" rx="35" ry="20" fill={colors.park} opacity="0.5" />
          <ellipse cx="250" cy="60"  rx="30" ry="18" fill={colors.park} opacity="0.5" />
          {[
            [20,80,55,40],[80,60,45,35],[130,75,50,30],[185,60,60,35],[250,80,45,30],[300,60,55,40],
            [355,75,40,35],[15,140,50,35],[70,130,40,30],[220,140,55,30],[280,150,50,35],[340,135,50,40],
            [30,195,50,30],[200,190,55,35],[305,185,50,35],
          ].map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill={colors.building} opacity="0.6" />
          ))}
          <rect x="0"   y="120" width="400" height="6" fill={colors.road} />
          <rect x="0"   y="170" width="400" height="5" fill={colors.road} />
          <rect x="0"   y="230" width="400" height="5" fill={colors.road} />
          <rect x="110" y="0"   width="5"   height="250" fill={colors.road} />
          <rect x="200" y="0"   width="5"   height="250" fill={colors.road} />
          <rect x="330" y="0"   width="5"   height="250" fill={colors.road} />
          {!isSatellite && (
            <>
              <text x="200" y="117" textAnchor="middle" fill="#9B8F80" fontSize="7" fontFamily="DM Sans, sans-serif">Av. da Índia</text>
              <text x="200" y="167" textAnchor="middle" fill="#9B8F80" fontSize="7" fontFamily="DM Sans, sans-serif">R. das Janelas Verdes</text>
            </>
          )}

          {/* Location Pins — only show those matching current filter */}
          {LOCATIONS.map(loc => {
            const isVisible = filteredLocations.some(f => f.id === loc.id);
            const isSelected = selectedPin === loc.id;
            const isFav = favorites.includes(loc.id);
            const pinColors: Record<string, string> = {
              Museum: '#7C3B1E', Monument: '#2E5F8A', Castle: '#4A7C59', Church: '#6B4C8A', Palace: '#8A6B2E',
            };
            const color = pinColors[loc.category] || '#7C3B1E';
            const emoji = loc.category === 'Museum' ? '🏛' : loc.category === 'Castle' ? '🏰' : loc.category === 'Church' ? '⛪' : '🗿';
            return (
              <g
                key={loc.id}
                transform={`translate(${loc.mapCoords.x}, ${loc.mapCoords.y})`}
                onClick={() => isVisible && setSelectedPin(isSelected ? null : loc.id)}
                style={{ cursor: isVisible ? 'pointer' : 'default', opacity: isVisible ? 1 : 0.2, transition: 'opacity 0.3s' }}
              >
                {isSelected && <circle r="22" fill={color} opacity="0.12" />}
                <circle r="10" fill={isSelected ? color : '#FFFDF8'} stroke={color} strokeWidth="2" />
                {isFav && !isSelected && <circle r="3.5" fill="#C9A84C" cx="7" cy="-7" />}
                <text textAnchor="middle" dominantBaseline="central" fontSize="9" fill={isSelected ? 'white' : color} fontWeight="600">
                  {emoji}
                </text>
                <text x="0" y="16" textAnchor="middle" fontSize="7" fill={isSatellite ? '#E8E0D0' : '#1C1008'} fontFamily="DM Sans, sans-serif" fontWeight="500">
                  {loc.shortName.length > 14 ? loc.shortName.slice(0, 13) + '…' : loc.shortName}
                </text>
              </g>
            );
          })}

          {/* GPS pulse */}
          {settings.gpsEnabled && gpsState !== 'searching' && (
            <g transform="translate(200, 155)">
              <circle r="28" fill="#3B82F6" opacity="0.08">
                <animate attributeName="r" from="16" to="32" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.12" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="16" fill="#3B82F6" opacity="0.12" />
              <circle r="9" fill="white" stroke="#3B82F6" strokeWidth="2" />
              <circle r="4" fill="#3B82F6" />
              <text x="0" y="20" textAnchor="middle" fontSize="7" fill="#3B82F6" fontFamily="DM Sans, sans-serif">You</text>
            </g>
          )}
        </svg>

        {/* Map Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={() => setMapZoom(z => Math.min(z + 0.2, 2))} className="w-8 h-8 bg-card rounded-lg shadow-sm border border-border flex items-center justify-center hover:bg-secondary">
            <Plus size={14} className="text-foreground" />
          </button>
          <button onClick={() => setMapZoom(z => Math.max(z - 0.2, 0.7))} className="w-8 h-8 bg-card rounded-lg shadow-sm border border-border flex items-center justify-center hover:bg-secondary">
            <Minus size={14} className="text-foreground" />
          </button>
          <button onClick={handleLayerToggle} className="w-8 h-8 bg-card rounded-lg shadow-sm border border-border flex items-center justify-center hover:bg-secondary">
            <Layers size={14} className={`${mapStyle === 'satellite' ? 'text-[#B8842A]' : mapStyle === 'terrain' ? 'text-[#4A7C59]' : 'text-foreground'}`} />
          </button>
        </div>

        {/* Locate Me */}
        {settings.gpsEnabled && (
          <button
            onClick={handleLocateMe}
            className="absolute bottom-3 right-3 w-9 h-9 bg-primary rounded-xl shadow-md flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <Navigation size={15} className="text-primary-foreground" />
          </button>
        )}

        {/* No results overlay */}
        {filteredLocations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center">
              <MapPin size={28} className="mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No locations match "{searchQuery}"</p>
            </div>
          </div>
        )}

        {/* Selected location floating card */}
        {selectedLocation && (
          <div className="absolute bottom-3 left-3 right-14 bg-card rounded-2xl shadow-lg border border-border p-3">
            <div className="flex gap-2.5">
              <img src={getImageUrl(selectedLocation.image, 120, 120)} alt={selectedLocation.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-muted" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{selectedLocation.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={9} className="text-[#B8842A] fill-[#B8842A]" />
                  <span className="text-xs text-muted-foreground">{selectedLocation.rating} · {selectedLocation.distance}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={9} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">{selectedLocation.hours}</span>
                </div>
                <button onClick={() => onNavigate('details', selectedLocation.id)} className="mt-2 text-xs font-medium text-[#7C3B1E] flex items-center gap-0.5">
                  View Details <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nearby Section */}
      <div className="flex-shrink-0 bg-card border-t border-border pt-3 pb-1">
        <div className="flex items-center justify-between px-4 mb-2">
          <h3 className="text-sm font-semibold text-foreground">
            {searchQuery || filterCategory !== 'All' ? `Results (${filteredLocations.length})` : 'Nearby'}
          </h3>
          {filteredLocations.length > 4 && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="text-xs text-[#7C3B1E] font-medium"
            >
              {showAll ? 'Show less' : `See all (${filteredLocations.length})`}
            </button>
          )}
        </div>

        {nearbyToShow.length === 0 ? (
          <p className="text-xs text-muted-foreground px-4 pb-3">No locations found.</p>
        ) : (
          <div className="flex gap-3 px-4 overflow-x-auto pb-3 scrollbar-none">
            {nearbyToShow.map(loc => (
              <button
                key={loc.id}
                onClick={() => onNavigate('details', loc.id)}
                className="flex-shrink-0 w-36 rounded-xl overflow-hidden border border-border bg-card shadow-sm text-left hover:shadow-md transition-shadow"
              >
                <div className="relative h-20 bg-muted">
                  <img src={getImageUrl(loc.image, 288, 160)} alt={loc.name} className="w-full h-full object-cover" />
                  {loc.hasAudio && (
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-1">
                      <Headphones size={9} className="text-white" />
                      <span className="text-white text-[9px]">Audio</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-foreground leading-snug line-clamp-1">{loc.shortName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={9} className="text-[#B8842A] fill-[#B8842A]" />
                    <span className="text-[10px] text-muted-foreground">{loc.rating}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{loc.distance}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  );
}
