import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, Download, Trash2, CheckCircle2, User, Baby, EyeOff, Info, ArrowUpRight } from 'lucide-react';
import { UserProfileLGPD } from '../types/index.js';
import { sanitizeUserProfile } from '../utils/lgpd.js';

interface PrivacyLGPDViewProps {
  userProfile: UserProfileLGPD;
  onUpdateProfile: (updated: Partial<UserProfileLGPD>) => void;
  onResetAllData: () => void;
}

export const PrivacyLGPDView: React.FC<PrivacyLGPDViewProps> = ({
  userProfile,
  onUpdateProfile,
  onResetAllData
}) => {
  const [nicknameInput, setNicknameInput] = useState(userProfile.nickname);
  const [birthDateInput, setBirthDateInput] = useState(userProfile.birthDate || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const handleSaveMinimization = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeUserProfile({
      nickname: nicknameInput,
      birthDate: birthDateInput
    });

    onUpdateProfile({
      nickname: clean.nickname,
      birthDate: clean.birthDate,
      age: clean.age,
      isMinor: clean.isMinor
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userProfile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'conecta-esporte-lgpd-dados.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      
      {/* Header & Legal Design intro */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>LGPD · Lei Geral de Proteção de Dados (Lei 13.709/2018)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Privacidade Transparente & Proteção a Menores
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Nossa política foi desenhada segundo o conceito de <strong>Legal Design e Linguagem Simples</strong>. O ConectaEsporte não rastreia sua identidade nem vende dados pessoais.
        </p>
      </div>

      {/* 4 Pillars of Legal Protection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Minimização Total</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nenhum CPF, RG, comprovante de renda ou endereço residencial é solicitado para navegar e pesquisar vagas públicas de esporte.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Baby className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Proteção ao Menor (ECA)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menores de 18 anos são resguardados: proibição de contatos privados individuais por adultos e exigência de consentimento formal dos pais (Art. 14 LGPD).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Armazenamento Local</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Seus projetos favoritos e preferências ficam guardados na memória do seu próprio navegador/aparelho (Guest-First), sem envio a servidores terceiros.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Notificações Anônimas</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Alertas de vagas via Firebase Cloud Messaging usam identificador de dispositivo criptografado, sem vincular a seu nome, e-mail ou telefone.
          </p>
        </div>

      </div>

      {/* Interactive Data Minimization Form & Transparency Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Minimal Profile */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-red-600" />
              Meu Cadastro Mínimo Opcional
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              Opcional
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Apenas para identificar você amigavelmente nos grupos de esporte e verificar a faixa etária correta para as oficinas esportivas:
          </p>

          <form onSubmit={handleSaveMinimization} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nome Social ou Apelido:
              </label>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                maxLength={30}
                placeholder="Ex: Atleta_BeloHorizonte"
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Data de Nascimento (Usada somente para calcular a faixa etária):
              </label>
              <input
                type="date"
                value={birthDateInput}
                onChange={(e) => setBirthDateInput(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Calcula se você tem idade para modalidades infantis, juvenis, adultas ou 60+.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Salvar Preferências
              </button>

              {saveSuccess && (
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Salvo localmente!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Card: User Rights (Art. 18 LGPD) */}
        <div className="lg:col-span-6 bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-700" />
              Seus Direitos como Titular (Art. 18 LGPD)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Você tem total controle sobre seus dados armazenados neste dispositivo.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <strong className="block text-slate-900">Exportabilidade de Dados</strong>
                <span className="text-slate-500 text-[11px]">Baixe uma cópia dos seus dados e favoritos em formato JSON aberto.</span>
              </div>
              <button
                onClick={handleExportData}
                className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar</span>
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-red-200 flex items-center justify-between gap-3">
              <div>
                <strong className="block text-red-700">Direito ao Esquecimento / Exclusão</strong>
                <span className="text-slate-500 text-[11px]">Apague instantaneamente favoritos, preferências de FCM e histórico.</span>
              </div>
              <button
                onClick={() => {
                  onResetAllData();
                  setDeleteConfirmed(true);
                  setTimeout(() => setDeleteConfirmed(false), 3000);
                }}
                className="min-h-[40px] px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Tudo</span>
              </button>
            </div>

            {deleteConfirmed && (
              <div className="p-3 bg-red-600 text-white rounded-xl text-center text-xs font-bold">
                ✓ Todos os dados locais foram excluídos conforme o Art. 18 da LGPD.
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
              Base Legal: <strong>Art. 7º, II e Art. 14 da Lei 13.709/2018</strong> (cumprimento de dever público pelo Ministério do Esporte e melhor interesse da criança e do adolescente).
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
