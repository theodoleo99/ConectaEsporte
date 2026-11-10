import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Accessibility, Star, ArrowUpRight, Compass, Route, ExternalLink, Check, Car, Footprints } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { SportProject } from '../types/index.js';
import { Coordinates, calculateHaversineDistance, formatDistance } from '../utils/geo.js';

interface InteractiveMapViewProps {
  projects: SportProject[];
  userCoords: Coordinates;
  userCity: string;
  onSelectProject: (project: SportProject) => void;
  selectedProjectId?: string | null;
  onChangeOrigin: () => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  projects,
  userCoords,
  userCity,
  onSelectProject,
  selectedProjectId,
  onChangeOrigin
}) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );

  const selectedProject = projects.find(p => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    if (selectedProjectId) {
      setActiveProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Calculate distance between user manual origin and selected project
  const calculatedDistance = selectedProject
    ? calculateHaversineDistance(
        userCoords.lat,
        userCoords.lng,
        selectedProject.coordinates.lat,
        selectedProject.coordinates.lng
      )
    : 0;

  // Google Maps Directions Link (Turn-by-turn navigation)
  const googleMapsDirectionsUrl = selectedProject
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userCity)}&destination=${selectedProject.coordinates.lat},${selectedProject.coordinates.lng}&travelmode=transit`
    : `https://www.google.com/maps`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-red-600" aria-hidden="true" />
            Google Maps · Rotas e Polos Esportivos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Localização em foco do programa escolhido com rota a partir do seu ponto de partida (CEP/Cidade).
          </p>
        </div>

        {/* Origin Selector Card */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 sm:p-2 rounded-2xl border border-slate-200 text-xs self-start sm:self-auto">
          <MapPin className="w-4 h-4 text-red-600 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-500 block">Ponto de Partida:</span>
            <strong className="text-slate-900 truncate">{userCity}</strong>
          </div>
          <button
            onClick={onChangeOrigin}
            className="ml-2 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-red-600 font-bold border border-slate-200 shadow-xs"
          >
            Mudar
          </button>
        </div>
      </div>

      {/* Main Map & Program Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Google Maps Container */}
        <div className="lg:col-span-8 bg-slate-100 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative min-h-[500px]">
          
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <div className="w-full h-full min-h-[500px] relative">
                <Map
                  defaultCenter={selectedProject ? selectedProject.coordinates : userCoords}
                  defaultZoom={13}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  gestureHandling="greedy"
                  className="w-full h-full min-h-[500px]"
                >
                  {/* Origin Marker (User location) */}
                  <AdvancedMarker position={userCoords} title={`Ponto de Partida: ${userCity}`}>
                    <Pin background="#0f172a" glyphColor="#ffffff" borderColor="#ffffff" />
                  </AdvancedMarker>

                  {/* Program Pins */}
                  {projects.map((proj) => {
                    const isSelected = proj.id === activeProjectId;
                    return (
                      <AdvancedMarker
                        key={proj.id}
                        position={proj.coordinates}
                        title={proj.name}
                        onClick={() => setActiveProjectId(proj.id)}
                      >
                        <Pin
                          background={isSelected ? '#dc2626' : proj.isAdaptive ? '#ea580c' : '#2563eb'}
                          glyphColor="#ffffff"
                          borderColor="#ffffff"
                          scale={isSelected ? 1.3 : 1.0}
                        />
                      </AdvancedMarker>
                    );
                  })}
                </Map>
              </div>
            </APIProvider>
          ) : (
            /* Fallback Google Maps Embed & Interactive View */
            <div className="w-full h-full min-h-[500px] flex flex-col">
              <iframe
                title="Google Maps - Localização do Polo Esportivo"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${selectedProject ? selectedProject.coordinates.lat : userCoords.lat},${selectedProject ? selectedProject.coordinates.lng : userCoords.lng}&hl=pt-BR&z=14&output=embed`}
              />
            </div>
          )}

          {/* Map Footer Bar with Route summary */}
          <div className="bg-white/95 backdrop-blur-md p-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Route className="w-4 h-4 text-red-600" />
                <span>Distância do seu ponto ({userCity}):</span>
                <span className="text-red-600 font-extrabold tabular-nums">
                  {formatDistance(calculatedDistance)}
                </span>
              </div>
            </div>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Abrir Rota no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Selected Project Card & Focus Details */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          
          {selectedProject ? (
            <div className="space-y-4">
              
              {/* Focus Badge */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <span className="font-bold text-red-600 uppercase tracking-wider">{selectedProject.sport}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {selectedProject.status}
                </span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {selectedProject.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedProject.programSource} · {selectedProject.cost}
                </p>
              </div>

              {/* Focus Address & Coordinates */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-start gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">{selectedProject.neighborhood}, {selectedProject.city} - {selectedProject.state}</span>
                    <span className="text-[11px] text-slate-600 block">{selectedProject.address}</span>
                    <span className="text-[10px] text-slate-400 font-mono">CEP: {selectedProject.zipCode}</span>
                  </div>
                </div>
              </div>

              {/* Schedule and Spots */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-semibold text-slate-500 block">Vagas Abertas</span>
                  <span className="font-bold text-slate-900">{selectedProject.spotsAvailable}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] font-semibold text-slate-500 block">Faixa Etária</span>
                  <span className="font-bold text-slate-900">{selectedProject.ageRange}</span>
                </div>
              </div>

              {/* Adaptive description if PCD */}
              {selectedProject.isAdaptive && (
                <div className="p-3 bg-red-50 text-red-900 rounded-xl text-xs space-y-1 border border-red-200/60">
                  <span className="font-bold flex items-center gap-1.5">
                    <Accessibility className="w-4 h-4 text-red-600" />
                    Paradesporto e Inclusão PCD
                  </span>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    {selectedProject.adaptiveDetails}
                  </p>
                </div>
              )}

              {/* CTA Action */}
              <button
                onClick={() => onSelectProject(selectedProject)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/20 active:scale-98"
              >
                <span>Ver Inscrição e Detalhes Completos</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Selecione um projeto esportivo na lista para focar no mapa.
            </div>
          )}

          {/* Quick list of other programs */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Outros Polos na Região:
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {projects.filter(p => p.id !== activeProjectId).slice(0, 4).map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectId(p.id)}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-medium text-slate-800 truncate mr-2">{p.name}</span>
                  <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
                    {formatDistance(calculateHaversineDistance(userCoords.lat, userCoords.lng, p.coordinates.lat, p.coordinates.lng))}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
