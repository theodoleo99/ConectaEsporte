import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSportName, CANONICAL_SPORTS_CATALOG } from './sportNormalizer.js';

test('CANONICAL_SPORTS_CATALOG contains required categories', () => {
  assert.ok(CANONICAL_SPORTS_CATALOG.length >= 35, 'Catalog should contain comprehensive sports list');
  const categories = new Set(CANONICAL_SPORTS_CATALOG.map(c => c.category));
  assert.ok(categories.has('coletivo_bola'));
  assert.ok(categories.has('raquete'));
  assert.ok(categories.has('aquatico'));
  assert.ok(categories.has('atletismo'));
  assert.ok(categories.has('lutas'));
  assert.ok(categories.has('rodas_radicais'));
  assert.ok(categories.has('ginastica'));
  assert.ok(categories.has('precisao_outros'));
  assert.ok(categories.has('pcd_paraesporte'));
  assert.ok(categories.has('comunitario_lazer'));
});

test('normalizeSportName cleans raw municipal/federal names to canonical tags', () => {
  // "Basquete em CR" -> "Basquetebol em Cadeira de Rodas"
  assert.equal(normalizeSportName('Basquete em CR').canonicalName, 'Basquetebol em Cadeira de Rodas');
  assert.equal(normalizeSportName('Basquetebol').canonicalName, 'Basquetebol');
  assert.equal(normalizeSportName('Basquete').canonicalName, 'Basquetebol');

  // "Futebol de 5" -> "Futebol de Cegos (Futebol de 5)"
  assert.equal(normalizeSportName('futebol de 5').canonicalName, 'Futebol de Cegos (Futebol de 5)');
  assert.equal(normalizeSportName('fut 5 cego').canonicalName, 'Futebol de Cegos (Futebol de 5)');

  // "Ping Pong" -> "Tênis de Mesa"
  assert.equal(normalizeSportName('ping pong').canonicalName, 'Tênis de Mesa');

  // "Zumba" -> "Dança e Ritmos (Zumba, Dança de Salão)"
  assert.equal(normalizeSportName('zumba').canonicalName, 'Dança e Ritmos (Zumba, Dança de Salão)');

  // "Ginástica 60+" -> "Ginástica para Terceira Idade / Funcional"
  assert.equal(normalizeSportName('ginastica 60+').canonicalName, 'Ginástica para Terceira Idade / Funcional');

  // "Vôlei sentado" -> "Vôlei Sentado"
  assert.equal(normalizeSportName('volei sentado').canonicalName, 'Vôlei Sentado');
});
