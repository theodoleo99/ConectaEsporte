import React, { useState } from 'react';
import { Star, Bell, BellRing, Sparkles, Check, Trash2, ArrowRight, ShieldCheck, Accessibility } from 'lucide-react';
import { SportProject, UserProfileLGPD } from '../types/index.js';
import { ProjectCard } from './ProjectCard.js';
import { Coordinates, calculateHaversineDistance } from '../utils/geo.js';

interface FavoritesViewProps {
  favorites: SportProject[];
  onToggleFavorite: (id: string) => void;
  onSelectProject: (project: SportProject) => void;
  userCoords: Coordinates;
  userProfile: UserProfileLGPD;
  onUpdateProfile: (updated: Partial<UserProfileLGPD>) => void;
  onNavigateToExplore: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onToggleFavorite,
  onSelectProject,
  userCoords,
  userProfile,
  onUpdateProfile,
  onNavigateToExplore
}) => {
  const [fcmRegisteredSuccess, setFcmRegisteredSuccess] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const isFcmActive = userProfile.notificationPrefs.enabled;

  const handleToggleFcmNotifications = () => {
    const nextState = !isFcmActive;
    const simulatedDeviceToken = nextState
      ? `fcm_token_anon_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`
      : '';

    onUpdateProfile({
      notificationPrefs: {
        ...userProfile.notificationPrefs,
        enabled: nextState,
        deviceToken: simulatedDeviceToken,
        registeredSports: Array.from(new Set(favorites.map(f => f.sport)))
      }
    });

    if (nextState) {
      setFcmRegisteredSuccess(true);
      setTimeout(() => setFcmRegisteredSuccess(false), 3500);
    }
  };

  const handleSendTestPush = () => {
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Title & Storage Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" aria-hidden="true" />
            Meus Projetos Favoritos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Salvos diretamente no armazenamento local do seu dispositivo (Guest-First) · Sem necessidade de criar conta ou login.
          </p>
        </div>

        <div className="text-xs text-slate-500 self-start sm:self-auto bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
          <strong className="text-slate-900 tabular-nums">{favorites.length}</strong> projetos favoritados
        </div>
      </div>

      {/* Push Notification (FCM) Integration Banner (Requirement 3) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-red-400" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Notificações de Novas Vagas (FCM Anônimo)
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  Firebase Cloud Messaging
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Receba alertas instantâneos no seu celular quando novas turmas ou vagas de desistência abrirem nas modalidades que você favoritou.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleFcmNotifications}
              className={`min-h-[48px] px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isFcmActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{isFcmActive ? 'Alertas Ativados ✓' : 'Ativar Alertas Push'}</span>
            </button>
          </div>
        </div>

        {/* Device Token & LGPD Minimization Information */}
        {isFcmActive && (
          <div className="pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Token Anônimo FCM: <code className="text-slate-200 font-mono text-[11px]">{userProfile.notificationPrefs.deviceToken.substring(0, 24)}...</code>
              </span>
            </div>

            <button
              onClick={handleSendTestPush}
              className="text-red-400 hover:text-red-300 underline font-semibold self-start sm:self-auto text-xs"
            >
              Simular recebimento de alerta FCM
            </button>
          </div>
        )}

        {testNotificationSent && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2 animate-fadeIn">
            <BellRing className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              🔔 <strong>Notificação Push Recebida:</strong> "3 novas vagas abertas para Basquete em Cadeira de Rodas no Centro Paralímpico Brasileiro!"
            </span>
          </div>
        )}

        {fcmRegisteredSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Token FCM registrado anonimamente com conformidade LGPD. Você receberá avisos sobre seus esportes favoritos!
            </span>
          </div>
        )}
      </div>

      {/* Favorites List or Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Nenhum projeto favoritado ainda</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Explore o catálogo aberto de oficinas esportivas e clique no ícone de estrela para salvar projetos aqui e receber alertas de novas vagas.
            </p>
          </div>
          <button
            onClick={onNavigateToExplore}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-2 transition-colors"
          >
            <span>Explorar Vagas e Modalidades</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {favorites.map((project) => {
            const distance = calculateHaversineDistance(
              userCoords.lat,
              userCoords.lng,
              project.coordinates.lat,
              project.coordinates.lng
            );
            return (
              <ProjectCard
                key={project.id}
                project={project}
                distanceKm={distance}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onSelectProject={onSelectProject}
              />
            );
          })}
        </div>
      )}

    </div>
  );
};
