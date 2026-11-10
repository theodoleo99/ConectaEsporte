import React, { useState } from 'react';
import { X, Database, Server, Smartphone, Bell, Shield, Code, ExternalLink, Check, Copy } from 'lucide-react';
import { GOV_API_ENDPOINTS_DOCS } from '../services/govDataService.js';

interface ArchitectureDocsModalProps {
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stack' | 'postgis' | 'govbr' | 'lgpd'>('stack');
  const [copiedQuery, setCopiedQuery] = useState(false);

  const samplePostgisQuery = `-- 1. Habilitação da extensão PostGIS no PostgreSQL
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabela de Projetos Esportivos com Geometria WGS 84 (SRID 4326)
CREATE TABLE public_sports_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sport VARCHAR(100) NOT NULL,
    is_adaptive BOOLEAN NOT NULL DEFAULT false,
    program_source VARCHAR(100) NOT NULL,
    age_range VARCHAR(50) NOT NULL,
    spots_available INT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criação de Índice Espacial GIST para buscas ultra-rápidas em milissegundos
CREATE INDEX idx_sports_projects_geo 
ON public_sports_projects USING GIST (location);

-- 4. Query de Busca por Raio (ex: usuário em São Paulo -23.5505, -46.6333 num raio de 10km)
SELECT 
    id, name, sport, is_adaptive, program_source, city,
    ROUND((ST_Distance(location, ST_MakePoint(-46.6333, -23.5505)::geography) / 1000)::numeric, 1) AS distance_km
FROM public_sports_projects
WHERE ST_DWithin(
    location,
    ST_MakePoint(-46.6333, -23.5505)::geography,
    10000 -- Raio de 10.000 metros (10 km)
)
AND (is_adaptive = true OR $1 = 'all')
ORDER BY location <-> ST_MakePoint(-46.6333, -23.5505)::geography
LIMIT 50;`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(samplePostgisQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Arquitetura de Dados & Engenharia ConectaEsporte
              </h2>
              <p className="text-xs text-slate-500">
                Integração Gov.br, NestJS, PostgreSQL + PostGIS e Proteção LGPD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar janela de arquitetura"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stack')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'stack' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stack & Especificações
          </button>

          <button
            onClick={() => setActiveTab('postgis')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'postgis' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PostgreSQL + PostGIS (SQL)
          </button>

          <button
            onClick={() => setActiveTab('govbr')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'govbr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fontes Dados Abertos (Gov.br)
          </button>

          <button
            onClick={() => setActiveTab('lgpd')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'lgpd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Conformidade LGPD & ECA
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          
          {activeTab === 'stack' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-red-600" />
                    Mobile Client (iOS & Android)
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    <strong>React Native</strong> com interface touch-first de alto contraste, alvos de toque maiores que 48dp, suporte nativo a TalkBack/VoiceOver e armazenamento local para uso anônimo ("Guest First").
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-blue-600" />
                    Backend Serverless
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    <strong>Node.js com NestJS</strong> rodando em arquitetura serverless (Cloud Functions / Cloud Run) para elasticidade e custo zero quando ocioso, ingerindo e normalizando APIs do Gov.br.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-600" />
                    Banco de Dados Geoespacial
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    <strong>PostgreSQL com PostGIS</strong> para consultas de raio de proximidade via <code>ST_DWithin</code> e índices espaciais GIST, garantindo respostas sub-milissegundo para raio de CEP e GPS.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-600" />
                    Notificações Push
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    <strong>Firebase Cloud Messaging (FCM)</strong> com registro anônimo de tokens de dispositivo vinculados apenas a tópicos esportivos, sem vincular CPF ou identificação pessoal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'postgis' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  Schema DDL e Query Espacial PostGIS:
                </span>
                <button
                  onClick={handleCopyCode}
                  className="min-h-[36px] px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold flex items-center gap-1"
                >
                  {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedQuery ? 'Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {samplePostgisQuery}
              </pre>
            </div>
          )}

          {activeTab === 'govbr' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                O ConectaEsporte conecta-se às bases de dados oficiais do Ministério do Esporte disponibilizadas no Portal Brasileiro de Dados Abertos:
              </p>

              <div className="space-y-2">
                {GOV_API_ENDPOINTS_DOCS.map((doc, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{doc.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                        {doc.format}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{doc.description}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-600 hover:underline text-[11px] font-semibold inline-flex items-center gap-1 mt-1"
                    >
                      <span>Acessar Conjunto de Dados dados.gov.br</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lgpd' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 space-y-1">
                <span className="font-bold block">Art. 14 da Lei 13.709/2018 (Tratamento de Dados de Crianças e Adolescentes):</span>
                <p className="text-[11px] leading-relaxed">
                  "O tratamento de dados pessoais de crianças e de adolescentes deverá ser realizado em seu melhor interesse (...) com o consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal."
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-slate-700">
                <p>
                  <strong>Minimização de Dados:</strong> O aplicativo funciona em modo "Guest First", garantindo que a busca pública de oficinas e paraesporte nunca exija autenticação ou fornecimento de documentos pessoais.
                </p>
                <p>
                  <strong>Isolamento de Contato nos Grupos:</strong> Mensagens privadas diretas de usuários adultos para menores são tecnicamente bloqueadas no protocolo de mensagens.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
