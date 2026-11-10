import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, Accessibility, X, Check, ChevronDown, Sparkles } from 'lucide-react';
import { ModalityCategory } from '../types/index.js';
import { Coordinates, resolveLocationQuery } from '../utils/geo.js';
import { CANONICAL_SPORTS_CATALOG, SportTaxonomyItem } from '../utils/sportNormalizer.js';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  modalityFilter: ModalityCategory;
  setModalityFilter: (cat: ModalityCategory) => void;
  selectedAgeGroup: string;
  setSelectedAgeGroup: (ageGroup: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  userCoords: Coordinates;
  setUserCoords: (coords: Coordinates) => void;
  totalFilteredCount: number;
}

const AGE_GROUPS = [
  { label: 'Todas as idades', value: 'all' },
  { label: 'Crianças (6-12 anos)', value: 'child' },
  { label: 'Jovens (13-17 anos)', value: 'teen' },
  { label: 'Adultos (18-59)', value: 'adult' },
  { label: 'Terceira Idade (60+)', value: 'elderly' }
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSport,
  setSelectedSport,
  modalityFilter,
  setModalityFilter,
  selectedAgeGroup,
  setSelectedAgeGroup,
  selectedCity,
  setSelectedCity,
  userCoords,
  setUserCoords,
  totalFilteredCount
}) => {
  const [isCityInputOpen, setIsCityInputOpen] = useState(false);
  const [cityInputText, setCityInputText] = useState(selectedCity);
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [sportFilterSearch, setSportFilterSearch] = useState('');
  const sportDropdownRef = useRef<HTMLDivElement>(null);

  // Close sport dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target as Node)) {
        setIsSportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInputText.trim()) return;

    const resolved = resolveLocationQuery(cityInputText);
    if (resolved) {
      setUserCoords(resolved);
      setSelectedCity(cityInputText.trim());
      setIsCityInputOpen(false);
    } else {
      setSelectedCity(cityInputText.trim());
      setIsCityInputOpen(false);
    }
  };

  // Grouped sports filtered dynamically by typing
  const filteredSportsList = useMemo(() => {
    if (!sportFilterSearch.trim()) return CANONICAL_SPORTS_CATALOG;
    const q = sportFilterSearch.toLowerCase();
    return CANONICAL_SPORTS_CATALOG.filter(item =>
      item.canonicalName.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q) ||
      item.rawAliases.some(a => a.toLowerCase().includes(q))
    );
  }, [sportFilterSearch]);

  const sportsByCategory = useMemo(() => {
    const map = new Map<string, SportTaxonomyItem[]>();
    for (const item of filteredSportsList) {
      const list = map.get(item.categoryLabel) || [];
      list.push(item);
      map.set(item.categoryLabel, list);
    }
    return Array.from(map.entries());
  }, [filteredSportsList]);

  return (
    <section className="bg-white border-b border-slate-200 py-4 sm:py-5" aria-label="Busca e Filtros de Projetos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Prominent PCD / Esporte Adaptado Quick Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              Inclusão e Paradesporto:
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setModalityFilter('todos')}
              className={`min-h-[44px] px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                modalityFilter === 'todos'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Todas as Modalidades
            </button>

            <button
              onClick={() => setModalityFilter('adaptado')}
              aria-label="Filtrar apenas vagas de Esporte Adaptado e Paraesporte para pessoas com deficiência"
              className={`min-h-[44px] px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                modalityFilter === 'adaptado'
                  ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-500/30'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <Accessibility className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="inline sm:hidden">Esporte Adaptado (PCD)</span>
              <span className="hidden sm:inline">Esporte Adaptado / Paraesporte (PCD)</span>
            </button>

            <button
              onClick={() => setModalityFilter('convencional')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                modalityFilter === 'convencional'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Convencional
            </button>
          </div>
        </div>

        {/* Dual Search Bar: General Keyword & Reference Origin (CEP/Cidade - Google Maps) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* Main Keyword Search */}
          <div className="lg:col-span-6 relative">
            <label htmlFor="search-input" className="sr-only">
              Buscar por modalidade, nome da oficina ou bairro
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                id="search-input"
                type="text"
                placeholder="Buscar por esporte, bairro ou projeto público..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[48px] pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar texto de busca"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Location / Point of Origin (CEP or City - Google Maps reference) */}
          <div className="lg:col-span-6 flex items-center gap-2">
            <button
              onClick={() => setIsCityInputOpen(true)}
              aria-label={`Local de partida: ${selectedCity}. Clique para alterar CEP ou Cidade de referência`}
              className="w-full min-h-[48px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <MapPin className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block leading-tight">Ponto de Partida / CEP (Google Maps):</span>
                  <span className="font-semibold text-slate-900 truncate">{selectedCity}</span>
                </div>
              </div>
              <span className="text-xs text-red-600 font-bold px-2 py-1 bg-red-50 rounded-lg shrink-0">
                Alterar
              </span>
            </button>
          </div>

        </div>

        {/* Dynamic Sport Catalog Selector & Age Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Full Sports Catalog Dropdown with Dynamic Real-Time Search */}
            <div className="relative" ref={sportDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isSportDropdownOpen}
                className="min-h-[42px] px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                <span className="text-slate-500 font-normal">Modalidade:</span>
                <span className="text-red-600">{selectedSport}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu listing all Gov.br sports catalog */}
              {isSportDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 space-y-2 animate-fadeIn max-h-[420px] flex flex-col">
                  
                  {/* Dynamic search input inside dropdown */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filtrar modalidades do Gov.br..."
                      value={sportFilterSearch}
                      onChange={(e) => setSportFilterSearch(e.target.value)}
                      className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                      autoFocus
                    />
                  </div>

                  <div className="overflow-y-auto space-y-3 flex-1 pr-1">
                    
                    {/* All Sports option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSport('Todos');
                        setIsSportDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        selectedSport === 'Todos' ? 'bg-red-50 text-red-700 font-bold' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span>Todos os Esportes</span>
                      {selectedSport === 'Todos' && <Check className="w-4 h-4 text-red-600" />}
                    </button>

                    {/* Grouped categories */}
                    {sportsByCategory.map(([categoryLabel, items]) => (
                      <div key={categoryLabel} className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                          {categoryLabel}
                        </span>
                        <div className="space-y-0.5">
                          {items.map(sport => {
                            const isSelected = selectedSport === sport.canonicalName;
                            return (
                              <button
                                key={sport.canonicalName}
                                type="button"
                                onClick={() => {
                                  setSelectedSport(sport.canonicalName);
                                  setIsSportDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-red-600 text-white font-bold'
                                    : 'hover:bg-slate-100 text-slate-800'
                                }`}
                              >
                                <span className="truncate">{sport.canonicalName}</span>
                                {sport.isAdaptive && (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ml-1.5 shrink-0 ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                                  }`}>
                                    PCD
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}
            </div>

            {/* Age Group Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Faixa Etária:</span>
              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                aria-label="Filtrar por faixa etária"
                className="min-h-[42px] px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:border-red-500"
              >
                {AGE_GROUPS.map(ag => (
                  <option key={ag.value} value={ag.value}>{ag.label}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Results counter indicator */}
          <div className="text-slate-600 text-xs font-medium">
            <span className="font-bold text-slate-900 tabular-nums">{totalFilteredCount}</span> projetos públicos encontrados
          </div>

        </div>

        {/* Modal / Dialog for Manual CEP or City selection */}
        {isCityInputOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Definir Ponto de Partida (CEP / Cidade)
                </h3>
                <button
                  onClick={() => setIsCityInputOpen(false)}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Informe o seu CEP ou cidade. O ConectaEsporte utilizará esse local como ponto de partida no Google Maps para calcular rotas e a distância exata até as oficinas esportivas.
              </p>

              <form onSubmit={handleApplyCity} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ex: 04329-000, São Paulo, Santos, Curitiba ou Rio de Janeiro"
                  value={cityInputText}
                  onChange={(e) => setCityInputText(e.target.value)}
                  className="w-full min-h-[48px] px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-red-500 font-medium"
                  autoFocus
                />

                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-500 text-[11px] block">Locais frequentes de referência:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Curitiba', 'Salvador', 'Santos', 'Porto Alegre'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCityInputText(c)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCityInputOpen(false)}
                    className="min-h-[44px] px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
                  >
                    Aplicar Referência
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
