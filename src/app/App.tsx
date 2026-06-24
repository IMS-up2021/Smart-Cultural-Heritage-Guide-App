import { useState } from 'react';
import { Toaster } from 'sonner';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HomeMapScreen } from './components/HomeMapScreen';
import { LocationDetails } from './components/LocationDetails';
import { WalkingTour } from './components/WalkingTour';
import { FavoritesScreen } from './components/FavoritesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import type { AppSettings } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [previousScreen, setPreviousScreen] = useState<string>('home');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('museu-nacional');
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([
    'mosteiro-jeronimos',
    'castelo-sao-jorge',
    'museu-fado',
  ]);
  const [settings, setSettings] = useState<AppSettings>({
    contentMode: 'explorer',
    language: 'English',
    gpsEnabled: true,
    searchRadius: 5,
    notifyNearby: true,
    notifyTours: false,
    interests: ['Museums', 'Monuments', 'Architecture'],
    accessibilityMode: false,
    darkMode: false,
    visitDuration: 'halfday',
    budgetPreference: 'any',
  });

  const handleNavigate = (screen: string, locationId?: string, tourId?: string) => {
    if (screen === 'details') {
      setPreviousScreen(currentScreen);
      if (locationId) setSelectedLocationId(locationId);
    }
    if (screen === 'tour' && tourId) {
      setSelectedTourId(tourId);
    }
    setCurrentScreen(screen);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleUpdateSettings = (patch: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  };

  return (
    <div className={`w-full h-full flex items-center justify-center ${settings.darkMode ? 'dark bg-zinc-900' : 'bg-secondary'}`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Toaster position="top-center" richColors toastOptions={{ style: { fontSize: '13px' } }} />
      <div className="w-full max-w-md h-full bg-background shadow-2xl relative overflow-hidden flex flex-col">
        {currentScreen === 'welcome' && (
          <WelcomeScreen onGetStarted={() => handleNavigate('home')} />
        )}
        {currentScreen === 'home' && (
          <HomeMapScreen
            onNavigate={handleNavigate}
            activeTab="home"
            favorites={favorites}
            settings={settings}
          />
        )}
        {currentScreen === 'details' && (
          <LocationDetails
            locationId={selectedLocationId}
            onBack={() => handleNavigate(previousScreen)}
            onNavigate={handleNavigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            contentMode={settings.contentMode}
          />
        )}
        {currentScreen === 'tour' && (
          <WalkingTour
            onNavigate={handleNavigate}
            activeTab="tour"
            selectedTourId={selectedTourId}
            favorites={favorites}
          />
        )}
        {currentScreen === 'favorites' && (
          <FavoritesScreen
            onNavigate={handleNavigate}
            activeTab="favorites"
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen
            onNavigate={handleNavigate}
            activeTab="settings"
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </div>
    </div>
  );
}
