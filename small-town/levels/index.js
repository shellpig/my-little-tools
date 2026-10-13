import town from './town.js';
import station from './station.js';

export const LEVELS = [station, town];

export function levelById(id) {
  return LEVELS.find(l => l.id === id) ?? LEVELS[0];
}

export function newLevelLayout(id) {
  return structuredClone(levelById(id).initialLayout ?? { '#v': 2 });
}
