import { useState } from 'react';
import { Heart, Star, Clock, MapPin, Search, SlidersHorizontal, Check, X, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { LOCATIONS, getImageUrl } from '../data/locations';
import { BottomNav } from './BottomNav';

interface FavoritesScreenProps {
  onNavigate: (screen: string, locationId?: string) => void;
  activeTab: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const CATEGORIES = ['All', 'Museum', 'Monument', 'Castle', 'Church'];

const LAST_VISITED: Record<string, string> = {
  'mosteiro-jeronimos': '2 days ago',
  'castelo-sao-jorge': '1 week ago',
  'museu-fado': '3 weeks ago',
  'museu-nacional': 'Yesterday',
  'torre-belem': '5 days ago',
  'museu-azulejo': '2 weeks ago',
};

type SortKey = 'name' | 'rating' | 'distance' | 'visited';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'visited', label: 'Recently Visited' },
  { key: 'rating',  label: 'Highest Rated' },
  { key: 'name',    label: 'Name A–Z' },
  { key: 'distance',label: 'Nearest First' },
];

const VISITED_ORDER = ['museu-nacional', 'mosteiro-jeronimos', 'torre-belem', 'castelo-sao-jorge', 'museu-azulejo', 'museu-fado'];

export function FavoritesScreen({ onNavigate, activeTab, favorites, onToggleFavorite }: FavoritesScreenProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('visited');
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const favoriteLocations = LOCATIONS.filter(loc => favorites.includes(loc.id));
  const filtered = favoriteLocations
    .filter(loc => {
      const matchesCategory = activeCategory === 'All' || loc.category === activeCategory;
      const matchesSearch = !searchQuery || loc.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortKey === 'name')     return a.name.localeCompare(b.name);
      if (sortKey === 'rating')   return b.rating - a.rating;
      if (sortKey === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      // visited: order by VISITED_ORDER
      return VISITED_ORDER.indexOf(a.id) - VISITED_ORDER.indexOf(b.id);
    });

  return (
    <div className="w-full h-full flex flex-col bg-background relative">
      {/* Share sheet overlay */}
      {showShareSheet && (
        <div className="absolute inset-0 z-50 bg-black/40 flex flex-col justify-end" onClick={() => setShowShareSheet(false)}>
          <div className="bg-card rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Share Collection</p>
                <p className="text-xs text-muted-foreground">{favoriteLocations.length} saved places</p>
              </div>
              <button onClick={() => setShowShareSheet(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <X size={13} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Copy link to collection', action: () => { toast.success('Link copied to clipboard!'); setShowShareSheet(false); } },
                { label: 'Share via WhatsApp',      action: () => { toast('Opening WhatsApp…'); setShowShareSheet(false); } },
                { label: 'Send by email',           action: () => { toast('Opening email…'); setShowShareSheet(false); } },
              ].map(opt => (
                <button key={opt.label} onClick={opt.action}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl hover:bg-muted transition-colors text-left">
                  <Share2 size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 bg-card px-4 pt-10 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Your Collection</p>
            <h2
              className="text-xl font-semibold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Saved Places
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{favoriteLocations.length} saved</span>
            <Heart size={14} className="text-[#C0392B] fill-[#C0392B]" />
            {favoriteLocations.length > 0 && (
              <button
                onClick={() => setShowShareSheet(v => !v)}
                className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Share2 size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-3 py-2.5">
            <Search size={14} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search saved places…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button
            onClick={() => setShowSortPanel(v => !v)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showSortPanel ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
          >
            <SlidersHorizontal size={15} />
          </button>
        </div>

        {/* Sort panel */}
        {showSortPanel && (
          <div className="mt-2 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-foreground">Sort by</span>
              <button onClick={() => setShowSortPanel(false)} className="text-muted-foreground">
                <X size={13} />
              </button>
            </div>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => { setSortKey(opt.key); setShowSortPanel(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary/50 transition-colors"
              >
                <span className={`text-xs ${sortKey === opt.key ? 'text-primary font-medium' : 'text-foreground'}`}>{opt.label}</span>
                {sortKey === opt.key && <Check size={13} className="text-primary" />}
              </button>
            ))}
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs border transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Heart size={24} className="text-muted-foreground opacity-40" />
            </div>
            {favoriteLocations.length === 0 ? (
              <>
                <p className="text-sm font-medium text-foreground">No saved places yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Tap the heart icon on any location to save it here for quick access.
                </p>
                <button
                  onClick={() => onNavigate('home')}
                  className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
                >
                  Explore Locations
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">No matches found</p>
                <p className="text-xs text-muted-foreground">Try a different filter or search term.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(loc => (
              <div
                key={loc.id}
                className="bg-card rounded-2xl border border-border overflow-hidden flex"
              >
                <button
                  onClick={() => onNavigate('details', loc.id)}
                  className="flex-1 flex gap-3 p-3 text-left hover:bg-secondary/30 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                    <img
                      src={getImageUrl(loc.image, 160, 160)}
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="text-[9px] bg-black/50 text-white backdrop-blur-sm rounded-md px-1.5 py-0.5">
                        {loc.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <h3 className="text-sm font-semibold text-foreground leading-snug mb-1 line-clamp-2">
                      {loc.name}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1.5">
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-[#B8842A] fill-[#B8842A]" />
                        <span>{loc.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{loc.distance}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={9} />
                        <span>Visited {LAST_VISITED[loc.id] ?? 'recently'}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {loc.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-secondary rounded-md text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                      {loc.hasAudio && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#7C3B1E]/10 rounded-md text-[#7C3B1E]">
                          Audio
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Remove button */}
                <div className="flex flex-col items-center justify-center pr-3 pl-1">
                  <button
                    onClick={() => onToggleFavorite(loc.id)}
                    className="w-8 h-8 rounded-full bg-[#C0392B]/10 flex items-center justify-center hover:bg-[#C0392B]/20 transition-colors"
                  >
                    <Heart size={14} className="text-[#C0392B] fill-[#C0392B]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  );
}
