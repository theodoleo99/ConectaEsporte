/**
 * Catálogo Oficial e Rotina de Higienização e Normalização de Nomes de Esportes
 * Base de Dados Gov.br (Ministério do Esporte - LIE, PST, PELC e Municípios)
 */

export interface SportTaxonomyItem {
  canonicalName: string;
  category: 'coletivo_bola' | 'raquete' | 'aquatico' | 'atletismo' | 'lutas' | 'rodas_radicais' | 'ginastica' | 'precisao_outros' | 'pcd_paraesporte' | 'comunitario_lazer';
  categoryLabel: string;
  isAdaptive: boolean;
  rawAliases: string[];
}

export const CANONICAL_SPORTS_CATALOG: SportTaxonomyItem[] = [
  // 1. Esportes Individuais e Coletivos Convencionais
  // Esportes Coletivos com Bola
  {
    canonicalName: 'Futebol de Campo',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['futebol', 'futebol campo', 'futebol 11', 'campo', 'pelada campo']
  },
  {
    canonicalName: 'Futsal',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['futebol de salao', 'fut sal', 'futsal masculino', 'futsal feminino', 'salao']
  },
  {
    canonicalName: 'Basquetebol',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['basquete', 'basketball', 'basquete 5x5', 'bola ao cesto']
  },
  {
    canonicalName: 'Basquete 3x3',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['basquete 3 contra 3', 'basquete rua', '3x3', 'basquete trio']
  },
  {
    canonicalName: 'Voleibol',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['volei', 'volleyball', 'volei de quadra', 'volei indoor']
  },
  {
    canonicalName: 'Vôlei de Praia',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['volei de areia', 'beach volley', 'futevolei e volei de praia']
  },
  {
    canonicalName: 'Handebol',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['handball', 'handebol de quadra', 'hand']
  },
  {
    canonicalName: 'Rugby',
    category: 'coletivo_bola',
    categoryLabel: 'Coletivos com Bola',
    isAdaptive: false,
    rawAliases: ['rugbi', 'rugby union', 'rugby sevens', 'rugby 7s']
  },

  // Esportes de Raquete
  {
    canonicalName: 'Tênis de Campo',
    category: 'raquete',
    categoryLabel: 'Esportes de Raquete',
    isAdaptive: false,
    rawAliases: ['tenis', 'lawn tennis', 'tenis quadra']
  },
  {
    canonicalName: 'Tênis de Mesa',
    category: 'raquete',
    categoryLabel: 'Esportes de Raquete',
    isAdaptive: false,
    rawAliases: ['ping pong', 'ping-pong', 'mesatenismo', 'tenis de mesa convencional']
  },
  {
    canonicalName: 'Badminton',
    category: 'raquete',
    categoryLabel: 'Esportes de Raquete',
    isAdaptive: false,
    rawAliases: ['peteca com raquete', 'badmington']
  },
  {
    canonicalName: 'Beach Tennis',
    category: 'raquete',
    categoryLabel: 'Esportes de Raquete',
    isAdaptive: false,
    rawAliases: ['tenis de praia', 'beach-tennis', 'tenis na areia']
  },
  {
    canonicalName: 'Squash',
    category: 'raquete',
    categoryLabel: 'Esportes de Raquete',
    isAdaptive: false,
    rawAliases: ['esquash', 'squash court']
  },

  // Esportes Aquáticos
  {
    canonicalName: 'Natação',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['natacao', 'natacao infantil', 'natacao adulto', 'pratica aquatica']
  },
  {
    canonicalName: 'Hidroginástica',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['hidro', 'hidroginastica convencional', 'ginastica na agua']
  },
  {
    canonicalName: 'Polo Aquático',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['water polo', 'polo aquatico']
  },
  {
    canonicalName: 'Saltos Ornamentais',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['salto ornamental', 'trampolim']
  },
  {
    canonicalName: 'Nado Artístico',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['nado sincronizado', 'nado artistico']
  },
  {
    canonicalName: 'Surf',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['surfe', 'surf de prancha', 'escolinha de surf']
  },
  {
    canonicalName: 'Bodyboard',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['bodyboarding', 'body board']
  },
  {
    canonicalName: 'Canoagem',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['canoa havaiana', 'caiaque', 'kayak', 'canoagem velocidade']
  },
  {
    canonicalName: 'Remo',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['remo olimpico', 'rowing', 'remada']
  },
  {
    canonicalName: 'Stand Up Paddle',
    category: 'aquatico',
    categoryLabel: 'Esportes Aquáticos',
    isAdaptive: false,
    rawAliases: ['sup', 'stand up paddle surf', 'prancha a remo']
  },

  // Atletismo e Corrida
  {
    canonicalName: 'Atletismo (Corrida, Saltos, Arremessos)',
    category: 'atletismo',
    categoryLabel: 'Atletismo e Corrida',
    isAdaptive: false,
    rawAliases: ['atletismo', 'pista e campo', 'salto em distancia', 'arremesso de peso']
  },
  {
    canonicalName: 'Corrida de Rua',
    category: 'atletismo',
    categoryLabel: 'Atletismo e Corrida',
    isAdaptive: false,
    rawAliases: ['corrida', 'running', 'corrida pedestre', 'clube de corrida']
  },
  {
    canonicalName: 'Caminhada Orientada',
    category: 'atletismo',
    categoryLabel: 'Atletismo e Corrida',
    isAdaptive: false,
    rawAliases: ['caminhada', 'caminhada supervisada', 'grupo de caminhada']
  },

  // Artes Marciais e Esportes de Luta
  {
    canonicalName: 'Judô',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['judo', 'judo convencional', 'caminho suave']
  },
  {
    canonicalName: 'Karatê',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['karate', 'karate-do', 'shotokan', 'kumite']
  },
  {
    canonicalName: 'Taekwondo',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['tae kwon do', 'tkd']
  },
  {
    canonicalName: 'Jiu-Jitsu',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['bjj', 'brazilian jiu jitsu', 'jiujitsu']
  },
  {
    canonicalName: 'Capoeira',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['capoeira regional', 'capoeira angola', 'roda de capoeira']
  },
  {
    canonicalName: 'Boxe',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['boxe ingles', 'pugilismo', 'boxing']
  },
  {
    canonicalName: 'Wrestling (Luta Olímpica)',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['luta olimpica', 'luta greco romana', 'wrestling livre']
  },
  {
    canonicalName: 'Kung Fu / Wushu',
    category: 'lutas',
    categoryLabel: 'Artes Marciais e Lutas',
    isAdaptive: false,
    rawAliases: ['kung fu', 'kung-fu', 'wushu', 'artes marciais chinesas']
  },

  // Esportes de Rodas e Radicais
  {
    canonicalName: 'Ciclismo (Estrada/MTB)',
    category: 'rodas_radicais',
    categoryLabel: 'Rodas e Radicais',
    isAdaptive: false,
    rawAliases: ['ciclismo', 'mountain bike', 'mtb', 'bicicleta', 'speed']
  },
  {
    canonicalName: 'BMX',
    category: 'rodas_radicais',
    categoryLabel: 'Rodas e Radicais',
    isAdaptive: false,
    rawAliases: ['bicicross', 'bmx freestyle', 'bmx racing']
  },
  {
    canonicalName: 'Skate (Street/Park)',
    category: 'rodas_radicais',
    categoryLabel: 'Rodas e Radicais',
    isAdaptive: false,
    rawAliases: ['skate', 'skateboarding', 'skate street', 'skate park']
  },
  {
    canonicalName: 'Patinação Artística/Velocidade',
    category: 'rodas_radicais',
    categoryLabel: 'Rodas e Radicais',
    isAdaptive: false,
    rawAliases: ['patinacao', 'patins', 'roller', 'patins inline']
  },
  {
    canonicalName: 'Escalada Esportiva',
    category: 'rodas_radicais',
    categoryLabel: 'Rodas e Radicais',
    isAdaptive: false,
    rawAliases: ['escalada', 'boulder', 'muro de escalada']
  },

  // Ginástica
  {
    canonicalName: 'Ginástica Artística',
    category: 'ginastica',
    categoryLabel: 'Ginástica',
    isAdaptive: false,
    rawAliases: ['ginastica olimpica', 'solo e aparelhos', 'ga']
  },
  {
    canonicalName: 'Ginástica Rítmica',
    category: 'ginastica',
    categoryLabel: 'Ginástica',
    isAdaptive: false,
    rawAliases: ['gr', 'ginastica com fitas', 'ritmica']
  },
  {
    canonicalName: 'Ginástica Aeróbica',
    category: 'ginastica',
    categoryLabel: 'Ginástica',
    isAdaptive: false,
    rawAliases: ['aerobica', 'ginastica aerobica esportiva']
  },
  {
    canonicalName: 'Ginástica Acrobática',
    category: 'ginastica',
    categoryLabel: 'Ginástica',
    isAdaptive: false,
    rawAliases: ['acrobacia', 'tumbling', 'acrogym']
  },

  // Esportes de Precisão e Outros
  {
    canonicalName: 'Tiro com Arco',
    category: 'precisao_outros',
    categoryLabel: 'Precisão e Outros',
    isAdaptive: false,
    rawAliases: ['arco e flecha', 'arquerismo', 'archery']
  },
  {
    canonicalName: 'Xadrez',
    category: 'precisao_outros',
    categoryLabel: 'Precisão e Outros',
    isAdaptive: false,
    rawAliases: ['xadrez escolar', 'jogo de xadrez', 'esporte da mente xadrez']
  },
  {
    canonicalName: 'Damas',
    category: 'precisao_outros',
    categoryLabel: 'Precisão e Outros',
    isAdaptive: false,
    rawAliases: ['jogo de damas', 'damas 64 casas', 'damas 100 casas']
  },
  {
    canonicalName: 'Esportes Eletrônicos (eSports)',
    category: 'precisao_outros',
    categoryLabel: 'Precisão e Outros',
    isAdaptive: false,
    rawAliases: ['esports', 'e-sports', 'jogos eletronicos', 'games escolares']
  },

  // 2. Esportes para Pessoas com Deficiência (PCD / Paraesporte)
  {
    canonicalName: 'Para-Atletismo',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'atletismo adaptado',
      'atletismo pcd',
      'corrida em cadeira de rodas',
      'arremessos adaptados',
      'corrida guiada',
      'paraatletismo'
    ]
  },
  {
    canonicalName: 'Para-Natação e Paracanoagem',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'natacao adaptada',
      'natacao pcd',
      'natacao paralimpica',
      'paracanoagem',
      'canoagem adaptada',
      'paranatacao'
    ]
  },
  {
    canonicalName: 'Basquetebol em Cadeira de Rodas',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'basquete em cadeira de rodas',
      'basquete em cr',
      'basquete sobre rodas',
      'bcr',
      'basquete cadeirante'
    ]
  },
  {
    canonicalName: 'Vôlei Sentado',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'volei para amputados',
      'sitting volleyball',
      'volei adaptado sentado'
    ]
  },
  {
    canonicalName: 'Futebol de Cegos (Futebol de 5)',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'futebol de 5',
      'futebol de cego',
      'futebol para deficientes visuais',
      'futebol bola sonora',
      'fut 5 cego'
    ]
  },
  {
    canonicalName: 'Futebol de PC (Paralisados Cerebrais / Futebol de 7)',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'futebol de 7',
      'futebol de 7 pc',
      'futebol pc',
      'futebol para paralisia cerebral'
    ]
  },
  {
    canonicalName: 'Handebol em Cadeira de Rodas',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'handebol em cr',
      'hcr',
      'handebol cadeirante',
      'handebol adaptado'
    ]
  },
  {
    canonicalName: 'Rugby em Cadeira de Rodas',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'rugby em cr',
      'quad rugby',
      'rugby tetraplegico',
      'rugby adaptado'
    ]
  },
  {
    canonicalName: 'Bocha Paralímpica',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'bocha adaptada',
      'boccia',
      'bocha pcd',
      'bocha para paralisia cerebral'
    ]
  },
  {
    canonicalName: 'Golbol (Goalball)',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'golbol',
      'goalball',
      'jogo de bola com sino para cegos'
    ]
  },
  {
    canonicalName: 'Para-Judô',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'judo paralimpico',
      'judo adaptado',
      'judo para deficientes visuais',
      'parajudo'
    ]
  },
  {
    canonicalName: 'Para-Taekwondo',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'taekwondo paralimpico',
      'taekwondo adaptado',
      'parataekwondo'
    ]
  },
  {
    canonicalName: 'Tênis em Cadeira de Rodas',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'tenis em cr',
      'wheelchair tennis',
      'tenis cadeirante'
    ]
  },
  {
    canonicalName: 'Tênis de Mesa Adaptado',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'ping pong adaptado',
      'para tenis de mesa',
      'tenis de mesa pcd',
      'tenis de mesa paralimpico'
    ]
  },
  {
    canonicalName: 'Para-Tiro com Arco',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'tiro com arco adaptado',
      'tiro com arco paralimpico',
      'paratiro com arco'
    ]
  },
  {
    canonicalName: 'Para-Halterofilismo',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'halterofilismo paralimpico',
      'powerlifting adaptado',
      'supino adaptado pcd'
    ]
  },
  {
    canonicalName: 'Atividades Motoras e Recreativas Adaptadas',
    category: 'pcd_paraesporte',
    categoryLabel: 'Esportes PCD / Paraesporte',
    isAdaptive: true,
    rawAliases: [
      'hidroginastica adaptada',
      'danca em cadeira de rodas',
      'capoeira adaptada',
      'recreacao motora pcd',
      'psicomotricidade adaptada'
    ]
  },

  // 3. Atividades Comunitárias, Lazer e Saúde (Programas PELC e Vida Saudável)
  {
    canonicalName: 'Ginástica para Terceira Idade / Funcional',
    category: 'comunitario_lazer',
    categoryLabel: 'Comunitárias, Lazer e Saúde',
    isAdaptive: false,
    rawAliases: [
      'ginastica terceira idade',
      'ginastica 60+',
      'ginastica para idosos',
      'treinamento funcional comunitario',
      'vida saudavel'
    ]
  },
  {
    canonicalName: 'Alongamento e Yoga Comunitário',
    category: 'comunitario_lazer',
    categoryLabel: 'Comunitárias, Lazer e Saúde',
    isAdaptive: false,
    rawAliases: [
      'alongamento',
      'yoga',
      'ioga',
      'yoga comunitario',
      'pilates solo comunitario'
    ]
  },
  {
    canonicalName: 'Dança e Ritmos (Zumba, Dança de Salão)',
    category: 'comunitario_lazer',
    categoryLabel: 'Comunitárias, Lazer e Saúde',
    isAdaptive: false,
    rawAliases: [
      'zumba',
      'danca de salao',
      'ritmos',
      'dancaterapia',
      'aerodanca'
    ]
  },
  {
    canonicalName: 'Caminhada Orientada e Práticas Corporais',
    category: 'comunitario_lazer',
    categoryLabel: 'Comunitárias, Lazer e Saúde',
    isAdaptive: false,
    rawAliases: [
      'caminhada pelc',
      'praticas corporais',
      'tai chi chuan',
      'caminhada em grupo'
    ]
  },
  {
    canonicalName: 'Jogos Tradicionais e Recreação Infantil',
    category: 'comunitario_lazer',
    categoryLabel: 'Comunitárias, Lazer e Saúde',
    isAdaptive: false,
    rawAliases: [
      'jogos tradicionais',
      'recreacao infantil',
      'brincadeiras populares',
      'rua de lazer',
      'jogos populares'
    ]
  }
];

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Rotina de Higienização e Normalização de Nomes de Modalidades:
 * Converte entradas brutas de municípios e convênios federais (ex: "Basquete em CR", "Basquete", "Fut 5")
 * para a tag canônica correspondente do catálogo oficial.
 */
export function normalizeSportName(rawInput: string): SportTaxonomyItem {
  if (!rawInput || !rawInput.trim()) {
    return CANONICAL_SPORTS_CATALOG[0];
  }

  const cleanInput = normalizeText(rawInput);

  // 1. Busca exata por nome canônico
  for (const item of CANONICAL_SPORTS_CATALOG) {
    if (normalizeText(item.canonicalName) === cleanInput) {
      return item;
    }
  }

  // 2. Busca exata por alias completo cadastrado
  for (const item of CANONICAL_SPORTS_CATALOG) {
    for (const alias of item.rawAliases) {
      if (normalizeText(alias) === cleanInput) {
        return item;
      }
    }
  }

  // 3. Heurística prioritária para Esportes PCD / Adaptados (CR, Cadeira de Rodas, Cegos, etc.)
  const hasWheelchair = cleanInput.includes('cr') || cleanInput.includes('cadeira') || cleanInput.includes('sobre rodas') || cleanInput.includes('cadeirante');
  if (hasWheelchair) {
    if (cleanInput.includes('basquete') || cleanInput.includes('bcr')) {
      return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Basquetebol em Cadeira de Rodas')!;
    }
    if (cleanInput.includes('volei') || cleanInput.includes('sentado')) {
      return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Vôlei Sentado')!;
    }
    if (cleanInput.includes('rugby')) {
      return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Rugby em Cadeira de Rodas')!;
    }
    if (cleanInput.includes('handebol')) {
      return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Handebol em Cadeira de Rodas')!;
    }
    if (cleanInput.includes('tenis')) {
      return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Tênis em Cadeira de Rodas')!;
    }
    return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Atividades Motoras e Recreativas Adaptadas')!;
  }

  if (cleanInput.includes('cegos') || cleanInput.includes('cego') || cleanInput.includes('futebol 5') || cleanInput.includes('fut 5') || cleanInput.includes('visual')) {
    return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Futebol de Cegos (Futebol de 5)')!;
  }

  if (cleanInput.includes('idoso') || cleanInput.includes('terceira idade') || cleanInput.includes('60+')) {
    return CANONICAL_SPORTS_CATALOG.find(i => i.canonicalName === 'Ginástica para Terceira Idade / Funcional')!;
  }

  // 4. Busca por alias contido na entrada
  for (const item of CANONICAL_SPORTS_CATALOG) {
    for (const alias of item.rawAliases) {
      const cleanAlias = normalizeText(alias);
      if (cleanInput.includes(cleanAlias)) {
        return item;
      }
    }
  }

  // Fallback: se não achar, encontra por similaridade parcial no nome canônico
  const partial = CANONICAL_SPORTS_CATALOG.find(item =>
    normalizeText(item.canonicalName).includes(cleanInput) || cleanInput.includes(normalizeText(item.canonicalName))
  );

  return partial || {
    canonicalName: rawInput.trim(),
    category: 'coletivo_bola',
    categoryLabel: 'Outras Modalidades',
    isAdaptive: false,
    rawAliases: [rawInput.trim()]
  };
}
