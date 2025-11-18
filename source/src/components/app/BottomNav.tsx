import { memo } from 'react';
import { Home, Calendar, BookOpen, Users, Shield, Settings, Heart } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'prevention', icon: Shield, label: 'Prevention' },
  { id: 'wellness', icon: Heart, label: 'Wellness' },
  { id: 'contacts', icon: Users, label: 'Contacts' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

export const BottomNav = memo(function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 pb-safe" role="navigation" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16" role="tablist">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${tab.label} tab${isActive ? ' - currently selected' : ''}`}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} aria-hidden="true" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

