import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAge, isMinorUser, validateGuardianConsent, sanitizeUserProfile } from './lgpd.js';

test('calculateAge calculates correct age based on reference date', () => {
  const refDate = new Date('2026-11-09T00:00:00Z');
  // Born 2010-11-10 -> hasn't had birthday in 2026 yet -> 15
  assert.equal(calculateAge('2010-11-10', refDate), 15);
  // Born 2010-11-08 -> already had birthday in 2026 -> 16
  assert.equal(calculateAge('2010-11-08', refDate), 16);
  // Born 2000-01-01 -> 26
  assert.equal(calculateAge('2000-01-01', refDate), 26);
});

test('isMinorUser identifies minor under 18', () => {
  assert.equal(isMinorUser(17), true);
  assert.equal(isMinorUser(15), true);
  assert.equal(isMinorUser(18), false);
  assert.equal(isMinorUser(25), false);
});

test('validateGuardianConsent rejects invalid or missing fields', () => {
  const invalid = validateGuardianConsent({
    guardianName: '',
    guardianKinship: '',
    acceptedTerms: false
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.length, 3);

  const valid = validateGuardianConsent({
    guardianName: 'Maria Silva Santos',
    guardianKinship: 'Mãe',
    acceptedTerms: true
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);
});

test('sanitizeUserProfile strips forbidden fields and respects minimization principle', () => {
  const rawData = {
    nickname: '  Carlinhos_10  ',
    birthDate: '2012-05-15',
    cpf: '123.456.789-00', // forbidden PII
    homeAddress: 'Rua das Flores, 123', // forbidden PII
    documentNumber: 'RG 45.678.901-X' // forbidden PII
  };

  const clean = sanitizeUserProfile(rawData);
  assert.equal(clean.nickname, 'Carlinhos_10');
  assert.equal(clean.birthDate, '2012-05-15');
  assert.equal(clean.isMinor, true);
  assert.equal((clean as Record<string, unknown>).cpf, undefined);
  assert.equal((clean as Record<string, unknown>).homeAddress, undefined);
  assert.equal((clean as Record<string, unknown>).documentNumber, undefined);
});
