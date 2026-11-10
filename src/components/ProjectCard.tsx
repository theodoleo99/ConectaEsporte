import React from 'react';
import { Star, MapPin, Accessibility, Calendar, Volume2, ArrowUpRight, ShieldCheck, Users } from 'lucide-react';
import { SportProject } from '../types/index.js';
import { formatDistance } from '../utils/geo.js';
import { speakText } from '../services/speechService.js';

interface ProjectCardProps {
  project: SportProject;
  distanceKm: number;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string) => void;
  onSelectProject: (project: SportProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  distanceKm,
  isFavorite,
  onToggleFavorite,
  onSelectProject
}) => {
  const handleAudioRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const narration = `Projeto: ${project.name}. Modalidade: ${project.sport}. ${
      project.isAdaptive ? 'Modalidade de esporte adaptado para pessoas com deficiência.' : ''
    } Localizado em ${project.neighborhood}, ${project.city}. Horários: ${project.schedule}. Status: ${project.status}. Vagas disponíveis: ${project.spotsAvailable}. Inscrição gratuita através de programa público.`;
    speakText(narration);
  };

  return (
    <article
      onClick={() => onSelectProject(project)}
      className="group bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between focus-within:ring-2 focus-within:ring-red-500"
      aria-labelledby={`project-title-${project.id}`}
    >
      <div>
        
        {/* Top Metadata Strip: Program Source, Distance, and Favorite Star */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 truncate">
            <span className="font-semibold text-slate-700">{project.programSource}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{project.cost}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Audio narration button */}
            <button
              onClick={handleAudioRead}
              type="button"
              aria-label={`Ouvir descrição em áudio do projeto ${project.name}`}
              title="Ouvir em voz alta"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Favorite Star Button (>= 48px hit area) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(project.id);
              }}
              type="button"
              aria-label={isFavorite ? `Remover ${project.name} dos favoritos` : `Adicionar ${project.name} aos favoritos`}
              title={isFavorite ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
              className="min-h-[48px] min-w-[48px] flex items-center justify-center text-slate-400 hover:text-amber-500 rounded-xl transition-transform active:scale-95"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? 'fill-amber-400 text-amber-500' : 'text-slate-300 hover:text-amber-400'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Project Title & Sport */}
        <div className="pt-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">
                {project.sport}
              </span>
              <h3
                id={`project-title-${project.id}`}
                className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug"
              >
                {project.name}
              </h3>
            </div>

            {project.isAdaptive && (
              <span
                title="Esporte Adaptado para Pessoas com Deficiência"
                className="shrink-0 min-h-[36px] px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1 border border-red-200/60"
              >
                <Accessibility className="w-3.5 h-3.5" aria-hidden="true" />
                <span>PCD</span>
              </span>
            )}
          </div>

          {/* Description snippet */}
          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Accessibility Features / Adaptations */}
        {project.accessibilityFeatures && project.accessibilityFeatures.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Recursos de Acessibilidade Disponíveis:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-700">
              {project.accessibilityFeatures.slice(0, 3).map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                >
                  {feat}
                </span>
              ))}
              {project.accessibilityFeatures.length > 3 && (
                <span className="text-slate-400 font-medium self-center">
                  +{project.accessibilityFeatures.length - 3} mais
                </span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Card Footer: Location, Distance, Spots, and CTA */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-3 text-xs">
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{project.neighborhood}, {project.city} - {project.state}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-500 text-[11px]">
            <span className="font-semibold text-slate-900 tabular-nums">
              {formatDistance(distanceKm)} de distância
            </span>
            <span aria-hidden="true">·</span>
            <span className={project.status === 'Inscrições Abertas' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
              {project.status} ({project.spotsAvailable} vagas)
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectProject(project);
          }}
          type="button"
          aria-label={`Ver detalhes e inscrição para ${project.name}`}
          className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Ver Inscrição e Detalhes</span>
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </button>

      </div>
    </article>
  );
};
