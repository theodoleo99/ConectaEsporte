import React from 'react';
import { X, Sparkles, Accessibility, Eye, ShieldCheck, Heart } from 'lucide-react';

interface HelpGuideModalProps {
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/image_9958c464.png"
              alt="Logo ConectaEsporte"
              className="h-8 w-auto"
            />
            <h3 className="font-extrabold text-base text-slate-900">
              Como Funciona o ConectaEsporte
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar ajuda"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
            <Sparkles className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block text-xs">1. Navegação Anônima ("Guest First")</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Você não precisa preencher formulário de login nem fornecer CPF ou telefone para descobrir oficinas e projetos próximos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-2xl">
            <Accessibility className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-900 block text-xs">2. Esporte Adaptado e Paraesporte (PCD)</strong>
              <p className="text-[11px] text-red-800 mt-0.5">
                Basta tocar no botão vermelho <strong>"Esporte Adaptado / Paraesporte"</strong> na barra superior para filtrar modalidades como Basquete em Cadeira de Rodas, Golbol, Atletismo Guiado e Natação Adaptada.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
            <Eye className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block text-xs">3. Alto Contraste e Leitor de Voz</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Use o botão <strong>"Contraste"</strong> no topo para visão nítida com fundo escuro e amarelo acessível, o botão <strong>"A"</strong> para aumentar o tamanho das letras e o ícone de som para ouvir os detalhes lidos em voz alta.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-900 block text-xs">4. Proteção Integral da Criança e Juventude</strong>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Menores de 18 anos são protegidos contra contatos diretos de estranhos. Conversas de grupos são transparentes e inscrições exigem consentimento formal do responsável legal (Art. 14 LGPD).
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
          >
            Começar a Navegar
          </button>
        </div>
      </div>
    </div>
  );
};
