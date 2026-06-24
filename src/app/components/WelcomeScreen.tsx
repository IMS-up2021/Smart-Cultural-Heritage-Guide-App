import { useState, useEffect } from 'react';
import { MapPin, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const LANGUAGES = ['English', 'Português', 'Español', 'Français', 'Deutsch'];

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [language, setLanguage] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [gpsGranted, setGpsGranted] = useState<boolean | null>(null);
  const [showGpsPrompt, setShowGpsPrompt] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    const t2 = setTimeout(() => setShowGpsPrompt(true), 900);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const handleGetStarted = () => {
    if (gpsGranted === null) {
      setShowGpsPrompt(true);
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0C0A07]">
      {/* Hero image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1649452843752-663493034117?w=800&h=1200&fit=crop&auto=format"
          alt="Grand museum hall with classical statues and skylight"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/85" />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-5 pt-10 pb-4 z-10">
        <div className="flex items-center gap-1.5 text-white/60 text-xs">
          <MapPin size={12} />
          <span>Lisboa, Portugal</span>
        </div>
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="flex items-center gap-1.5 text-white/70 text-xs border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm"
        >
          <Globe size={11} />
          <span>{language}</span>
        </button>
        {showLangMenu && (
          <div className="absolute top-16 right-5 bg-[#1C1008]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-50">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                className={`block w-full px-5 py-2.5 text-left text-xs transition-colors ${
                  language === lang ? 'text-[#B8842A] bg-white/5' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 z-10">
        <div
          className="transition-all duration-700"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(24px)' }}
        >
          {/* Logo mark */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#B8842A] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L3 6v9h4v-5h4v5h4V6L9 2z" fill="white" fillOpacity="0.9" />
                <circle cx="9" cy="5.5" r="1.5" fill="white" />
              </svg>
            </div>
            <span className="text-white/60 text-xs tracking-[0.15em] uppercase">Smart Cultural Heritage</span>
          </div>

          {/* Title */}
          <h1
            className="text-white mb-3 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.4rem', fontWeight: 700 }}
          >
            Discover<br />
            <span className="text-[#C9A84C] italic">Living</span> History
          </h1>

          <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-xs">
            Audio-guided tours, rich media archives, and real-time GPS navigation — all for Lisbon's most iconic cultural sites.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 mb-8">
            {[
              { value: '48', label: 'Sites' },
              { value: '12', label: 'Tours' },
              { value: '200+', label: 'Audio Guides' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div className="text-white/50 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* GPS Permission prompt */}
          {showGpsPrompt && gpsGranted === null && (
            <div
              className="mb-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all duration-500"
              style={{ opacity: showGpsPrompt ? 1 : 0 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#B8842A]/20 border border-[#B8842A]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="text-[#C9A84C]" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-0.5">Enable Location Services</p>
                  <p className="text-white/55 text-xs leading-relaxed">
                    Allow GPS access to discover nearby heritage sites and get personalised tour recommendations.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { setGpsGranted(true); setShowGpsPrompt(false); }}
                      className="flex-1 bg-[#B8842A] text-white text-xs font-medium py-2 rounded-lg"
                    >
                      Allow Access
                    </button>
                    <button
                      onClick={() => { setGpsGranted(false); setShowGpsPrompt(false); }}
                      className="px-4 bg-white/10 text-white/70 text-xs py-2 rounded-lg"
                    >
                      Not Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gpsGranted === true && (
            <div className="mb-5 bg-green-500/15 border border-green-500/25 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-xs">Location services enabled — GPS active</span>
            </div>
          )}

          {gpsGranted === false && (
            <div className="mb-5 bg-white/8 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <MapPin size={14} className="text-white/40" />
              <span className="text-white/50 text-xs">Browse without location — manual search available</span>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleGetStarted}
            className="w-full h-14 bg-[#7C3B1E] hover:bg-[#8B4520] text-white font-medium rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>Begin Your Journey</span>
            <ChevronRight size={18} />
          </button>

          <p className="text-center text-white/35 text-xs mt-4">
            Free to explore · Premium audio guides available
          </p>
        </div>
      </div>
    </div>
  );
}
