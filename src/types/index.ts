export type ModalityCategory = 'todos' | 'adaptado' | 'convencional';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontScale: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReadingActive: boolean;
}

export interface SportProject {
  id: string;
  name: string;
  sport: string;
  isAdaptive: boolean;
  adaptiveDetails?: string;
  modalityType: 'adaptado' | 'convencional' | 'misto';
  programSource: 'Lei de Incentivo ao Esporte (LIE)' | 'Programa Segundo Tempo' | 'PELC (Esporte e Lazer da Cidade)' | 'Projeto Municipal' | 'Projeto Estadual';
  ageRange: string;
  minAge: number;
  maxAge: number;
  spotsAvailable: number;
  totalSpots: number;
  status: 'Inscrições Abertas' | 'Fila de Espera' | 'Em Andamento';
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  schedule: string;
  cost: 'Gratuito' | 'Gratuito (Lei de Incentivo)';
  accessibilityFeatures: string[];
  registrationProcess: string;
  registrationUrl?: string;
  contactPhone: string;
  contactEmail: string;
  organizer: string;
  description: string;
  govBadge: string;
}

export interface SportsGroup {
  id: string;
  name: string;
  sport: string;
  city: string;
  state: string;
  neighborhood: string;
  description: string;
  memberCount: number;
  isAccessible: boolean;
  meetingSchedule: string;
  locationName: string;
  messages: GroupMessage[];
}

export interface GroupMessage {
  id: string;
  senderNickname: string;
  isMinor: boolean;
  text: string;
  timestamp: string;
}

export interface UserProfileLGPD {
  nickname: string;
  birthDate?: string;
  age?: number;
  isMinor: boolean;
  guardianConsent?: {
    guardianName: string;
    guardianKinship: string;
    guardianDocType: 'Responsável Legal' | 'Pai/Mãe' | 'Tutor(a)';
    consentTimestamp: string;
    acceptedTerms: boolean;
    verified?: boolean;
  };
  favoriteProjectIds: string[];
  notificationPrefs: {
    enabled: boolean;
    deviceToken: string;
    registeredSports: string[];
    radiusKm: number;
    adaptiveOnly: boolean;
  };
}
