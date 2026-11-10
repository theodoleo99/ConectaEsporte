/**
 * Utilitários de Conformidade Legal: LGPD (Lei 13.709/2018)
 * e Proteção da Criança e do Adolescente (ECA - Lei 8.069/1990)
 */

export interface GuardianConsentInput {
  guardianName: string;
  guardianKinship: string;
  acceptedTerms: boolean;
}

/**
 * Calcula a idade com precisão com base na data de nascimento (YYYY-MM-DD).
 */
export function calculateAge(birthDateString: string, referenceDate: Date = new Date()): number {
  const parts = birthDateString.split('-');
  if (parts.length !== 3) return 0;
  
  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10) - 1; // 0-indexed
  const birthDay = parseInt(parts[2], 10);

  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return 0;

  let age = referenceDate.getFullYear() - birthYear;
  const monthDiff = referenceDate.getMonth() - birthMonth;

  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDay)) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Verifica se o usuário é menor de idade (menor de 18 anos segundo a legislação brasileira).
 */
export function isMinorUser(age: number): boolean {
  return age < 18;
}

/**
 * Valida a autorização formal do responsável legal (Art. 14 da LGPD e ECA).
 */
export function validateGuardianConsent(consent: GuardianConsentInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!consent.guardianName || consent.guardianName.trim().length < 3) {
    errors.push('Nome do responsável legal é obrigatório e deve ter ao menos 3 caracteres.');
  }

  if (!consent.guardianKinship || consent.guardianKinship.trim().length < 2) {
    errors.push('Grau de parentesco ou tutela legal é obrigatório.');
  }

  if (!consent.acceptedTerms) {
    errors.push('É necessário aceitar formalmente o termo de consentimento dos pais/responsáveis.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Princípio da Minimização de Dados (LGPD Art. 6º, III):
 * Assegura que nenhum dado proibido ou excessivo (CPF, RG, endereço residencial completo)
 * seja gravado no armazenamento local ou enviado ao servidor.
 */
export function sanitizeUserProfile(raw: Record<string, unknown>): {
  nickname: string;
  birthDate?: string;
  age?: number;
  isMinor: boolean;
} {
  const nickname = typeof raw.nickname === 'string' && raw.nickname.trim().length > 0
    ? raw.nickname.trim().slice(0, 30)
    : 'Atleta Conecta';

  let birthDate: string | undefined = undefined;
  let age: number | undefined = undefined;
  let isMinor = false;

  if (typeof raw.birthDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.birthDate)) {
    birthDate = raw.birthDate;
    age = calculateAge(birthDate);
    isMinor = isMinorUser(age);
  } else if (typeof raw.age === 'number' && raw.age > 0) {
    age = Math.min(120, Math.max(1, raw.age));
    isMinor = isMinorUser(age);
  }

  return {
    nickname,
    birthDate,
    age,
    isMinor
  };
}
