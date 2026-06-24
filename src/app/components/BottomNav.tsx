import { Map, Route, Heart, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (screen: string) => void;
}

const TABS = [
  { id: 'home', label: 'Explore', Icon: Map },
  { id: 'tour', label: 'Tours', Icon: Route },
  { id: 'favorites', label: 'Saved', Icon: Heart },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <div className="flex-shrink-0 bg-card border-t border-border safe-bottom">
      <div className="flex">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} fill={isActive && id === 'favorites' ? 'currentColor' : 'none'} />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
