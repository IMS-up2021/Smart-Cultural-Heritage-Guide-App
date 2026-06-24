import { useState } from 'react';
import {
  User, Globe, MapPin, Bell, BookOpen, Accessibility,
  ChevronRight, Info, Shield, HelpCircle, Sliders,
  GraduationCap, Compass, X, Edit2, Moon, Sun,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AppSettings } from '../types';
import { BottomNav } from './BottomNav';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  activeTab: string;
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
        value ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          value ? 'translate-x-5.5' : 'translate-x-0.5'
        }`}
        style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function SettingsRow({
  icon: Icon, label, sublabel, children, onClick,
}: {
  icon: typeof User; label: string; sublabel?: string; children?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? 'cursor-pointer hover:bg-secondary/50' : ''} transition-colors`}
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sublabel && <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>}
      </div>
      {children || (onClick && <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />)}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-4 pt-5 pb-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{title}</p>
    </div>
  );
}

const LANGUAGES = ['English', 'Português', 'Español', 'Français', 'Deutsch', 'Italiano'];
const INTERESTS = ['Museums', 'Monuments', 'Castles', 'Architecture', 'Art', 'Archaeology', 'Music', 'History'];

function ProfileCard() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Anónimo Explorer');
  const [draft, setDraft] = useState(name);

  const handleSave = () => {
    setName(draft.trim() || 'Anónimo Explorer');
    setEditing(false);
    toast.success('Profile updated');
  };

  return (
    <div className="mx-4 mt-4 bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#7C3B1E]/10 border-2 border-[#7C3B1E]/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full text-sm font-semibold text-foreground bg-secondary rounded-lg px-2 py-1 outline-none border border-accent"
            />
          ) : (
            <p className="text-sm font-semibold text-foreground">{name}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">3 tours completed · 6 sites saved</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] px-2 py-0.5 bg-[#B8842A]/15 text-[#B8842A] rounded-full font-medium">
              Explorer Level 2
            </span>
          </div>
        </div>
        {editing ? (
          <div className="flex gap-1.5">
            <button onClick={handleSave} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ChevronRight size={14} className="text-primary-foreground" />
            </button>
            <button onClick={() => { setDraft(name); setEditing(false); }} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>
        ) : (
          <button onClick={() => { setDraft(name); setEditing(true); }} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
            <Edit2 size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

export function SettingsScreen({ onNavigate, activeTab, settings, onUpdateSettings }: SettingsScreenProps) {
  const [showLangPicker, setShowLangPicker] = useState(false);

  const toggleInterest = (interest: string) => {
    const current = settings.interests;
    onUpdateSettings({
      interests: current.includes(interest)
        ? current.filter(i => i !== interest)
        : [...current, interest],
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-card px-4 pt-10 pb-4 border-b border-border">
        <p className="text-xs text-muted-foreground">Personalise</p>
        <h2
          className="text-xl font-semibold text-foreground"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Settings
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile section */}
        <ProfileCard />

        {/* Content Mode — Adaptive Behaviour */}
        <SectionHeader title="Adaptive Content" />
        <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-xs font-semibold text-foreground mb-1">Content Mode</p>
            <p className="text-xs text-muted-foreground mb-3">
              Determines how descriptions, facts, and historical context are presented throughout the app.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateSettings({ contentMode: 'explorer' })}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${
                  settings.contentMode === 'explorer'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-secondary hover:border-border/60'
                }`}
              >
                <Compass size={20} className={settings.contentMode === 'explorer' ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`text-xs font-medium ${settings.contentMode === 'explorer' ? 'text-primary' : 'text-foreground'}`}>
                  Explorer
                </span>
                <span className="text-[9px] text-muted-foreground text-center">Concise, engaging stories</span>
              </button>
              <button
                onClick={() => onUpdateSettings({ contentMode: 'scholar' })}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${
                  settings.contentMode === 'scholar'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-secondary hover:border-border/60'
                }`}
              >
                <GraduationCap size={20} className={settings.contentMode === 'scholar' ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`text-xs font-medium ${settings.contentMode === 'scholar' ? 'text-primary' : 'text-foreground'}`}>
                  Scholar
                </span>
                <span className="text-[9px] text-muted-foreground text-center">Detailed academic context</span>
              </button>
            </div>
          </div>

          {/* Interests */}
          <div className="p-4">
            <p className="text-xs font-semibold text-foreground mb-1">Your Interests</p>
            <p className="text-xs text-muted-foreground mb-3">
              Recommendations and featured content adapt to your selected interests.
            </p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => {
                const selected = settings.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      selected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary text-foreground border-border hover:border-accent'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visit Duration */}
          <div className="p-4 border-t border-border">
            <p className="text-xs font-semibold text-foreground mb-1">Preferred Visit Duration</p>
            <p className="text-xs text-muted-foreground mb-2">Filters tour lengths to suit your schedule.</p>
            <div className="flex gap-2">
              {([
                { key: 'quick',   label: 'Quick', sub: '< 1h' },
                { key: 'halfday', label: 'Half Day', sub: '2–4h' },
                { key: 'fullday', label: 'Full Day', sub: '4–8h' },
              ] as const).map(opt => (
                <button key={opt.key} onClick={() => onUpdateSettings({ visitDuration: opt.key })}
                  className={`flex-1 py-2 rounded-xl border-2 text-center transition-all ${settings.visitDuration === opt.key ? 'border-primary bg-primary/5' : 'border-border bg-secondary'}`}>
                  <p className={`text-[11px] font-medium ${settings.visitDuration === opt.key ? 'text-primary' : 'text-foreground'}`}>{opt.label}</p>
                  <p className="text-[9px] text-muted-foreground">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="p-4 border-t border-border">
            <p className="text-xs font-semibold text-foreground mb-1">Budget Preference</p>
            <p className="text-xs text-muted-foreground mb-2">Influences recommended sites and tours.</p>
            <div className="flex gap-2">
              {([
                { key: 'free',   label: 'Free Only', sub: '€0' },
                { key: 'budget', label: 'Budget', sub: '≤ €7' },
                { key: 'any',    label: 'Any Price', sub: 'No limit' },
              ] as const).map(opt => (
                <button key={opt.key} onClick={() => onUpdateSettings({ budgetPreference: opt.key })}
                  className={`flex-1 py-2 rounded-xl border-2 text-center transition-all ${settings.budgetPreference === opt.key ? 'border-primary bg-primary/5' : 'border-border bg-secondary'}`}>
                  <p className={`text-[11px] font-medium ${settings.budgetPreference === opt.key ? 'text-primary' : 'text-foreground'}`}>{opt.label}</p>
                  <p className="text-[9px] text-muted-foreground">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <SectionHeader title="Location & GPS" />
        <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <SettingsRow
            icon={MapPin}
            label="GPS Location"
            sublabel={settings.gpsEnabled ? 'Active — tracking enabled' : 'Disabled'}
          >
            <Toggle value={settings.gpsEnabled} onChange={v => onUpdateSettings({ gpsEnabled: v })} />
          </SettingsRow>

          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Sliders size={15} className="text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Search Radius</p>
                <p className="text-xs text-muted-foreground">{settings.searchRadius} km around you</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="20"
                value={settings.searchRadius}
                onChange={e => onUpdateSettings({ searchRadius: Number(e.target.value) })}
                className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #7C3B1E ${(settings.searchRadius / 20) * 100}%, #DDD6C8 ${(settings.searchRadius / 20) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                <span>1 km</span>
                <span>10 km</span>
                <span>20 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <SettingsRow
            icon={Bell}
            label="Nearby Attractions"
            sublabel="Alert when approaching a heritage site"
          >
            <Toggle value={settings.notifyNearby} onChange={v => onUpdateSettings({ notifyNearby: v })} />
          </SettingsRow>
          <SettingsRow
            icon={BookOpen}
            label="Tour Updates"
            sublabel="Reminders and new route announcements"
          >
            <Toggle value={settings.notifyTours} onChange={v => onUpdateSettings({ notifyTours: v })} />
          </SettingsRow>
        </div>

        {/* Language */}
        <SectionHeader title="Language & Region" />
        <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden">
          <SettingsRow
            icon={Globe}
            label="Interface Language"
            sublabel={settings.language}
            onClick={() => setShowLangPicker(!showLangPicker)}
          />
          {showLangPicker && (
            <div className="border-t border-border">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => { onUpdateSettings({ language: lang }); setShowLangPicker(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-secondary/50 ${
                    settings.language === lang ? 'text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  <span>{lang}</span>
                  {settings.language === lang && (
                    <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-[9px] text-white">✓</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accessibility */}
        <SectionHeader title="Accessibility" />
        <div className="mx-4 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              {settings.darkMode ? <Moon size={15} className="text-foreground" /> : <Sun size={15} className="text-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">Reduces eye strain in low-light environments</p>
            </div>
            <Toggle value={settings.darkMode} onChange={v => onUpdateSettings({ darkMode: v })} />
          </div>
          <SettingsRow
            icon={Accessibility}
            label="Accessibility Mode"
            sublabel="Larger text, reduced motion, high contrast"
          >
            <Toggle value={settings.accessibilityMode} onChange={v => onUpdateSettings({ accessibilityMode: v })} />
          </SettingsRow>
        </div>

        {/* About */}
        <SectionHeader title="About" />
        <div className="mx-4 mb-6 bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <SettingsRow icon={Shield} label="Privacy Policy" onClick={() => toast('Opening Privacy Policy…')} />
          <SettingsRow icon={Info} label="Terms of Service" onClick={() => toast('Opening Terms of Service…')} />
          <SettingsRow icon={HelpCircle} label="Help & Support" onClick={() => toast('Opening Help Centre…')} />
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <Info size={15} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version 1.0.0 (Prototype)</p>
              <p className="text-xs text-muted-foreground opacity-60">Smart Cultural Heritage Guide</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  );
}
