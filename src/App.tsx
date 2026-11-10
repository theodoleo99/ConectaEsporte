/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.js';
import { SearchAndFilters } from './components/SearchAndFilters.js';
import { ProjectCard } from './components/ProjectCard.js';
import { ProjectDetailModal } from './components/ProjectDetailModal.js';
import { InteractiveMapView } from './components/InteractiveMapView.js';
import { FavoritesView } from './components/FavoritesView.js';
import { SportsGroupsView } from './components/SportsGroupsView.js';
import { PrivacyLGPDView } from './components/PrivacyLGPDView.js';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal.js';
import { HelpGuideModal } from './components/HelpGuideModal.js';
import { BottomNavigation, AppTab } from './components/BottomNavigation.js';

import {
  SportProject,
  SportsGroup,
  UserProfileLGPD,
  AccessibilitySettings,
  ModalityCategory
} from './types/index.js';

import {
  PUBLIC_GOV_PROJECTS,
  INITIAL_SPORTS_GROUPS
} from './services/govDataService.js';

import {
  Coordinates,
  BRAZIL_CITY_COORDINATES,
  calculateHaversineDistance,
  resolveLocationQuery
} from './utils/geo.js';

const STORAGE_FAVORITES_KEY = 'conecta_esporte_favorites_v2';
const STORAGE_PROFILE_KEY = 'conecta_esporte_user_profile_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('projects');
  
  // Accessibility state
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    fontScale: 'md',
    isAudioReadingActive: false
  });

  // Location origin based on manual CEP / Cidade (Google Maps reference)
  const [selectedCity, setSelectedCity] = useState<string>('São Paulo');
  const [userCoords, setUserCoords] = useState<Coordinates>(BRAZIL_CITY_COORDINATES['São Paulo']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('Todos');
  const [modalityFilter, setModalityFilter] = useState<ModalityCategory>('todos');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');

  // Interactive Modals
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<SportProject | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isOriginModalOpen, setIsOriginModalOpen] = useState(false);
  const [tempCityInput, setTempCityInput] = useState(selectedCity);

  // Favorites (Guest-First local storage)
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : ['gov-lie-01', 'gov-pst-02', 'gov-lie-08'];
    } catch {
      return ['gov-lie-01', 'gov-pst-02', 'gov-lie-08'];
    }
  });

  // User Minimal Profile (LGPD Compliant)
  const [userProfile, setUserProfile] = useState<UserProfileLGPD>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      nickname: 'Atleta Conecta',
      isMinor: false,
      favoriteProjectIds: ['gov-lie-01', 'gov-pst-02', 'gov-lie-08'],
      notificationPrefs: {
        enabled: true,
        deviceToken: 'fcm_token_anon_sp_987123',
        registeredSports: ['Basquetebol em Cadeira de Rodas', 'Futsal', 'Natação'],
        radiusKm: 25,
        adaptiveOnly: false
      }
    };
  });

  // Groups state
  const [sportsGroups, setSportsGroups] = useState<SportsGroup[]>(INITIAL_SPORTS_GROUPS);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favoriteProjectIds));
    } catch (e) {
      console.warn('Erro ao salvar favoritos no storage local:', e);
    }
  }, [favoriteProjectIds]);

  // Sync user profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Erro ao salvar perfil LGPD:', e);
    }
  }, [userProfile]);

  const toggleFavorite = (projectId: string) => {
    setFavoriteProjectIds(prev => {
      const exists = prev.includes(projectId);
      return exists ? prev.filter(id => id !== projectId) : [...prev, projectId];
    });
  };

  const handleUpdateProfile = (updated: Partial<UserProfileLGPD>) => {
    setUserProfile(prev => ({
      ...prev,
      ...updated
    }));
  };

  const handleResetAllData = () => {
    try {
      localStorage.removeItem(STORAGE_FAVORITES_KEY);
      localStorage.removeItem(STORAGE_PROFILE_KEY);
    } catch {}
    setFavoriteProjectIds([]);
    setUserProfile({
      nickname: 'Atleta Conecta',
      isMinor: false,
      favoriteProjectIds: [],
      notificationPrefs: {
        enabled: false,
        deviceToken: '',
        registeredSports: [],
        radiusKm: 25,
        adaptiveOnly: false
      }
    });
  };

  // Add message to group
  const handleSendMessage = (groupId: string, messageText: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderNickname: userProfile.nickname,
      isMinor: userProfile.isMinor,
      text: messageText,
      timestamp: 'Agora mesmo'
    };

    setSportsGroups(prev =>
      prev.map(g => (g.id === groupId ? { ...g, messages: [...g.messages, newMessage] } : g))
    );
  };

  // Create new group/community
  const handleCreateGroup = (newGroupData: Omit<SportsGroup, 'id' | 'memberCount' | 'messages'>) => {
    const newGroup: SportsGroup = {
      ...newGroupData,
      id: `grp-user-${Date.now()}`,
      memberCount: 1,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          senderNickname: userProfile.nickname,
          isMinor: userProfile.isMinor,
          text: `Comunidade criada por ${userProfile.nickname}! Bem-vindos a todos os praticantes da região.`,
          timestamp: 'Agora mesmo'
        }
      ]
    };

    setSportsGroups(prev => [newGroup, ...prev]);
  };

  const handleApplyOrigin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempCityInput.trim()) return;

    const resolved = resolveLocationQuery(tempCityInput);
    if (resolved) {
      setUserCoords(resolved);
      setSelectedCity(tempCityInput.trim());
      setIsOriginModalOpen(false);
    } else {
      setSelectedCity(tempCityInput.trim());
      setIsOriginModalOpen(false);
    }
  };

  // Filtered projects calculation (Ordered by distance from user's manual CEP/City)
  const filteredProjects = useMemo(() => {
    return PUBLIC_GOV_PROJECTS.filter(project => {
      // 1. Modality Filter (Dedicated PCD filter)
      if (modalityFilter === 'adaptado' && !project.isAdaptive) {
        return false;
      }
      if (modalityFilter === 'convencional' && project.isAdaptive && project.modalityType !== 'misto') {
        return false;
      }

      // 2. Sport Select Filter
      if (selectedSport !== 'Todos' && project.sport !== selectedSport) {
        return false;
      }

      // 3. Keyword Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(q);
        const matchesSport = project.sport.toLowerCase().includes(q);
        const matchesCity = project.city.toLowerCase().includes(q);
        const matchesNeighborhood = project.neighborhood.toLowerCase().includes(q);
        const matchesOrganizer = project.organizer.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);

        if (!matchesName && !matchesSport && !matchesCity && !matchesNeighborhood && !matchesOrganizer && !matchesDesc) {
          return false;
        }
      }

      // 4. Age Group Filter
      if (selectedAgeGroup !== 'all') {
        if (selectedAgeGroup === 'child' && (project.maxAge < 6 || project.minAge > 12)) return false;
        if (selectedAgeGroup === 'teen' && (project.maxAge < 13 || project.minAge > 17)) return false;
        if (selectedAgeGroup === 'adult' && (project.maxAge < 18 || project.minAge > 59)) return false;
        if (selectedAgeGroup === 'elderly' && project.maxAge < 60) return false;
      }

      return true;
    }).sort((a, b) => {
      const distA = calculateHaversineDistance(userCoords.lat, userCoords.lng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateHaversineDistance(userCoords.lat, userCoords.lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    });
  }, [modalityFilter, selectedSport, searchQuery, selectedAgeGroup, userCoords]);

  // Favorite projects list
  const favoriteProjects = useMemo(() => {
    return PUBLIC_GOV_PROJECTS.filter(p => favoriteProjectIds.includes(p.id));
  }, [favoriteProjectIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-32 sm:pb-28 selection:bg-red-500 selection:text-white">
      
      {/* Top Accessible Header */}
      <Header
        accessibility={accessibility}
        setAccessibility={setAccessibility}
        onOpenArchitectureDocs={() => setIsArchitectureModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-1" id="main-content">
        
        {activeTab === 'projects' && (
          <div>
            {/* Search and Universal Filter Controls (Google Maps manual reference) */}
            <SearchAndFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
              modalityFilter={modalityFilter}
              setModalityFilter={setModalityFilter}
              selectedAgeGroup={selectedAgeGroup}
              setSelectedAgeGroup={setSelectedAgeGroup}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              userCoords={userCoords}
              setUserCoords={setUserCoords}
              totalFilteredCount={filteredProjects.length}
            />

            {/* Projects Feed */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
              
              {/* Informative Kicker */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 text-xs text-slate-500">
                <span>
                  Distâncias calculadas a partir de seu ponto de partida (Google Maps): <strong>{selectedCity}</strong>
                </span>
                <button
                  onClick={() => setIsOriginModalOpen(true)}
                  className="text-red-600 hover:text-red-700 font-bold underline self-start sm:self-auto"
                >
                  Alterar CEP / Cidade
                </button>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                  <p className="text-base font-bold text-slate-800">
                    Nenhum projeto encontrado para os filtros selecionados.
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Tente selecionar "Todos os Esportes" ou buscar por outro termo.
                  </p>
                  <button
                    onClick={() => {
                      setModalityFilter('todos');
                      setSelectedSport('Todos');
                      setSearchQuery('');
                    }}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
                  >
                    Ver Todas as Modalidades
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProjects.map((project) => {
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
                        isFavorite={favoriteProjectIds.includes(project.id)}
                        onToggleFavorite={toggleFavorite}
                        onSelectProject={setSelectedProjectForModal}
                      />
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <InteractiveMapView
            projects={filteredProjects}
            userCoords={userCoords}
            userCity={selectedCity}
            onSelectProject={setSelectedProjectForModal}
            onChangeOrigin={() => setIsOriginModalOpen(true)}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favoriteProjects}
            onToggleFavorite={toggleFavorite}
            onSelectProject={setSelectedProjectForModal}
            userCoords={userCoords}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToExplore={() => setActiveTab('projects')}
          />
        )}

        {activeTab === 'groups' && (
          <SportsGroupsView
            groups={sportsGroups}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onSendMessage={handleSendMessage}
            onCreateGroup={handleCreateGroup}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyLGPDView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onResetAllData={handleResetAllData}
          />
        )}

      </main>

      {/* Project Detail Modal */}
      {selectedProjectForModal && (
        <ProjectDetailModal
          project={selectedProjectForModal}
          distanceKm={calculateHaversineDistance(
            userCoords.lat,
            userCoords.lng,
            selectedProjectForModal.coordinates.lat,
            selectedProjectForModal.coordinates.lng
          )}
          isFavorite={favoriteProjectIds.includes(selectedProjectForModal.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedProjectForModal(null)}
        />
      )}

      {/* Technical Architecture Docs Modal */}
      {isArchitectureModalOpen && (
        <ArchitectureDocsModal onClose={() => setIsArchitectureModalOpen(false)} />
      )}

      {/* Help Guide Modal */}
      {isHelpModalOpen && (
        <HelpGuideModal onClose={() => setIsHelpModalOpen(false)} />
      )}

      {/* Origin Selection Modal */}
      {isOriginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Alterar CEP ou Cidade de Partida (Google Maps)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Todas as distâncias e rotas para as oficinas esportivas serão recalculadas a partir deste endereço.
            </p>
            <form onSubmit={handleApplyOrigin} className="space-y-4">
              <input
                type="text"
                placeholder="Ex: 04329-000, São Paulo, Santos, Curitiba, Rio de Janeiro"
                value={tempCityInput}
                onChange={(e) => setTempCityInput(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOriginModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  Confirmar Ponto de Partida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Ergonomic Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        favoritesCount={favoriteProjectIds.length}
      />

    </div>
  );
}
