import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHaversineDistance, formatDistance, resolveLocationQuery } from './geo.js';

test('calculateHaversineDistance calculates correct distance between São Paulo and Rio de Janeiro', () => {
  // SP: -23.55052, -46.633308 | RJ: -22.906847, -43.172896 (~357-360 km)
  const dist = calculateHaversineDistance(-23.55052, -46.633308, -22.906847, -43.172896);
  assert.ok(dist >= 350 && dist <= 370, `Expected ~357km, got ${dist}km`);
});

test('calculateHaversineDistance returns 0 for identical points', () => {
  const dist = calculateHaversineDistance(-23.55052, -46.633308, -23.55052, -46.633308);
  assert.equal(dist, 0);
});

test('formatDistance handles meters and kilometers accurately', () => {
  assert.equal(formatDistance(0.4), '400 m');
  assert.equal(formatDistance(3.5), '3,5 km');
  assert.equal(formatDistance(12.0), '12,0 km');
});

test('resolveLocationQuery identifies major Brazilian cities', () => {
  const spCoords = resolveLocationQuery('sao paulo');
  assert.ok(spCoords !== null);
  assert.equal(spCoords.lat, -23.55052);

  const rjCoords = resolveLocationQuery('Rio de Janeiro');
  assert.ok(rjCoords !== null);
  assert.equal(rjCoords.lat, -22.906847);
});
