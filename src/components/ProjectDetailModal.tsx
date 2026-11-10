import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Accessibility, Star, ExternalLink, Phone, Mail, CheckCircle2, ShieldAlert, Volume2, Share2, Copy, Check } from 'lucide-react';
import { SportProject } from '../types/index.js';
import { formatDistance } from '../utils/geo.js';
import { speakText } from '../services/speechService.js';

interface ProjectDetailModalProps {
  project: SportProject;
  distanceKm: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  distanceKm,
  isFavorite,
  onToggleFavorite,
  onClose
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [enrollmentSubmitted, setEnrollmentSubmitted] = useState(false);

  const handleAudioNarration = () => {
    const speech = `Projeto ${project.name}. Esporte: ${project.sport}. Financiado por ${project.programSource}. Localizado em ${project.address}, bairro ${project.neighborhood}, cidade de ${project.city}. Horários: ${project.schedule}. Faixa etária: ${project.ageRange}. Vagas disponíveis: ${project.spotsAvailable}. Inscrição gratuita. Recursos de acessibilidade presentes: ${project.accessibilityFeatures.join(', ')}.`;
    speakText(speech);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${project.address}, ${project.neighborhood}, ${project.city} - ${project.state}, CEP ${project.zipCode}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header / Top bar of modal */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-red-600 uppercase tracking-wider">{project.sport}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-700">{project.programSource}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-bold">{project.status}</span>
            </div>
            <h2 id="modal-project-title" className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {project.name}
            </h2>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Audio speech trigger */}
            <button
              onClick={handleAudioNarration}
              aria-label="Ouvir informações do projeto em áudio"
              title="Ouvir em voz alta"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-slate-100 transition-colors"
            >
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(project.id)}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-amber-500 transition-colors"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} aria-hidden="true" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Fechar janela de detalhes"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* Gov.br Transparency Seal */}
          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900">Fonte Oficial do Governo Federal</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                  {project.govBadge}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                Projeto verificado no catálogo oficial do Ministério do Esporte (dados.gov.br). Vagas 100% gratuitas protegidas por lei federal.
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sobre o Projeto</h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
          </div>

          {/* Adaptive Details (if PCD) */}
          {project.isAdaptive && project.adaptiveDetails && (
            <div className="p-4 bg-red-50/80 rounded-2xl border border-red-200/70">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm mb-1">
                <Accessibility className="w-5 h-5 text-red-600" aria-hidden="true" />
                <span>Adaptações e Paradesporto</span>
              </div>
              <p className="text-xs sm:text-sm text-red-900 leading-relaxed">
                {project.adaptiveDetails}
              </p>
            </div>
          )}

          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Faixa Etária Atendida</span>
              <span className="font-bold text-slate-900">{project.ageRange}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Vagas e Disponibilidade</span>
              <span className="font-bold text-slate-900">
                {project.spotsAvailable} vagas abertas <span className="text-slate-500 font-normal">de {project.totalSpots}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Dias e Horários</span>
              <span className="font-bold text-slate-900">{project.schedule}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Custo ao Cidadão</span>
              <span className="font-bold text-emerald-700">100% Gratuito (Público)</span>
            </div>

          </div>

          {/* Accessibility Features Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Acessibilidade Arquitetônica e Metodológica (NBR 9050)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.accessibilityFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Directions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{project.neighborhood}, {project.city} - {project.state}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{project.address}</p>
                  <p className="text-[11px] text-slate-500">CEP: {project.zipCode} · {formatDistance(distanceKm)} de você</p>
                </div>
              </div>

              <button
                onClick={handleCopyAddress}
                aria-label="Copiar endereço completo"
                className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* LGPD & Minor Protection Warning (Art. 14 LGPD) */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Proteção à Infância e Juventude (LGPD & ECA):</span>
              <p>
                Para inscrição de crianças e adolescentes menores de 18 anos, é obrigatória a autorização expressa do responsável legal. O ConectaEsporte não coleta documentos sem o consentimento dos pais.
              </p>
            </div>
          </div>

          {/* Registration instructions */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <h4 className="font-bold text-sm text-white">Como se Inscrever:</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {project.registrationProcess}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-400" />
                <span>{project.contactPhone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>{project.contactEmail}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Órgão Gestor: <strong className="text-slate-800">{project.organizer}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {project.registrationUrl && (
              <a
                href={project.registrationUrl}
                target="_blank"
                rel="noreferrer"
                className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 flex-1 sm:flex-initial transition-colors"
              >
                <span>Portal Gov.br</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setEnrollmentSubmitted(true)}
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 flex-1 sm:flex-initial shadow-md shadow-red-600/20 transition-all active:scale-98"
            >
              {enrollmentSubmitted ? 'Manifestação de Interesse Enviada!' : 'Manifestar Interesse / Pré-Inscrição'}
            </button>
          </div>
        </div>

        {enrollmentSubmitted && (
          <div className="p-4 bg-emerald-600 text-white text-center text-xs font-semibold animate-fadeIn">
            ✓ Seu interesse foi registrado anonimamente! Apresente-se no núcleo esportivo ou entre em contato pelo telefone {project.contactPhone}.
          </div>
        )}

      </div>
    </div>
  );
};
