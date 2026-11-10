import React, { useState } from 'react';
import { Users, MessageSquare, Shield, ShieldAlert, Send, Lock, UserCheck, Plus, CheckCircle, Info, Calendar, MapPin, X } from 'lucide-react';
import { SportsGroup, UserProfileLGPD, GroupMessage } from '../types/index.js';
import { calculateAge, isMinorUser, validateGuardianConsent } from '../utils/lgpd.js';
import { CANONICAL_SPORTS_CATALOG } from '../utils/sportNormalizer.js';

interface SportsGroupsViewProps {
  groups: SportsGroup[];
  userProfile: UserProfileLGPD;
  onUpdateProfile: (updated: Partial<UserProfileLGPD>) => void;
  onSendMessage: (groupId: string, messageText: string) => void;
  onCreateGroup: (newGroup: Omit<SportsGroup, 'id' | 'memberCount' | 'messages'>) => void;
}

export const SportsGroupsView: React.FC<SportsGroupsViewProps> = ({
  groups,
  userProfile,
  onUpdateProfile,
  onSendMessage,
  onCreateGroup
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string>(groups[0]?.id || '');
  const [inputText, setInputText] = useState('');
  
  // Create Group Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSport, setNewGroupSport] = useState(CANONICAL_SPORTS_CATALOG[0].canonicalName);
  const [newGroupCity, setNewGroupCity] = useState('São Paulo');
  const [newGroupNeighborhood, setNewGroupNeighborhood] = useState('');
  const [newGroupLocation, setNewGroupLocation] = useState('');
  const [newGroupSchedule, setNewGroupSchedule] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupIsAccessible, setNewGroupIsAccessible] = useState(true);

  // Minor Consent Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianKinship, setGuardianKinship] = useState('Pai/Mãe');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consentErrors, setConsentErrors] = useState<string[]>([]);
  const [tempBirthDate, setTempBirthDate] = useState(userProfile.birthDate || '2010-06-15');
  const [tempNickname, setTempNickname] = useState(userProfile.nickname || 'Atleta Conecta');

  // Track joined groups per user session
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([groups[0]?.id || '']);

  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];

  // Age calculation and Minor Protection check
  const calculatedAge = userProfile.birthDate ? calculateAge(userProfile.birthDate) : userProfile.age || 25;
  const isUserMinor = isMinorUser(calculatedAge);
  const hasGuardianConsent = !!userProfile.guardianConsent?.verified;

  const isCurrentGroupJoined = joinedGroupIds.includes(activeGroup?.id || '');

  const handleJoinGroup = (groupId: string) => {
    // If minor and no consent, trigger parental authorization modal
    if (isUserMinor && !hasGuardianConsent) {
      setShowConsentModal(true);
      return;
    }

    if (!joinedGroupIds.includes(groupId)) {
      setJoinedGroupIds(prev => [...prev, groupId]);
    }
  };

  const handleAttemptSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!isCurrentGroupJoined) {
      handleJoinGroup(activeGroup.id);
      return;
    }

    // Minor Protection check: If user is minor and hasn't completed guardian consent
    if (isUserMinor && !hasGuardianConsent) {
      setShowConsentModal(true);
      return;
    }

    onSendMessage(activeGroup.id, inputText.trim());
    setInputText('');
  };

  const handleSaveGuardianConsent = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateGuardianConsent({
      guardianName,
      guardianKinship,
      acceptedTerms: termsAccepted
    });

    if (!result.valid) {
      setConsentErrors(result.errors);
      return;
    }

    const age = calculateAge(tempBirthDate);
    const isMinor = isMinorUser(age);

    onUpdateProfile({
      nickname: tempNickname.trim(),
      birthDate: tempBirthDate,
      age,
      isMinor,
      guardianConsent: {
        guardianName: guardianName.trim(),
        guardianKinship: guardianKinship.trim(),
        guardianDocType: 'Responsável Legal',
        consentTimestamp: new Date().toISOString(),
        acceptedTerms: true,
        verified: true
      }
    });

    setShowConsentModal(false);
    setConsentErrors([]);

    // Auto-join active group
    if (activeGroup && !joinedGroupIds.includes(activeGroup.id)) {
      setJoinedGroupIds(prev => [...prev, activeGroup.id]);
    }

    if (inputText.trim() && activeGroup) {
      onSendMessage(activeGroup.id, inputText.trim());
      setInputText('');
    }
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDescription.trim()) return;

    onCreateGroup({
      name: newGroupName.trim(),
      sport: newGroupSport,
      city: newGroupCity.trim(),
      state: 'BR',
      neighborhood: newGroupNeighborhood.trim() || 'Centro',
      description: newGroupDescription.trim(),
      isAccessible: newGroupIsAccessible,
      meetingSchedule: newGroupSchedule.trim() || 'A combinar com o grupo',
      locationName: newGroupLocation.trim() || 'Praça ou Ginásio Público'
    });

    setIsCreateModalOpen(false);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupNeighborhood('');
    setNewGroupSchedule('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Title & Minor Protection Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" aria-hidden="true" />
            Grupos & Comunidades Esportivas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Espaço de integração local · Menores de 18 anos exigem consentimento formal do responsável legal (LGPD Art. 14 / ECA).
          </p>
        </div>

        {/* Create Community Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Comunidade</span>
          </button>
        </div>
      </div>

      {/* Main Groups & Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[580px]">
        
        {/* Left Column: Group Channels List */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Comunidades ({groups.length})
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Por modalidade e bairro
            </span>
          </div>

          <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
            {groups.map((group) => {
              const isSelected = group.id === activeGroup?.id;
              const isJoined = joinedGroupIds.includes(group.id);
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-white border-red-500/40 shadow-xs'
                      : 'border-transparent hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {group.name}
                    </span>
                    {isJoined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        Membro
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-red-600 font-semibold truncate">
                    {group.sport} · {group.neighborhood}, {group.city}
                  </span>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span className="truncate">{group.locationName}</span>
                    <span className="tabular-nums shrink-0">{group.memberCount} membros</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Minor Status Banner */}
          <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-slate-500" />
              <span>Perfil do Usuário:</span>
            </div>
            <p>
              Apelido: <strong className="text-slate-900">{userProfile.nickname}</strong> ({calculatedAge} anos {isUserMinor ? '· Menor de idade' : '· Adulto'})
            </p>
            {isUserMinor ? (
              hasGuardianConsent ? (
                <span className="text-emerald-700 font-bold block mt-1">
                  ✓ Autorizado por {userProfile.guardianConsent?.guardianName} ({userProfile.guardianConsent?.guardianKinship})
                </span>
              ) : (
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="text-red-600 hover:text-red-700 font-bold underline block mt-1"
                >
                  Autorizar com Responsável Legal (Exigido pelo ECA/LGPD)
                </button>
              )
            ) : (
              <span className="text-slate-500 text-[11px] block mt-0.5">
                Maior de 18 anos · Acesso livre para ingressar e criar grupos.
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Chat Room & Moderated Feed */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white">
          
          {/* Active Group Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {activeGroup?.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {activeGroup?.sport}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeGroup?.description} · Encontros: {activeGroup?.meetingSchedule}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!isCurrentGroupJoined ? (
                <button
                  onClick={() => handleJoinGroup(activeGroup?.id || '')}
                  className="min-h-[40px] px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Entrar no Grupo
                </button>
              ) : (
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Você faz parte</span>
                </span>
              )}
            </div>
          </div>

          {/* Privacy & Minor Direct Message Ban Notice */}
          <div className="mx-4 my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Regra de Proteção a Menores (ECA / LGPD Art. 14):</strong> Adultos podem participar livremente. Menores de 18 anos só participam com consentimento formal do responsável legal. Contato individual privado entre adultos e jovens desconhecidos é estritamente proibido.
            </p>
          </div>

          {/* Messages Feed */}
          <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto max-h-[380px]">
            {activeGroup?.messages.map((msg) => (
              <div key={msg.id} className="flex flex-col space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-900">{msg.senderNickname}</span>
                  {msg.isMinor && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      Jovem Atleta (Menor)
                    </span>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 text-[11px]">{msg.timestamp}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100/80 text-slate-800 text-xs sm:text-sm max-w-xl leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Message Input Form */}
          <form onSubmit={handleAttemptSend} className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center gap-3">
            <input
              type="text"
              placeholder={
                !isCurrentGroupJoined
                  ? 'Clique em "Entrar no Grupo" para enviar mensagens...'
                  : isUserMinor && !hasGuardianConsent
                  ? 'Consentimento dos pais necessário para postar...'
                  : `Enviar mensagem no grupo como ${userProfile.nickname}...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="min-h-[48px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-xs"
            >
              <span>{isCurrentGroupJoined ? 'Enviar' : 'Participar'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

      {/* Create New Group / Community Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Criar Nova Comunidade Esportiva
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nome do Grupo / Comunidade:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pelada Inclusiva de Sábado, Treino de Paracanoagem"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Modalidade Esportiva:
                </label>
                <select
                  value={newGroupSport}
                  onChange={(e) => setNewGroupSport(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-red-500"
                >
                  {CANONICAL_SPORTS_CATALOG.map(s => (
                    <option key={s.canonicalName} value={s.canonicalName}>
                      {s.canonicalName} ({s.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cidade:</label>
                  <input
                    type="text"
                    value={newGroupCity}
                    onChange={(e) => setNewGroupCity(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bairro:</label>
                  <input
                    type="text"
                    placeholder="Ex: Ibirapuera, Maré"
                    value={newGroupNeighborhood}
                    onChange={(e) => setNewGroupNeighborhood(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Local de Encontro:</label>
                <input
                  type="text"
                  placeholder="Ex: Ginásio Municipal, Parque ou Quadra Pública"
                  value={newGroupLocation}
                  onChange={(e) => setNewGroupLocation(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dias e Horários:</label>
                <input
                  type="text"
                  placeholder="Ex: Sábados às 09h00"
                  value={newGroupSchedule}
                  onChange={(e) => setNewGroupSchedule(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição e Objetivos:</label>
                <textarea
                  rows={3}
                  placeholder="Descreva o propósito da comunidade, equipamentos necessários e nível de treino..."
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                  required
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGroupIsAccessible}
                    onChange={(e) => setNewGroupIsAccessible(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="font-semibold text-slate-700">
                    O local possui acessibilidade para pessoas com deficiência (PCD)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Criar Comunidade
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Parental Consent Modal for Minors (LGPD Art. 14 / ECA) */}
      {showConsentModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  Autorização do Responsável Legal (LGPD Art. 14)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proteção à infância e juventude para participação comunitária
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Como você tem menos de 18 anos, a legislação brasileira exige a autorização formal do responsável (pai, mãe ou tutor legal) para interagir nos grupos esportivos.
            </p>

            {consentErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
                {consentErrors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveGuardianConsent} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Seu Apelido no App (Sem nome completo para privacidade):
                </label>
                <input
                  type="text"
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)}
                  maxLength={25}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Data de Nascimento do Jovem:
                </label>
                <input
                  type="date"
                  value={tempBirthDate}
                  onChange={(e) => setTempBirthDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nome Completo do Pai, Mãe ou Responsável Legal:
                </label>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Grau de Parentesco / Relação Legal:
                </label>
                <select
                  value={guardianKinship}
                  onChange={(e) => setGuardianKinship(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-red-500"
                >
                  <option value="Mãe">Mãe</option>
                  <option value="Pai">Pai</option>
                  <option value="Avô / Avó">Avô / Avó</option>
                  <option value="Tutor(a) Legal">Tutor(a) Legal</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-slate-600 text-[11px] leading-relaxed">
                    Eu, responsável legal indicado, autorizo a participação deste jovem nas conversas públicas do grupo comunitário de esportes do ConectaEsporte, ciente de que não haverá contato individual privado de terceiros.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowConsentModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Confirmar Autorização Legal
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
