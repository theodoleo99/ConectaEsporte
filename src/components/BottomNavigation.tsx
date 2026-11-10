import React from 'react';
import { Compass, Star, Users, ShieldCheck, Dumbbell } from 'lucide-react';

export type AppTab = 'projects' | 'map' | 'favorites' | 'groups' | 'privacy';

interface BottomNavigationProps {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  favoritesCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  favoritesCount
}) => {
  const tabs = [
    {
      id: 'projects' as AppTab,
      label: 'Projetos',
      icon: Dumbbell,
      badge: null
    },
    {
      id: 'map' as AppTab,
      label: 'Mapa',
      icon: Compass,
      badge: null
    },
    {
      id: 'favorites' as AppTab,
      label: 'Favoritos',
      icon: Star,
      badge: favoritesCount > 0 ? favoritesCount : null
    },
    {
      id: 'groups' as AppTab,
      label: 'Grupos',
      icon: Users,
      badge: null
    },
    {
      id: 'privacy' as AppTab,
      label: 'LGPD',
      icon: ShieldCheck,
      badge: null
    }
  ];

  return (
    <nav
      aria-label="Navegação Principal do Aplicativo"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 transition-colors shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              aria-label={tab.label}
              className={`min-h-[48px] flex flex-col items-center justify-center relative py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-red-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} aria-hidden="true" />
                {tab.badge !== null && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 leading-none">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-red-600 absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
