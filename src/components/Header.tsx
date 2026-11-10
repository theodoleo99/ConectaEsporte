import React from 'react';
import { Eye, Volume2, VolumeX, Sparkles, Database, HelpCircle } from 'lucide-react';
import { AccessibilitySettings } from '../types/index.js';
import { isSpeaking, stopSpeaking } from '../services/speechService.js';

interface HeaderProps {
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onOpenArchitectureDocs: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  accessibility,
  setAccessibility,
  onOpenArchitectureDocs,
  onOpenHelp
}) => {
  const toggleHighContrast = () => {
    setAccessibility(prev => {
      const nextContrast = !prev.highContrast;
      if (nextContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return { ...prev, highContrast: nextContrast };
    });
  };

  const cycleFontScale = () => {
    const scales: Array<'sm' | 'md' | 'lg' | 'xl'> = ['md', 'lg', 'xl', 'sm'];
    setAccessibility(prev => {
      const nextIdx = (scales.indexOf(prev.fontScale) + 1) % scales.length;
      const nextScale = scales[nextIdx];
      
      document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
      document.documentElement.classList.add(`font-scale-${nextScale}`);
      
      return { ...prev, fontScale: nextScale };
    });
  };

  const toggleGlobalAudio = () => {
    if (accessibility.isAudioReadingActive || isSpeaking()) {
      stopSpeaking();
      setAccessibility(prev => ({ ...prev, isAudioReadingActive: false }));
    } else {
      setAccessibility(prev => ({ ...prev, isAudioReadingActive: true }));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Zone: ConectaEsporte Logo & Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/aistudio/image_9958c464.png"
              alt="Logo ConectaEsporte: Atleta em movimento cercado por bolas esportivas e flechas dinâmicas"
              className="h-10 w-auto sm:h-12 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                Conecta<span className="text-red-600">Esporte</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide">
                Esporte Público & Inclusivo · Brasil
              </span>
            </div>
          </div>

          {/* Accessibility & Gov Tools Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* High Contrast Mode Toggle Button (>= 48px hit area) */}
            <button
              onClick={toggleHighContrast}
              aria-label={accessibility.highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste para Acessibilidade Visual'}
              title="Alto Contraste (Acessibilidade Visual)"
              className={`min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                accessibility.highContrast
                  ? 'bg-yellow-400 text-black border-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Contraste</span>
            </button>

            {/* Dynamic Font Scaler (A- / A+) */}
            <button
              onClick={cycleFontScale}
              aria-label={`Ajustar tamanho da fonte. Atual: ${accessibility.fontScale.toUpperCase()}`}
              title="Ajustar tamanho de fonte (A-, A, A+)"
              className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <span className="font-bold text-sm">A</span>
              <span className="text-[10px] uppercase font-bold text-slate-500">
                {accessibility.fontScale === 'sm' ? '-' : accessibility.fontScale === 'lg' ? '+' : accessibility.fontScale === 'xl' ? '++' : 'pad'}
              </span>
            </button>

            {/* Audio Reader Toggle */}
            <button
              onClick={toggleGlobalAudio}
              aria-label={accessibility.isAudioReadingActive ? 'Parar leitura de voz' : 'Ativar leitor de áudio em voz alta'}
              title="Leitor de Áudio Acessível"
              className={`min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                accessibility.isAudioReadingActive
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {accessibility.isAudioReadingActive ? (
                <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden md:inline">
                {accessibility.isAudioReadingActive ? 'Parar Áudio' : 'Voz'}
              </span>
            </button>

            {/* Architecture & Gov Data Inspect */}
            <button
              onClick={onOpenArchitectureDocs}
              aria-label="Abrir especificações técnicas da arquitetura de dados abertos Gov.br e PostGIS"
              title="Arquitetura de Dados Gov.br & PostGIS"
              className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Database className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">Gov.br & PostGIS</span>
            </button>

            {/* Quick Help Guide */}
            <button
              onClick={onOpenHelp}
              aria-label="Como usar o ConectaEsporte: Guia simplificado"
              title="Ajuda e Orientações"
              className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors flex items-center justify-center"
            >
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
